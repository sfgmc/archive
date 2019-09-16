export const getWindowValue = key => {
  if (!window.__archive) return null;
  return window.__archive[key];
};
export const setWindowValue = (key, value) => {
  if (!window.__archive) window.__archive = {};
  window.__archive[key] = value;
};

export const getSchema = () => getWindowValue('schema') || {};
export const getContentTypes = () => getWindowValue('contentTypes') || [];
