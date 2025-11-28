import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Car Reservation System</h1>
      <nav className="mb-8">
        <Link href="/search" className="mr-4 underline">Search Cars</Link>
        <Link href="/reservations" className="mr-4 underline">My Reservations</Link>
        <Link href="/admin" className="underline">Admin</Link>
      </nav>
    </div>
  );
}


