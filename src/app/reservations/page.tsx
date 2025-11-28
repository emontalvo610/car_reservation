'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalPrice: number;
  status: string;
  car: { make: string; model: string; year: number };
  user: { name: string; email: string };
}

export default function ReservationsPage() {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/reservations?email=${email}`);
      const data = await res.json();
      setReservations(data.reservations || []);
    } catch {
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Link href="/" className="underline mb-4 inline-block">← Home</Link>
      <h1 className="text-2xl font-bold mb-4">My Reservations</h1>

      <form onSubmit={handleSearch} className="border border-black p-4 mb-6">
        <label className="block mb-2">Enter your email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-black p-1 w-full mb-3"
        />
        <button type="submit" disabled={loading} className="border border-black p-2 w-full">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {reservations.length > 0 && (
        <div>
          <h2 className="font-bold mb-3">Found {reservations.length} reservations</h2>
          {reservations.map((res) => (
            <div key={res.id} className="border border-black p-4 mb-3">
              <div className="mb-2">
                <strong>{res.car.year} {res.car.make} {res.car.model}</strong>
              </div>
              <div>Status: {res.status}</div>
              <div>From: {res.pickupLocation} ({new Date(res.startDate).toLocaleDateString()})</div>
              <div>To: {res.dropoffLocation} ({new Date(res.endDate).toLocaleDateString()})</div>
              <div>Total: ${res.totalPrice}</div>
              <Link href={`/confirmation/${res.id}`} className="inline-block border border-black p-1 mt-2">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

