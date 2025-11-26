"use client";

import { useEffect, useState } from "react";

type Heading = {
    id: string;
    text: string;
    level: number;
};

export default function TableOfContents() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // 記事内の見出しを取得
        const elements = Array.from(
            document.querySelectorAll("article h1, article h2, article h3")
        );

        const headingData: Heading[] = elements.map((element) => ({
            id: element.id || element.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
            text: element.textContent || "",
            level: parseInt(element.tagName.substring(1)),
        }));

        // IDがない見出しにIDを付与
        elements.forEach((element, index) => {
            if (!element.id) {
                element.id = headingData[index].id;
            }
        });

        setHeadings(headingData);

        // スクロール位置を監視
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-20% 0px -80% 0px",
            }
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav className="sticky top-24 hidden lg:block">
            <div className="text-sm font-semibold text-gray-900 mb-4">目次</div>
            <ul className="space-y-2 border-l-2 border-gray-200">
                {headings.map((heading) => {
                    const isActive = activeId === heading.id;
                    const paddingLeft = `${(heading.level - 1) * 0.75}rem`;

                    return (
                        <li key={heading.id} style={{ paddingLeft }}>
                            <a
                                href={`#${heading.id}`}
                                className={`block py-1 px-3 -ml-[2px] border-l-2 transition-colors duration-200 ${isActive
                                        ? "border-[#444443] text-[#444443] font-medium"
                                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id)?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${isActive ? "bg-[#444443]" : "bg-gray-300"
                                            }`}
                                    />
                                    {heading.text}
                                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
