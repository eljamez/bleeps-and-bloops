"use client";

import { useEffect } from "react";

export default function CodepenEmbed({
  slug,
  title,
  user,
}: {
  slug: string;
  title: string;
  user: string;
}) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cpwebassets.codepen.io/assets/embed/ei.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="codepen">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p
        className="codepen"
        data-height="300"
        data-theme-id="dark"
        data-default-tab="result"
        data-slug-hash={slug}
        data-pen-title={title}
        data-user={user}
        style={{
          height: "300px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid",
          margin: "1em 0",
          padding: "1em",
        }}
      >
        <span>
          See the Pen{" "}
          <a href={`https://codepen.io/${user}/pen/${slug}`}>{title}</a> by
          James Hall (<a href={`https://codepen.io/${user}`}>{user}</a>) on{" "}
          <a href="https://codepen.io">CodePen</a>
        </span>
      </p>
    </div>
  );
}
