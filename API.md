# Car Reservation API Documentation

## Base URL
`http://localhost:3000/api`

## Endpoints

### Users

#### Create/Get User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

#### Get All Users
```http
GET /api/users
```

### Cars

#### Get All Cars
```http
GET /api/cars
```

#### Get Single Car
```http
GET /api/cars/:id
```

#### Create Car
```http
POST /api/cars
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "licensePlate": "ABC123",
  "category": "MIDSIZE",
  "currentLocation": "New York",
  "pricePerDay": 45
}
```

#### Update Car
```http
PATCH /api/cars/:id
Content-Type: application/json

{
  "status": "AVAILABLE",
  "currentLocation": "Boston"
}
```

#### Search Available Cars
```http
POST /api/cars/search
Content-Type: application/json

{
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "pickupLocation": "New York",
  "dropoffLocation": "Boston",
  "category": "MIDSIZE"  // optional
}
```

### Reservations

#### Get All Reservations
```http
GET /api/reservations
GET /api/reservations?email=john@example.com
GET /api/reservations?userId=abc123
```

#### Get Single Reservation
```http
GET /api/reservations/:id
```

#### Create Reservation
```http
POST /api/reservations
Content-Type: application/json

{
  "userId": "user_id_here",
  "carId": "car_id_here",
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "pickupLocation": "New York",
  "dropoffLocation": "Boston",
  "notes": "Optional notes"
}
```

#### Update Reservation Status
```http
PATCH /api/reservations/:id
Content-Type: application/json

{
  "status": "IN_PROGRESS"  // PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
}
```

## Car Categories
- ECONOMY
- COMPACT
- MIDSIZE
- FULLSIZE
- SUV
- LUXURY
- VAN

## Car Status
- AVAILABLE
- RESERVED
- IN_USE
- MAINTENANCE

## Reservation Status
- PENDING
- CONFIRMED
- IN_PROGRESS
- COMPLETED
- CANCELLED

## Business Logic

### Car Availability
A car is available if:
1. No overlapping reservations exist
2. Car is at the pickup location (either currently or will be dropped off there)

### Automatic Updates
- Creating a reservation sets car status to RESERVED
- Starting a reservation (IN_PROGRESS) sets car status to IN_USE
- Completing a reservation updates car location to dropoff location
- Cancelling removes reservation and updates car status if no other active reservations

