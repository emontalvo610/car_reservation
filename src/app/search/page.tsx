'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  currentLocation: string;
}

export const LOCATIONS = [
  { value: 'New York', label: 'New York' },
  { value: 'Los Angeles', label: 'Los Angeles' },
  { value: 'Chicago', label: 'Chicago' },
  { value: 'Houston', label: 'Houston' },
  { value: 'Miami', label: 'Miami' },
  { value: 'San Francisco', label: 'San Francisco' },
  { value: 'Seattle', label: 'Seattle' },
  { value: 'Boston', label: 'Boston' },
  { value: 'Washington D.C.', label: 'Washington D.C.' },
  { value: 'Atlanta', label: 'Atlanta' },
  { value: 'Charlotte', label: 'Charlotte' },
  { value: 'San Diego', label: 'San Diego' },
  { value: 'San Jose', label: 'San Jose' },
  { value: 'Phoenix', label: 'Phoenix' },
  { value: 'Philadelphia', label: 'Philadelphia' },
  { value: 'Austin', label: 'Austin' },
  { value: 'San Antonio', label: 'San Antonio' },
  { value: 'New Orleans', label: 'New Orleans' },
  { value: 'Las Vegas', label: 'Las Vegas' },
  { value: 'Orlando', label: 'Orlando' },
  { value: 'Kansas City', label: 'Kansas City' },
  { value: 'Nashville', label: 'Nashville' },
  { value: 'Portland', label: 'Portland' },
];

export default function SearchPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('New York');
  const [dropoffLocation, setDropoffLocation] = useState('New York');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/cars/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, pickupLocation, dropoffLocation }),
      });

      const data = await res.json();
      if (res.ok) {
        setCars(data.cars);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Link href="/" className="underline mb-4 inline-block"> Back to Home</Link>
      <h1 className="text-2xl font-bold mb-4">Search Cars</h1>

      <form onSubmit={handleSearch} className="border border-black p-4 mb-6">
        <div className="mb-3">
          <label className="block mb-1">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="border border-black p-1 w-full"
            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="border border-black p-1 w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Pickup Location:</label>
          <select name="pickupLocation" id="pickupLocation" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required className="border border-black p-1 w-full">
            {LOCATIONS.map((location) => (
              <option key={location.value} value={location.value}>{location.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block mb-1">Dropoff Location:</label>
          <select name="dropoffLocation" id="dropoffLocation" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} required className="border border-black p-1 w-full">
            {LOCATIONS.map((location) => (
              <option key={location.value} value={location.value}>{location.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="border border-black p-2 w-full">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="border border-black p-2 mb-4">Error: {error}</div>}

      {cars.length === 0 && <div className="border border-black p-2 mb-4">No cars found</div>}

      {cars.length > 0 && (
        <div>
          <h2 className="font-bold mb-3">Found {cars.length} cars</h2>
          {cars.map((car) => (
            <div key={car.id} className="border border-black p-4 mb-3">
              <div className="mb-2">
                <strong>{car.year} {car.make} {car.model}</strong>
              </div>
              <div>Category: {car.category}</div>
              <div>Location: {car.currentLocation}</div>
              <div>Price: ${car.pricePerDay}/day</div>
              <Link
                href={`/book/${car.id}?startDate=${startDate}&endDate=${endDate}&pickupLocation=${pickupLocation}&dropoffLocation=${dropoffLocation}`}
                className="inline-block border border-black p-1 mt-2"
              >
                Book
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

