import { filter, reject, cloneDeep } from 'lodash';
import * as keyfinder from 'keyfinder';
import { client } from './contentful'
import * as moment from 'moment';
import * as queryString from 'query-string';
import Router from 'next/router'

const unprocessedTagId = '17bFKTJnk1BQQl5fw552ty'

export const initialState = {
  entries: [],
  contentTypes: [],
  tags: [],
  searchTerm: '',
  shouldIncludeAdmin: false,
  shouldFilterByDate: false,
  filterByDateRange: null,
  filterByTags: [],
  filterByContentTypes: ['stories', 'media'],
  initialEntry: null,
}

export const normalizeEntry = (entry) => {
  if (!!entry.sys && !!entry.sys.contentType) {
    switch (entry.sys.contentType.sys.id) {
      case 'media':
        return mapMedia()(entry)
        break;
      case 'stories':
        return mapStories()(entry)
        break;
      default:
        return mapDefault()(entry)
    }
  }
  return entry;
}


export const mapDefault = (stack = 0) => (item) => {
  if (stack > 2) return item;
  stack += 1
  return {
    ...item.fields,
    meta: item.sys,
    contentType: item.sys && item.sys.contentType.sys.id,
  }
}

export const mapMedia = (state, stack = 0) => (item) => {
  if (stack > 2) return item;
  stack += 1
  if (!item.sys.contentType) { return item; }
  state = state || { filterByTags: [] }
  const tags = (item.fields.tags || []).map((tag) => tag.fields)
  return {
    ...item.fields,
    tags,
    contentType: 'media',
    file: (item.fields.type === 'image' || item.fields.type === 'video') ? item.fields.file.fields.file.url : null,
    alumni: (item.fields.alumni || []).map(mapDefault(stack)),
    location: (item.fields.location || []).map(mapDefault(stack)),
    stories: (item.fields.stories || []).map(mapStories(state, stack)),
    shouldFilterOut: !!state.filterByTags.length && !(filter(tags.map(tag => tag.tag), (tag) => state.filterByTags.includes(tag)).length),
    meta: item.sys,
  }
}
export const mapStories = (state, stack = 0) => (item) => {
  if (stack > 2) return item;
  stack += 1
  if (!item.sys.contentType) { return item; }
  state = state || { filterByTags: [] }
  const tags = (item.fields.tags || []).map((tag) => tag.fields)
  return {
    ...item.fields,
    tags,
    contentType: 'story',
    alumni: (item.fields.alumni || []).map(mapDefault(stack)),
    location: (item.fields.location || []).map(mapDefault(stack)),
    media: (item.fields.media || []).map(mapMedia(state, stack)),
    story: keyfinder(item.fields.story, 'value'),
    rawStory: item.fields.story,
    shouldFilterOut: !!state.filterByTags.length && !(filter(tags.map(tag => tag.tag), (tag) => state.filterByTags.includes(tag)).length),
    meta: item.sys,
  }
}

export const retrieveSearchResults = async ({ state, setState }) => {

  // set url
  const stringUrlParams = window.location.search;
  const urlParams = queryString.parse(stringUrlParams);
  if (state.searchTerm.length) {
    urlParams.query = state.searchTerm;
  } else {
    delete urlParams.query
  }
  if (state.shouldShowUnprocessed) {
    urlParams.unprocessed = state.shouldShowUnprocessed;
  } else {
    delete urlParams.unprocessed
  }
  if (state.filterByTags.length) {
    urlParams.tags = state.filterByTags.join(',');
  } else {
    delete urlParams.tags
  }
  if (state.filterByContentTypes.length) {
    urlParams.types = state.filterByContentTypes.join(',');
  } else {
    delete urlParams.types
  }
  if (state.filterByDateRange && state.shouldFilterByDate) {
    urlParams.dates = state.filterByDateRange.join(',');
  } else if (urlParams.dates) {
    delete urlParams.dates
  }
  const convertedUrlParams = queryString.stringify(urlParams);
  const href = `/${!!convertedUrlParams.length ? `?${convertedUrlParams}` : ''}`;
  Router.push(href, href, { shallow: true });

  // get content types
  const contentTypeResponse = await client.getContentTypes();
  const contentTypes = contentTypeResponse.items.map((item) => {
    return {
      id: item.sys.id,
      label: item.name,
      meta: item.sys,
    }
  })

  // get tags
  const tagsResponse = await client.getEntries({ content_type: 'tags' })
  const tags = tagsResponse.items.map((item) => {
    const thisTag = cloneDeep(item);
    const newTag = {
      ...thisTag.fields,
      contentType: 'tag',
      meta: thisTag.sys,
    }
    return newTag
  })

  // get searches
  let entries = [];
  const filterByContentTypes = state.filterByContentTypes.length ? state.filterByContentTypes : state.contentTypes.map(type => type.id);
  for (const content_type of filterByContentTypes) {
    if (!filter(contentTypes, { id: content_type }).length) { continue; }
    const searchParams = { content_type, include: 2 }
    if (state.searchTerm.length) {
      searchParams.query = state.searchTerm
    }
    if (state.shouldFilterByDate && state.filterByDateRange && state.filterByDateRange.length) {
      searchParams['fields.date[gte]'] = moment(state.filterByDateRange[0]).format();
      searchParams['fields.date[lte]'] = moment(state.filterByDateRange[1]).format();
    }
    if (state.filterByTags && state.filterByTags.length) {
      for (const filterTag of state.filterByTags) {
        const thisTag = filter(tags, (tag) => tag.tag === filterTag)[0];
        if (!thisTag) { continue; }
        searchParams['fields.tags.sys.id'] = thisTag.meta.id;
      }
    }
    if (content_type === 'media' && !state.shouldShowUnprocessed) {
      searchParams['fields.isUnprocessed[ne]'] = true;
    }
    const response = await client.getEntries(searchParams);
    switch (content_type) {
      case 'media':
        let media = response.items.map(mapMedia(state))
        media = reject(media, item => item.shouldFilterOut)
        entries = entries.concat(media)
        break;
      case 'stories':
        let stories = response.items.map(mapStories(state))
        stories = reject(stories, item => item.shouldFilterOut)
        entries = entries.concat(stories)
        break;
      default:
        const defaultEntries = response.items.map(mapDefault())
        entries = entries.concat(defaultEntries)
    }
  }
  // set new state
  if (typeof setState === 'function') {
    setState({
      contentTypes,
      entries,
      tags,
    })
  } else {
    const {
      setContentTypes,
      setEntries,
      setTags,
    } = setState;
    setContentTypes(contentTypes);
    setEntries(entries);
    setTags(tags);
  }
}