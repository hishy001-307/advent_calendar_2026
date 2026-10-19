"use client";

import { useEffect, useRef } from "react";
import { OFFICIAL_X_URL } from "@/constants/social";
import styles from "./Performance.module.scss";

const WIDGETS_SRC = "https://platform.twitter.com/widgets.js";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

function loadTwitterWidgets(): Promise<void> {
  if (window.twttr?.widgets) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${WIDGETS_SRC}"]`,
  );
  if (existing) {
    return new Promise((resolve) => {
      if (window.twttr?.widgets) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = WIDGETS_SRC;
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

type PerformanceTweetEmbedsProps = {
  statusIds: readonly string[];
};

export default function PerformanceTweetEmbeds({
  statusIds,
}: PerformanceTweetEmbedsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void loadTwitterWidgets().then(() => {
      if (cancelled || !containerRef.current) return;
      window.twttr?.widgets.load(containerRef.current);
    });
    return () => {
      cancelled = true;
    };
  }, [statusIds]);

  const profile = OFFICIAL_X_URL.replace(/\/$/, "");

  return (
    <div ref={containerRef} className={styles.tweets}>
      {statusIds.map((id) => (
        <div key={id} className={styles.tweetWrap}>
          <blockquote className="twitter-tweet" data-dnt="true" data-theme="dark">
            <a href={`${profile}/status/${id}`} />
          </blockquote>
        </div>
      ))}
    </div>
  );
}
