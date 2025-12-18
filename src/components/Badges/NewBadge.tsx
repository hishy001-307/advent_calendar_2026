import React from "react";

type NewBadgeProps = {
  children?: React.ReactNode; // 表示文言を差し替え可能に（デフォルト new!）
  className?: string;         // 外側から微調整したい場合用
};

export default function NewBadge({
  children = "new!",
  className = "",
}: NewBadgeProps) {
  return (
    <span
      className={[
        "rounded-full border border-zinc-900 bg-white px-2 py-0.5 text-[10px] font-bold text-zinc-900",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
