const contentful = require('contentful-management')

module.exports = async (registry, accessToken) => {
  const client = contentful.createClient({ accessToken })
  try {
    for (const entry of registry) {
      const spaceId = entry.sys.space.sys.id
      const space = await client.getSpace(spaceId)
      const environmentId = entry.sys.environment.sys.id
      const env = await space.getEnvironment(environmentId)
      const entryObject = await env.getEntry(entry.sys.id)
      if (entryObject.unpublish) {
        await entryObject.unpublish();
        await entryObject.delete();
      }
    }
  } catch (e) {
    console.error(e)
    console.error('dedupe failed')
    return
  }
  console.error('dedupe successful.', registry.length, 'entries removed.')
}

// deduping images
// convert image to buffer
// use hasha to convert buffer to md5 hash https://github.com/sindresorhus/hasha
//    yarn add hasha request
//    try piping directly in using streams, may go faster:
//    request(url).pipe(hasha.stream({ algorithm: 'md5' }))
//    or maybe await hasha.fromStream(request(url), { algorithm: 'md5' })
// store md5 hash in registry with image info
// check registry for collisions