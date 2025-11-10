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
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          SkyStream.pro
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12">
          Explore, analyze, and experience space like never before.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.name}>
            <div className="block p-8 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300 h-full">
              <h2 className="text-2xl font-bold mb-2">{feature.name}</h2>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
