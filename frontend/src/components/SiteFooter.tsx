export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          Built with Next.js, Tailwind, and NASA APIs.
        </p>
        <nav className="flex items-center gap-3">
          <a
            href="https://github.com/1cbyc/skystream.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium"
            aria-label="Fork this repository on GitHub"
          >
            <span>🔱</span>
            <span>Fork on GitHub</span>
          </a>
          <a
            href="https://x.com/1cbyc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium"
            aria-label="Follow on X"
          >
            <span>✖️</span>
            <span>Follow on X</span>
          </a>
          <a
            href="https://nsisong.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-sm font-medium"
            aria-label="Visit nsisong.com"
          >
            <span>🌐</span>
            <span>nsisong.com</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}