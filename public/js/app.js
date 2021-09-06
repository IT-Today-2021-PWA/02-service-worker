const root = document.getElementById('root')

ReactDOM.render(
  getComponent(root),
  document.getElementById('root')
);

function getComponent(root) {
  switch (root.dataset.app) {
    case 'home':
      return <HomePage />;
    default:
      return <h1>Page Not Found</h1>;
  }
}
