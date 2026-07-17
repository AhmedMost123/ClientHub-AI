"use client";

import Image from "next/image";

interface Props {
  url: string;
  name: string;
}

export default function MessageImage({ url, name }: Props) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-[260px]">
      <Image
        src={url}
        alt={name}
        width={260}
        height={260}
        className="rounded-xl border border-white/10 object-cover shadow-sm transition-all hover:opacity-90"
      />
    </a>
  );
}
