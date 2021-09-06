window.api = {
  getTrendingAnime,
  getUpcomingAnime,
  getAnimeDetail,
  getApiUrl,
};

const API_URL = 'https://api.jikan.moe/v3';

function getApiUrl(path) {
  return API_URL + path;
}

function getTrendingAnime() {
  return axios.get(getApiUrl('/top/anime/1/airing'));
}

function getUpcomingAnime() {
  return axios.get(getApiUrl('/top/anime/1/upcoming'));
}

function getAnimeDetail(id) {
  return axios.get(getApiUrl(`/anime/${id}`));
}
