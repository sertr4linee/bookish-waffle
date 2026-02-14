-- AutoLoc custom tables (better-auth manages user/session/account tables)

CREATE TABLE IF NOT EXISTS vehicle (
  id TEXT PRIMARY KEY,
  "ownerId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('citadine','berline','suv','utilitaire','luxe','cabriolet')),
  description TEXT NOT NULL DEFAULT '',
  "pricePerDay" INTEGER NOT NULL,
  photos TEXT NOT NULL DEFAULT '[]',
  address TEXT NOT NULL DEFAULT '',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  "accessMethod" TEXT NOT NULL DEFAULT '',
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_availability (
  id TEXT PRIMARY KEY,
  "vehicleId" TEXT NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
  "startDate" TEXT NOT NULL,
  "endDate" TEXT NOT NULL,
  reason TEXT NOT NULL CHECK(reason IN ('blocked','booked'))
);

CREATE TABLE IF NOT EXISTS booking (
  id TEXT PRIMARY KEY,
  "vehicleId" TEXT NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
  "customerId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "ownerId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "startDate" TEXT NOT NULL,
  "endDate" TEXT NOT NULL,
  "totalPrice" INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','cancelled','completed')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message (
  id TEXT PRIMARY KEY,
  "bookingId" TEXT NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
  "senderId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorite (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "vehicleId" TEXT NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "vehicleId")
);

CREATE TABLE IF NOT EXISTS consent (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK(type IN ('tos','privacy')),
  version TEXT NOT NULL,
  "acceptedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_owner ON vehicle("ownerId");
CREATE INDEX IF NOT EXISTS idx_vehicle_active ON vehicle("isActive");
CREATE INDEX IF NOT EXISTS idx_vehicle_type ON vehicle(type);
CREATE INDEX IF NOT EXISTS idx_vehicle_availability_vehicle ON vehicle_availability("vehicleId");
CREATE INDEX IF NOT EXISTS idx_booking_vehicle ON booking("vehicleId");
CREATE INDEX IF NOT EXISTS idx_booking_customer ON booking("customerId");
CREATE INDEX IF NOT EXISTS idx_booking_owner ON booking("ownerId");
CREATE INDEX IF NOT EXISTS idx_booking_status ON booking(status);
CREATE INDEX IF NOT EXISTS idx_message_booking ON message("bookingId");
CREATE INDEX IF NOT EXISTS idx_favorite_user ON favorite("userId");
CREATE INDEX IF NOT EXISTS idx_consent_user ON consent("userId");
