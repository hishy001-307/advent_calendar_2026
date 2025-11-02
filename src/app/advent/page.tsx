import Link from 'next/link';

export default function AdventIndex() {
    // 1~25日を並べる
    const days = Array.from({ length:25 }, (_, i) => i + 1);
    
    return (
          <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Advent Calendar</h1>
      <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {days.map((d) => (
          <li key={d} className="rounded-xl border p-4 hover:bg-gray-50">
            <Link href={`/advent/${d}`}>Day {d}</Link>
          </li>
        ))}
      </ul>
    </main>  
    );
}