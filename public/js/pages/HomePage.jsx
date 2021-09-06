window.HomePage = HomePage

function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <h1 className="mt-4 mb-4 text-blue-700 text-xl font-bold">MyAnimeList</h1>
        <AnimeList title="Trending Anime" api={api.getTrendingAnime} />
        <AnimeList title="Upcoming Anime" api={api.getUpcomingAnime} />
      </div>
      <NavBar />
    </main>
  );
}

function AnimeList({ title, api, onClickDetail }) {
  const { status, value, execute } = utils.useAsync(api);

  return (
    <section className="bg-white p-4 rounded-lg mb-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {
        ['idle', 'pending'].includes(status) && (
          <div className="flex items-center justify-center py-4">
            <img className="animate-spin w-6 h-6 mr-3" src="/images/circle-loading-black.svg" alt="" />
            <p>Loading data...</p>
          </div>
        )
      }
      {
        status === 'success' && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6">
            {
              value.data.top.slice(0, 12).map((item, index) => (
                <li key={index}>
                  <a href={`/detail/?id=${item.mal_id}`}>
                    <figure className="mb-2">
                      <img className="w-full rounded-lg" src={item.image_url} alt={`Poster for ${item.title}`} />
                    </figure>
                    <div>{item.title}</div>
                  </a>
                </li>
              ))
            }
          </ul>
        )
      }
      {
        status === 'error' && (
          <div className="py-4 text-center">
            <p>Fetching data is error.</p>
            <p>Try again later by clicking on the refresh button.</p>
            <div className="mt-2">
              <button className="inline-flex items-center px-2 py-1 rounded-lg border border-gray-400" onClick={execute}>
                <img className="w-4 h-4 mr-2" src="/images/refresh.svg" alt="" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        )
      }
    </section>
  );
}
