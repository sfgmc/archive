#!/usr/bin/env node

const incli = require('incli');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const glob = require('glob');
const Exif = require("simple-exiftool")
const md5File = require('md5-file')
const request = require('request-promise-native');
const setProp = require('@f/set-prop');

const metadata = (file) => new Promise((resolve, reject) => {
  Exif(file, (err, results) => {
    if (err) { return reject(err); }
    resolve(results);
  })
})
const getMd5 = (file) => new Promise((resolve, reject) => {
  md5File(file, (err, results) => {
    if (err) { return reject(err); }
    resolve(results);
  })
})
const contentful = require('contentful-management')
const mime = require('mime-types')

const log = console.log;
const respond = console.log;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(fs.writeFile)
const csv = require("csvtojson");
const moment = require('moment');
const { reject, filter, chunk } = require('lodash');

const exportData = require('./export-data');
const getDuplicates = require('./get-duplicates');
const dedupeEntries = require('./dedupe-entries');

const spaceId = 'mj8q5gk08usa';
const environmentId = 'master';

const template = (type) => ({
  sys: {
    space: {
      sys: {
        type: "Link",
        linkType: "Space",
        id: "mj8q5gk08usa"
      }
    },
    type: "Entry",
    environment: {
      sys: {
        id: "master",
        type: "Link",
        linkType: "Environment"
      }
    },
    createdBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "0cw6hRlNGV9qjDGMO33q9X"
      }
    },
    updatedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "0cw6hRlNGV9qjDGMO33q9X"
      }
    },
    publishedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "0cw6hRlNGV9qjDGMO33q9X"
      }
    },
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: type,
      }
    }
  },
  fields: {
  }
});

const fileTypes = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'mpeg',
  'mpg',
  'mov',
  'mp4',
  'mkv',
  'm4a',
  'mp3',
  'wav'
]
const mediaTypes = {
  image: 'image',
  video: 'video',
  audio: 'audio',
  youtube: 'youtube',
  spotify: 'spotify',
}
const mediaTypesByExtension = {
  '.jpg': mediaTypes.image,
  '.jpeg': mediaTypes.image,
  '.png': mediaTypes.image,
  '.gif': mediaTypes.image,
  '.mpeg': mediaTypes.video,
  '.mpg': mediaTypes.video,
  '.mov': mediaTypes.video,
  '.mp4': mediaTypes.video,
  '.mkv': mediaTypes.video,
  '.m4a': mediaTypes.video,
  '.mp3': mediaTypes.audio,
  '.wav': mediaTypes.audio,
}

const commands = {
  duplicates: {
    description: 'find duplicates',
    options: [
      { option: 'path', alias: 'p', describe: 'path to the alumni file', default: null },
      { option: 'contentType', alias: 'c', describe: 'content type to dedupe', default: null },
      { option: 'field', alias: 'f', describe: 'field to dedupe against', default: null },
      { option: 'writeEntries', alias: 'e', describe: 'write found entries file', default: false },
      { option: 'writeDuplicates', alias: 'd', describe: 'write found duplicates file', default: false },
      { option: 'clean', alias: 'l', describe: 'clean out duplicates (dedupe)', default: false },
      { option: 'token', alias: 't', describe: 'management api token (needed for deduping)', default: false },
    ],
    callback: async (args) => {
      if (!args.path) {
        args.path = await exportData();
      }
      const duplicateRegistry = await getDuplicates(args.path, args.contentType, args.field, args.writeEntries, args.writeDuplicates);
      if (args.clean) {
        console.log('deduping here!')
        await dedupeEntries(duplicateRegistry, args.token);
      }
    },
  },
  assets: {
    description: 'bulk upload assets',
    options: [
      { option: 'folder', alias: 'f', describe: 'path to the folder to upload', default: null },
      { option: 'token', alias: 't', describe: 'management api token', default: false },
    ],
    callback: async (args) => {
      const client = contentful.createClient({ accessToken: args.token })

      console.log('verify folder structure, if applicable')
      console.log('pull in list of files in folder recursively')
      const mediaFiles = glob.sync(`${args.folder}/**/*.{${fileTypes.join(',')}}`);
      console.log(mediaFiles)
      console.log('loop through list')

      const space = await client.getSpace(spaceId);
      const environment = await space.getEnvironment(environmentId)

      const contentTypes = await environment.getContentTypes();
      const tagContentType = filter(contentTypes.items, (type) => type.name === 'Tags')[0]
      const tagContentId = tagContentType.sys.id;
      const mediaContentType = filter(contentTypes.items, (type) => type.name === 'Media')[0]
      const mediaContentId = mediaContentType.sys.id;
      const allTagsResponse = await environment.getEntries({ 'content_type': tagContentId });
      const allTags = allTagsResponse.items.map((item) => ({ ...item.fields, meta: item.sys }))
      const unprocessedTagId = filter(allTags, (tag) => tag && tag.tag && tag.tag['en-US'] === 'unprocessed')[0].meta.id
      console.log(unprocessedTagId);

      // keep for updating an an ad-hoc basis
      // const existingMedia = await environment.getEntries({ 'content_type': mediaContentId });
      // for (const media of existingMedia.items) {
      //   const tags = media.fields.tags ? media.fields.tags['en-US'] : [];
      //   const isUnprocessed = !!(filter(tags, (tag) => tag.sys.id === unprocessedTagId).length);
      //   if (isUnprocessed) {
      //     try {
      //       console.log(media.sys.id)
      //       const entry = await environment.getEntry(media.sys.id);
      //       // console.log(entry)
      //       // if (!entry.fields.isUnprocessed) {
      //       //   entry.fields.isUnprocessed = { 'en-US': true }
      //       // } else {
      //       //   console.log(entry.fields.isUnprocessed)
      //       // }
      //       // const updatedEntry = await entry.update();
      //       await entry.publish();
      //     } catch (e) {
      //       console.log(e)
      //       console.log('errored', media.fields.title['en-US'])
      //     }
      //   }
      // }
      // end ad-hoc update block

      for (const relativePath of mediaFiles) {
        const filePath = path.resolve(process.cwd(), relativePath);
        const fileData = await metadata(filePath);
        const fileExtension = path.extname(filePath);
        const md5 = await getMd5(filePath)
        const mimetype = mime.lookup(filePath);
        const filename = path.basename(filePath);
        const existingMedia = await environment.getEntries({ 'content_type': mediaContentId, 'fields.md5sum': md5 });
        // const existingMedia = await environment.getEntries({ 'content_type': mediaContentId });
        // console.log(existingMedia.items)
        // const items = existingMedia.items.map((item) => ({ ...item.fields, meta: item.sys }))
        // console.log(items[3].type['en-US'])
        if (existingMedia.items.length) {
          console.log('MEDIA EXISTS', filename, 'skipping upload.');
          continue;
        }

        console.log('Create Asset')
        const assetOptions = {
          fields: {
            title: {
              'en-US': filename
            },
            file: {
              'en-US': {
                contentType: mimetype,
                fileName: filename,
                file: fs.createReadStream(filePath)
              }
            }
          }
        }
        const asset = await environment.createAssetFromFiles(assetOptions);
        console.log(asset)
        const processedAsset = await asset.processForAllLocales();
        console.log(processedAsset);
        const publishedAsset = await processedAsset.publish();
        console.log(publishedAsset);
        const newMediaOpts = {
          fields: {
            title: {
              'en-US': filename,
            },
            md5sum: {
              'en-US': md5,
            },
            type: {
              'en-US': mediaTypesByExtension[fileExtension],
            },
            isUnprocessed: {
              'en-US': true,
            },
            file: {
              'en-US': {
                sys: {
                  type: 'Link', linkType: 'Asset', id: publishedAsset.sys.id
                }
              }
            }
          }
        }
        console.log(JSON.stringify(newMediaOpts, null, '  '))
        console.log(fileExtension, mediaTypesByExtension[fileExtension])
        const newEntry = await environment.createEntry(mediaContentId, newMediaOpts);
        console.log(newEntry)
        const publishedEntry = await newEntry.publish()
        console.log(publishedEntry)
      }
    },
  },
};

incli(commands);