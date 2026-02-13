-- AutoLoc custom tables (better-auth manages user/session/account tables)

CREATE TABLE IF NOT EXISTS vehicle (
  id TEXT PRIMARY KEY,
  ownerId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('citadine','berline','suv','utilitaire','luxe','cabriolet')),
  description TEXT NOT NULL DEFAULT '',
  pricePerDay INTEGER NOT NULL, -- centimes (4500 = 45.00 EUR)
  photos TEXT NOT NULL DEFAULT '[]', -- JSON array of Cloudinary URLs
  address TEXT NOT NULL DEFAULT '',
  lat REAL,
  lng REAL,
  accessMethod TEXT NOT NULL DEFAULT '',
  isActive INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vehicle_availability (
  id TEXT PRIMARY KEY,
  vehicleId TEXT NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  reason TEXT NOT NULL CHECK(reason IN ('blocked','booked'))
);

CREATE TABLE IF NOT EXISTS booking (
  id TEXT PRIMARY KEY,
  vehicleId TEXT NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
  customerId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  ownerId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  totalPrice INTEGER NOT NULL, -- centimes
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','cancelled','completed')),
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS message (
  id TEXT PRIMARY KEY,
  bookingId TEXT NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
  senderId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  isRead INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS favorite (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  vehicleId TEXT NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(userId, vehicleId)
);

CREATE TABLE IF NOT EXISTS consent (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK(type IN ('tos','privacy')),
  version TEXT NOT NULL,
  acceptedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_owner ON vehicle(ownerId);
CREATE INDEX IF NOT EXISTS idx_vehicle_active ON vehicle(isActive);
CREATE INDEX IF NOT EXISTS idx_vehicle_type ON vehicle(type);
CREATE INDEX IF NOT EXISTS idx_vehicle_availability_vehicle ON vehicle_availability(vehicleId);
CREATE INDEX IF NOT EXISTS idx_booking_vehicle ON booking(vehicleId);
CREATE INDEX IF NOT EXISTS idx_booking_customer ON booking(customerId);
CREATE INDEX IF NOT EXISTS idx_booking_owner ON booking(ownerId);
CREATE INDEX IF NOT EXISTS idx_booking_status ON booking(status);
CREATE INDEX IF NOT EXISTS idx_message_booking ON message(bookingId);
CREATE INDEX IF NOT EXISTS idx_favorite_user ON favorite(userId);
CREATE INDEX IF NOT EXISTS idx_consent_user ON consent(userId);
