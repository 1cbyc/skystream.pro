export default function SocialDock() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href="https://github.com/1cbyc/skystream.pro/fork"
        target="_blank"
        rel="noopener noreferrer"
        title="Fork this repository on GitHub"
        aria-label="Fork this repository on GitHub"
        className="w-12 h-12 rounded-full bg-white text-black shadow-lg ring-1 ring-gray-700 flex items-center justify-center hover:scale-105 transition transform"
      >
        <span className="font-bold text-xs">GH</span>
      </a>
      <a
        href="https://x.com/1cbyc"
        target="_blank"
        rel="noopener noreferrer"
        title="Follow on X"
        aria-label="Follow on X"
        className="w-12 h-12 rounded-full bg-black text-white shadow-lg ring-1 ring-gray-700 flex items-center justify-center hover:scale-105 transition transform"
      >
        <span className="font-bold text-xs">X</span>
      </a>
      <a
        href="https://nsisong.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Visit nsisong.com"
        aria-label="Visit nsisong.com"
        className="w-12 h-12 rounded-full bg-gray-800 text-white shadow-lg ring-1 ring-gray-700 flex items-center justify-center hover:scale-105 transition transform"
      >
        <span className="text-lg">🌐</span>
      </a>
    </div>
  );
}