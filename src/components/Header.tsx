"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [isPosterMenuOpen, setIsPosterMenuOpen] = useState(false);

    const posterSubMenus = [
        { label: "素粒子物理班", href: "/poster/particle" },
        { label: "物性物理班", href: "/poster/condensed-matter" },
        { label: "宇宙物理班", href: "/poster/astrophysics" },
        { label: "生物物理班", href: "/poster/biophysics" },
        { label: "計算・数理物理班", href: "/poster/computational" },
        { label: "実験班", href: "/poster/experimental" },
    ];

    return (
        <header
            className="sticky top-0 w-full rounded-b-lg z-50"
            style={{
                backgroundColor: '#f6f3e6',
                borderBottom: '5px solid #444443'
            }}
        >
            <div className="max-w-7xl mx-auto px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* 左側：ロゴ */}
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src="/header.png"
                            alt="Physics Lab Logo"
                            width={520}
                            height={200}
                            className="h-auto w-auto max-h-[100px]"
                            priority
                        />
                    </Link>

                    {/* 右側：ナビゲーションメニュー */}
                    <nav className="flex items-center gap-8">
                        {/* アドベントカレンダー */}
                        <Link
                            href="/"
                            className="text-[#444443] hover:text-gray-600 transition-colors duration-200 font-medium text-lg"
                        >
                            アドベントカレンダー
                        </Link>

                        {/* ポスター（ドロップダウンメニュー） */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsPosterMenuOpen(true)}
                            onMouseLeave={() => setIsPosterMenuOpen(false)}
                        >
                            <button className="text-[#444443] hover:text-gray-600 transition-colors duration-200 font-medium text-lg flex items-center gap-1">
                                ポスター
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isPosterMenuOpen ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* ドロップダウンメニュー */}
                            {isPosterMenuOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                                    {posterSubMenus.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="block px-4 py-3 text-[#444443] hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 学生公演 */}
                        <Link
                            href="/performance"
                            className="text-[#444443] hover:text-gray-600 transition-colors duration-200 font-medium text-lg"
                        >
                            学生公演
                        </Link>

                        {/* 解説記事 */}
                        <Link
                            href="/articles"
                            className="text-[#444443] hover:text-gray-600 transition-colors duration-200 font-medium text-lg"
                        >
                            解説記事
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
