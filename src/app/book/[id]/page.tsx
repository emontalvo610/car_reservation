'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
}

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [car, setCar] = useState<Car | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const pickupLocation = searchParams.get('pickupLocation') || '';
  const dropoffLocation = searchParams.get('dropoffLocation') || '';

  useEffect(() => {
    fetch(`/api/cars/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.car) setCar(data.car);
        else setError('Car not found');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load');
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const calculateTotal = () => {
    if (!car || !startDate || !endDate) return 0;
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000);
    return days * car.pricePerDay;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const userRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });

      const userData = await userRes.json();
      const userId = userData.user?.id;

      if (!userId) {
        setError('User creation failed');
        setSubmitting(false);
        return;
      }

      const resRes = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          carId: resolvedParams.id,
          startDate,
          endDate,
          pickupLocation,
          dropoffLocation,
          notes,
        }),
      });

      const resData = await resRes.json();

      if (resRes.ok) {
        router.push(`/confirmation/${resData.reservation.id}`);
      } else {
        setError(resData.error || 'Booking failed');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error && !car) return <div className="p-8">Error: {error}</div>;
  if (!car) return null;

  const total = calculateTotal();
  const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000);

  return (
    <div className="p-8">
      <Link href="/search" className="underline mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-bold mb-4">Book Car</h1>

      <div className="border border-black p-4 mb-4">
        <h2 className="font-bold mb-2">Car Details</h2>
        <div>{car.year} {car.make} {car.model}</div>
        <div>Category: {car.category}</div>
        <div>Price: ${car.pricePerDay}/day</div>
      </div>

      <div className="border border-black p-4 mb-4">
        <h2 className="font-bold mb-2">Trip Details</h2>
        <div>Pickup: {pickupLocation} on {new Date(startDate).toLocaleDateString()}</div>
        <div>Dropoff: {dropoffLocation} on {new Date(endDate).toLocaleDateString()}</div>
        <div>Duration: {days} days</div>
        <div className="font-bold mt-2">Total: ${total}</div>
      </div>

      <form onSubmit={handleSubmit} className="border border-black p-4">
        <h2 className="font-bold mb-3">Your Information</h2>

        <div className="mb-3">
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-black p-1 w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-black p-1 w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-black p-1 w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border border-black p-1 w-full"
            rows={3}
          />
        </div>

        {error && <div className="border border-black p-2 mb-3">Error: {error}</div>}

        <button type="submit" disabled={submitting} className="border border-black p-2 w-full">
          {submitting ? 'Processing...' : `Confirm - $${total}`}
        </button>
      </form>
    </div>
  );
}

