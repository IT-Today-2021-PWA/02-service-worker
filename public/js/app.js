const root = document.getElementById('root')

ReactDOM.render(
  getComponent(root),
  document.getElementById('root')
);

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
