-- Golden Phoenix Booking System Schema
-- Run this in the Supabase SQL Editor

-- Tables
CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Opening Hours
CREATE TABLE opening_hours (
  id SERIAL PRIMARY KEY,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  session_name VARCHAR(20) NOT NULL CHECK (session_name IN ('lunch', 'dinner')),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  slot_interval INT NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (day_of_week, session_name)
);

-- Bookings
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  booking_date DATE NOT NULL,
  time_slot TIME NOT NULL,
  party_size INT NOT NULL CHECK (party_size > 0),
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  table_id INT REFERENCES tables(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Date Closures
CREATE TABLE date_closures (
  id SERIAL PRIMARY KEY,
  closed_date DATE NOT NULL UNIQUE,
  reason TEXT
);

-- Index for faster booking queries
CREATE INDEX idx_bookings_date_status ON bookings(booking_date, status);
CREATE INDEX idx_bookings_table_date ON bookings(table_id, booking_date);

-- Seed: Tables (8 starter tables)
INSERT INTO tables (name, capacity) VALUES
  ('Table 1', 2),
  ('Table 2', 2),
  ('Table 3', 4),
  ('Table 4', 4),
  ('Table 5', 6),
  ('Table 6', 6),
  ('Table 7', 8),
  ('Table 8', 10);

-- Seed: Opening Hours (Mon-Sun, lunch + dinner)
-- day_of_week: 0=Sunday, 1=Monday, ... 6=Saturday
INSERT INTO opening_hours (day_of_week, session_name, open_time, close_time) VALUES
  (0, 'lunch', '12:00', '15:00'),
  (0, 'dinner', '17:00', '22:30'),
  (1, 'lunch', '12:00', '15:00'),
  (1, 'dinner', '17:00', '22:30'),
  (2, 'lunch', '12:00', '15:00'),
  (2, 'dinner', '17:00', '22:30'),
  (3, 'lunch', '12:00', '15:00'),
  (3, 'dinner', '17:00', '22:30'),
  (4, 'lunch', '12:00', '15:00'),
  (4, 'dinner', '17:00', '22:30'),
  (5, 'lunch', '12:00', '15:00'),
  (5, 'dinner', '17:00', '22:30'),
  (6, 'lunch', '12:00', '15:00'),
  (6, 'dinner', '17:00', '22:30');
