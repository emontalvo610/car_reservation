'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: string;
  category: string;
  currentLocation: string;
  pricePerDay: number;
  _count: { reservations: number };
}

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  totalPrice: number;
  car: { make: string; model: string; licensePlate: string };
  user: { name: string; email: string };
}

export default function AdminPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [view, setView] = useState<'cars' | 'reservations'>('cars');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/cars').then((r) => r.json()),
      fetch('/api/reservations').then((r) => r.json()),
    ]).then(([carsData, resData]) => {
      setCars(carsData.cars || []);
      setReservations(resData.reservations || []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    
    const res = await fetch('/api/reservations');
    const data = await res.json();
    setReservations(data.reservations || []);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <Link href="/" className="underline mb-4 inline-block">← Home</Link>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-6">
        <button
          onClick={() => setView('cars')}
          className={`border border-black p-2 mr-2 ${view === 'cars' ? 'bg-black text-white' : ''}`}
        >
          Cars ({cars.length})
        </button>
        <button
          onClick={() => setView('reservations')}
          className={`border border-black p-2 ${view === 'reservations' ? 'bg-black text-white' : ''}`}
        >
          Reservations ({reservations.length})
        </button>
      </div>

      {view === 'cars' && (
        <div>
          <h2 className="font-bold mb-3">All Cars</h2>
          {cars.map((car) => (
            <div key={car.id} className="border border-black p-4 mb-3">
              <div className="mb-1">
                <strong>{car.year} {car.make} {car.model}</strong> ({car.licensePlate})
              </div>
              <div>Status: {car.status}</div>
              <div>Category: {car.category}</div>
              <div>Location: {car.currentLocation}</div>
              <div>Price: ${car.pricePerDay}/day</div>
              <div>Reservations: {car._count.reservations}</div>
            </div>
          ))}
        </div>
      )}

      {view === 'reservations' && (
        <div>
          <h2 className="font-bold mb-3">All Reservations</h2>
          {reservations.map((res) => (
            <div key={res.id} className="border border-black p-4 mb-3">
              <div className="mb-1">
                <strong>{res.car.make} {res.car.model}</strong> ({res.car.licensePlate})
              </div>
              <div>Customer: {res.user.name} ({res.user.email})</div>
              <div>From: {res.pickupLocation} ({new Date(res.startDate).toLocaleDateString()})</div>
              <div>To: {res.dropoffLocation} ({new Date(res.endDate).toLocaleDateString()})</div>
              <div>Total: ${res.totalPrice}</div>
              <div className="mt-2">
                <strong>Status: {res.status}</strong>
                <div className="mt-1">
                  <button onClick={() => updateStatus(res.id, 'CONFIRMED')} className="border border-black p-1 mr-1 text-sm">
                    Confirm
                  </button>
                  <button onClick={() => updateStatus(res.id, 'IN_PROGRESS')} className="border border-black p-1 mr-1 text-sm">
                    Start
                  </button>
                  <button onClick={() => updateStatus(res.id, 'COMPLETED')} className="border border-black p-1 mr-1 text-sm">
                    Complete
                  </button>
                  <button onClick={() => updateStatus(res.id, 'CANCELLED')} className="border border-black p-1 text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

