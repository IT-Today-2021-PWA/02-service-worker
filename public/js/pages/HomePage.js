window.HomePage = HomePage

function HomePage() {
  const [selectedAnime, setSelectedAnime] = React.useState(null)

  const onClickDetail = (anime) => {
    setSelectedAnime(anime)
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="mt-4 mb-4 text-blue-700 text-xl font-bold">MyAnimeList</h1>
        <AnimeList title="Trending Anime" api={api.getTrendingAnime} onClickDetail={onClickDetail} />
        <AnimeList title="Upcoming Anime" api={api.getUpcomingAnime} onClickDetail={onClickDetail} />
      </div>
      {selectedAnime && (
        <AnimeDetail anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      )}
    </main>
  );
}

function AnimeList({ title, api, onClickDetail }) {
  const { status, value, execute } = utils.useAsync(api, true);

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
                  <div onClick={() => onClickDetail(item)}>
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

function AnimeDetail({ anime, onClose }) {
  const apiGetAnimeDetail = React.useCallback(() => {
    return api.getAnimeDetail(anime.mal_id)
  }, [anime])

  const { status, value, execute } = utils.useAsync(apiGetAnimeDetail, true);

  const getYoutubeUrl = (trailerUrl) => {
    const url = new URL(trailerUrl)
    const searchParams = ['enablejsapi', 'mode', 'autoplay']
    searchParams.forEach(key => url.searchParams.delete(key))
    return url.toString()
  }

  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-gray-100">
      <section className="max-w-2xl mx-auto h-screen flex flex-col items-center justify-center bg-white">
        <nav className="flex-none flex items-center w-full shadow">
          <button className="p-4" onClick={onClose}>
            <img className="w-8 h-8" src="/images/arrow-left.svg" alt="" />
            <span className="sr-only">Go Back</span>
          </button>
        </nav>
        {
          ['idle', 'pending'].includes(status) && (
            <div className="flex-1 flex items-center justify-center py-4">
              <img className="animate-spin w-6 h-6 mr-3" src="/images/circle-loading-black.svg" alt="" />
              <p>Loading data...</p>
            </div>
          )
        }
        {
          status === 'error' && (
            <div className="flex-1 w-full px-4 flex flex-col items-center justify-center text-center">
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
        {
          status === 'success' && (
            <div className="w-full flex-1 overflow-y-auto">
              {value.data.trailer_url && (
                <div
                  className="w-full relative"
                  style={{
                    paddingTop: '56.25%',
                  }}>
                  <iframe
                    className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
                    src={getYoutubeUrl(value.data.trailer_url)}
                    title={`Trailer ${value.data.title}`}
                    allowFullScreen
                    frameBorder={0}
                  ></iframe>
                </div>
              )}
              <article className="p-4">
                <header className="flex mb-4">
                  <figure className="flex-none" style={{width: '128px'}}>
                    <img className="w-full rounded-lg" src={value.data.image_url} alt={`Poster for ${value.data.title}`}/>
                  </figure>
                  <div className="flex-1 ml-4">
                    <div className="flex mb-2">
                      <h2 className="flex-1 text-lg font-semibold mb-2 mr-2">{value.data.title}</h2>
                      {value.data.score && (
                        <div className="flex-none">
                          <span className="p-2 inline-block font-semibold text-lg rounded bg-gray-100">{value.data.score}</span>
                        </div>
                      )}
                    </div>
                    <dl>
                      <div className="flex mb-1">
                        <dt className="flex-none font-semibold" style={{width: '72px'}}>Status:</dt>
                        <dd className="break-words">{value.data.status}</dd>
                      </div>
                      <div className="flex mb-1">
                        <dt className="flex-none font-semibold" style={{width: '72px'}}>Aired:</dt>
                        <dd className="break-words">{value.data.aired.string}</dd>
                      </div>
                      <div className="flex mb-1">
                        <dt className="flex-none font-semibold" style={{width: '72px'}}>Rating:</dt>
                        <dd className="break-words">{value.data.rating}</dd>
                      </div>
                      <div className="flex mb-1">
                        <dt className="flex-none font-semibold" style={{width: '72px'}}>Genres:</dt>
                        <dd className="break-words">
                          {value.data.genres.map(genre => genre.name).join(', ')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </header>
                <section>
                  <h3 className="font-semibold mb-2">Synopsis</h3>
                  <p>{value.data.synopsis}</p>
                </section>
              </article>
            </div>
          )
        }
      </section>
    </div>
  );
}
