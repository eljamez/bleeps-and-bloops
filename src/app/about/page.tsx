import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">About Bleeps and Bloops</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="mb-6">
          Bleeps and Bloops is my creative playground, a space where I explore
          what's possible with modern web technologies. This site showcases
          interactive games, practical tools, and experimental projects, all
          built to demonstrate the engaging experiences that can be created with
          React, Next.js, and modern JavaScript.
        </p>
        <p className="mb-6">
          I enjoy creating things, and this site serves as both a portfolio and
          a laboratory. Each project here represents an opportunity to
          experiment, solve interesting problems, and create something that
          brings a bit of joy or utility to others.
        </p>

        <h2 className="text-2xl font-semibold mb-4 mt-8">About the Creator</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 mb-8">
          <Image
            src="/images/avatar.png"
            alt="James Augustus Hall"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
          <div className="flex flex-col flex-1 gap-2 justify-center">
            <h3 className="text-3xl font-semibold">James Augustus Hall</h3>
            <p className="text-lg">
              Senior Software Engineer based in Ojai, California
            </p>
          </div>
        </div>

        <p className="text-lg mb-6">
          I'm passionate about creating music, developing music software,
          designing games, and producing other forms of enjoyable media. With a
          career spanning multiple facets of software engineering, I've found my
          greatest joy at the intersection of technology and creativity.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8">
          My Engineering Journey
        </h3>
        <p className="mb-6">
          As a Senior Software Engineer, I've had the privilege of working on
          diverse projects that blend technology with entertainment and user
          experience. My work spans:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Music software development and audio / video processing</li>
          <li>Game design and interactive web applications</li>
          <li>Front-end architecture with modern frameworks</li>
          <li>Creative coding and visual experiments</li>
        </ul>
        <p className="mb-6">
          I'm constantly exploring new technologies and techniques, whether it's
          through open-source contributions, creative coding challenges, or
          building tools that solve real-world problems. The web platform's
          evolution continues to inspire me, and I love sharing that enthusiasm
          through the projects you'll find here.
        </p>

        <h2 className="text-2xl font-semibold mb-4 mt-8">
          What You'll Find Here
        </h2>
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

        <h2 className="text-2xl font-semibold mb-4 mt-8">Connect With Me</h2>
        <p className="mb-4">
          Find me around the web where I share code, connect with other
          developers, and participate in creative coding challenges:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <a
            href="https://github.com/eljamez"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              GitHub
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              @eljamez
            </span>
          </a>
          <a
            href="https://linkedin.com/in/eljamez"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              LinkedIn
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              /in/eljamez
            </span>
          </a>
          <a
            href="https://codepen.io/eljamez"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              CodePen
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              @eljamez
            </span>
          </a>
          <a
            href="https://cssbattle.dev/player/eljamez"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              CSSBattle
            </span>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              eljamez
            </span>
          </a>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visit my main website at{" "}
          <a
            href="https://eljamez.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            eljamez.com
          </a>
        </p>
      </div>
    </div>
  );
}
