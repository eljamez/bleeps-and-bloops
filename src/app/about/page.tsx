export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">About Bleeps and Bloops</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-6">
          Welcome to Bleeps and Bloops, a showcase of interactive games, useful
          tools, and creative experiments built with React and Next.js.
        </p>

        <h2 className="text-2xl font-semibold mb-4 mt-8">Our Mission</h2>
        <p className="mb-6">
          We believe in the power of web technologies to create engaging,
          interactive experiences. This site serves as a playground for
          exploring what's possible with modern web development.
        </p>

        <h2 className="text-2xl font-semibold mb-4 mt-8">What You'll Find</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>
            <strong>Games:</strong> Classic and original games reimagined for
            the web
          </li>
          <li>
            <strong>Tools:</strong> Practical utilities to make your life easier
          </li>
          <li>
            <strong>Experiments:</strong> Creative explorations of web
            technologies
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 mt-8">Technology Stack</h2>
        <p className="mb-6">All projects on this site are built using:</p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>React 19</li>
          <li>Next.js 15</li>
          <li>TypeScript</li>
          <li>Tailwind CSS v4</li>
        </ul>
      </div>
    </div>
  );
}
