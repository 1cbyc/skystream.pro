"use client";

export default function SocialDock() {
  return (
    <div
      className="fixed z-50 flex flex-col gap-2 sm:gap-3 bottom-4 right-4 sm:bottom-6 sm:right-6"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
        right: "calc(env(safe-area-inset-right, 0px) + 1rem)",
      }}
    >
      <a
        href="https://github.com/1cbyc/skystream.pro"
        target="_blank"
        rel="noopener noreferrer"
        title="Star on GitHub"
        aria-label="Star on GitHub"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black shadow-lg ring-1 ring-gray-700 flex items-center justify-center hover:scale-105 transition transform"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="fill-black">
          <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.84 10.94c.57.1.78-.25.78-.56v-2.02c-3.19.7-3.86-1.37-3.86-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.14.08 1.74 1.17 1.74 1.17 1.02 1.75 2.68 1.25 3.33.96.1-.75.4-1.25.7-1.53-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.47.11-3.07 0 0 .96-.31 3.15 1.17.91-.26 1.88-.39 2.85-.39s1.94.13 2.85.39c2.19-1.48 3.15-1.17 3.15-1.17.62 1.6.23 2.78.11 3.07.73.8 1.18 1.82 1.18 3.07 0 4.39-2.7 5.36-5.26 5.64.42.36.79 1.08.79 2.17v3.22c0 .31.21.67.79.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/>
        </svg>
      </a>
      <a
        href="https://x.com/1cbyc"
        target="_blank"
        rel="noopener noreferrer"
        title="Follow on X"
        aria-label="Follow on X"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white shadow-lg ring-1 ring-gray-700 flex items-center justify-center hover:scale-105 transition transform"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="fill-white">
          <path d="M18.14 2H21l-7.5 8.57L22.5 22H15.3l-5.82-6.86L6 22H2.14l8.19-9.36L1.5 2H8.7l5.29 6.23L18.14 2Z"/>
        </svg>
      </a>
      <a
        href="https://nsisong.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Visit nsisong.com"
        aria-label="Visit nsisong.com"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800 text-white shadow-lg ring-1 ring-gray-700 flex items-center justify-center hover:scale-105 transition transform"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="fill-white">
          <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 2c1.98 0 3.8.72 5.2 1.9-.6.52-1.28.97-2.02 1.3-.68-.66-1.48-1.2-2.36-1.6-.35-.15-.71-.28-1.08-.4a13 13 0 0 0-.74-1.2ZM6.8 5.9A8 8 0 0 0 4 12c0 .7.09 1.37.26 2 .56-.12 1.12-.31 1.65-.56.21-.49.43-.96.67-1.39-.32-.63-.58-1.31-.76-2.02-.06-.21-.11-.43-.15-.65.22-.53.5-1.03.83-1.48.1-.13.2-.26.3-.39Zm10.3 1.62c.35-.15.68-.33 1-.53A8 8 0 0 1 20 12c0 1.52-.43 2.94-1.17 4.15-.5-.12-.97-.29-1.41-.5-.3-.8-.73-1.53-1.26-2.18-.33-.12-.67-.22-1.02-.29-.5.4-1.05.72-1.64.95-.23.09-.47.17-.71.23-.76-.26-1.47-.63-2.1-1.1.22-.93.34-1.92.34-2.99 0-.82-.07-1.61-.21-2.35.58.13 1.14.33 1.66.6.78.41 1.47.97 2.07 1.63.5-.42 1.06-.77 1.65-1.02Z"/>
        </svg>
      </a>
    </div>
  );
}