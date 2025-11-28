'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalPrice: number;
  status: string;
  car: { make: string; model: string; year: number; licensePlate: string };
  user: { name: string; email: string };
}

export default function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reservations/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reservation) setReservation(data.reservation);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!reservation) return <div className="p-8">Reservation not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Reservation Confirmed</h1>

      <div className="border border-black p-4 mb-4">
        <div className="mb-2"><strong>Confirmation ID:</strong> {reservation.id}</div>
        <div className="mb-2"><strong>Status:</strong> {reservation.status}</div>
        <div><strong>Total:</strong> ${reservation.totalPrice}</div>
      </div>

      <div className="border border-black p-4 mb-4">
        <h2 className="font-bold mb-2">Vehicle</h2>
        <div>{reservation.car.year} {reservation.car.make} {reservation.car.model}</div>
        <div>License: {reservation.car.licensePlate}</div>
      </div>

      <div className="border border-black p-4 mb-4">
        <h2 className="font-bold mb-2">Trip</h2>
        <div>Pickup: {reservation.pickupLocation} on {new Date(reservation.startDate).toLocaleDateString()}</div>
        <div>Dropoff: {reservation.dropoffLocation} on {new Date(reservation.endDate).toLocaleDateString()}</div>
      </div>

      <div className="border border-black p-4 mb-4">
        <h2 className="font-bold mb-2">Contact</h2>
        <div>Name: {reservation.user.name}</div>
        <div>Email: {reservation.user.email}</div>
      </div>

      <Link href="/" className="border border-black p-2 inline-block mr-2">Home</Link>
      <Link href="/reservations" className="border border-black p-2 inline-block">My Reservations</Link>
    </div>
  );
}

