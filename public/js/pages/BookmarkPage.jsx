window.BookmarkPage = BookmarkPage

function BookmarkPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <h1 className="mt-4 mb-4 text-lg font-semibold">Bookmark</h1>
        <p className="mb-1">Your bookmark is empty.</p>
        <p>
          To add a bookmark, go to homepage and click on an anime you like.{' '}
          Then on the anime detail page, click on the bookmark button.
        </p>
      </div>
      <NavBar activeTab="bookmark"/>
    </main>
  );
}
