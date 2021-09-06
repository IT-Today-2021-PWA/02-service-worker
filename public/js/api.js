window.api = {
  getTrendingAnime,
  getUpcomingAnime,
  getMostFavoriteAnime,
};

function getTrendingAnime() {
  return axios.get('https://api.jikan.moe/v3/top/anime/1/airing');
}

function getUpcomingAnime() {
  return axios.get('https://api.jikan.moe/v3/top/anime/1/upcoming');
}

function getMostFavoriteAnime() {
  return axios.get('https://api.jikan.moe/v3/top/anime/1');
}
