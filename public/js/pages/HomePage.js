window.HomePage = HomePage

function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="my-4 text-xl font-bold">MyAnimeList</h1>
        <AnimeList title="Trending Anime" api={api.getTrendingAnime} />
        <AnimeList title="Upcoming Anime" api={api.getUpcomingAnime} />
      </div>
    </main>
  );
}

function AnimeList({ title, api }) {
  const { status, value, error } = utils.useAsync(api, true);

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
              value.data.top.slice(0, 10).map((item, index) => (
                <li key={index}>
                  <div>
                    <figure className="mb-2">
                      <img className="w-full rounded-lg" src={item.image_url} alt={`Poster for ${item.title}`} />
                    </figure>
                    <h2>{item.title}</h2>
                  </div>
                </li>
              ))
            }
          </ul>
        )
      }
    </section>
  );
}
