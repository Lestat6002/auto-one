CREATE TABLE IF NOT EXISTS "Cars" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  brand VARCHAR(100),
  price NUMERIC,
  km INTEGER,
  year INTEGER,
  description TEXT,
  images TEXT[],
  "createdAt" TIMESTAMP WITH TIME ZONE,
  "updatedAt" TIMESTAMP WITH TIME ZONE
);