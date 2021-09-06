const root = document.getElementById('root')

ReactDOM.render(
  getComponent(root),
  document.getElementById('root')
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
    console.log('Instalasi service worker sukses:', registration)
  }, function (error) {
    console.log('Instalasi service worker gagal:', error)
  })
} else {
  console.log('Service worker tidak didukung.')
}

function getComponent(root) {
  const url = new URL(window.location.href)

  switch (root.dataset.app) {
    case 'home':
      return <HomePage url={url} />;
    case 'detail':
      return <DetailPage url={url} />;
    case 'bookmark':
      return <BookmarkPage url={url} />;
    default:
      return <h1>Page Not Found</h1>;
  }
}
