import Link from 'next/link';

export default function Home() {
  const features = [
    {
      name: 'APOD Mood Visualizer',
      href: '/mood',
      description: 'Experience the cosmos through color and emotion with the Astronomy Picture of the Day.',
    },
    {
      name: 'NEOWS Impact Explorer',
      href: '/impact',
      description: 'Track near-Earth objects and simulate their potential impact on our planet.',
    },
    {
      name: 'Capsule Generator',
      href: '/capsule',
      description: 'Create a snapshot of the cosmos on any given day, like your birthday.',
    },
    {
      name: 'Mars Explorer',
      href: '/mars',
      description: 'Browse the latest images from the Mars rovers, curated and labeled by AI.',
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <section className="relative w-full text-center max-w-5xl mx-auto overflow-hidden">
        {/* Decorative starfield + glow */}
        <div
          className="absolute inset-0 -z-10 opacity-50 bg-stars"
          aria-hidden="true"
        />
        <div
          className="absolute -z-10 right-[-80px] top-[-80px] w-64 h-64 rounded-full blur-2xl opacity-40 animate-float-slow"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(167,139,250,0.55), transparent 60%)",
          }}
          aria-hidden="true"
        />

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_1px_8px_rgba(99,102,241,0.15)] animate-fade-in-up">
          SkyStream.pro
        </h1>
        <p
          className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "120ms" }}
        >
          Explore, analyze, and experience space like never before.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.name}>
            <div className="group block p-8 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 h-full ring-1 ring-gray-700/60 hover:ring-gray-600 motion-safe:transition-transform hover:-translate-y-0.5 hover:shadow-lg">
              <h2 className="text-2xl font-bold mb-2">{feature.name}</h2>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
