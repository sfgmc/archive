export const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1);
export const mediaQueries = {
  sm: 'screen and (max-width: 750px)',
  lg: 'screen and (min-width: 900px)'
};

export const getYoutubeId = url => {
  // https://stackoverflow.com/a/8260383/2581354
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
};

export const getYoutubeThumbnail = url => {
  // https://stackoverflow.com/a/2068371/2581354
  const id = getYoutubeId(url);
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

export const contentTypeColors = {
  media: 'teal',
  story: 'yellow',
  alumnus: 'blue',
  location: 'green'
};
