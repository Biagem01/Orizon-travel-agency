-- Orizon Travel Agency Database Setup
-- This file contains all necessary database migrations for PostgreSQL

-- Drop existing tables to ensure clean setup (be careful in production!)
DROP TABLE IF EXISTS travels;
DROP TABLE IF EXISTS countries;

-- Create countries table
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name
CREATE INDEX idx_countries_name ON countries (name);

-- Create travels table
CREATE TABLE travels (
    id SERIAL PRIMARY KEY,
    country_id INTEGER NOT NULL,
    seats_available INTEGER NOT NULL CHECK (seats_available >= 0),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_travels_country_id ON travels (country_id);
CREATE INDEX idx_travels_seats_available ON travels (seats_available);
CREATE INDEX idx_travels_dates ON travels (start_date, end_date);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_travels_updated_at BEFORE UPDATE ON travels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial countries for testing (optional)
INSERT INTO countries (name) VALUES 
('Italy'),
('France'),
('Spain'),
('Japan'),
('Thailand'),
('Peru'),
('Nepal'),
('Morocco');

-- Insert some sample travels for testing (optional)
INSERT INTO travels (country_id, seats_available, title, description, price, start_date, end_date) VALUES 
(1, 12, 'Tuscany Wine Tour', 'Explore the beautiful wine regions of Tuscany with sustainable practices', 1299.99, '2024-06-15', '2024-06-22'),
(2, 8, 'Loire Valley Castles', 'Discover historic castles while supporting local communities', 899.99, '2024-07-10', '2024-07-17'),
(4, 6, 'Kyoto Temple Walk', 'Mindful journey through ancient temples and traditional culture', 1899.99, '2024-09-05', '2024-09-15'),
(5, 10, 'Thai Cooking Adventure', 'Learn authentic Thai cuisine from local families', 799.99, '2024-08-20', '2024-08-27'),
(6, 4, 'Machu Picchu Trek', 'Responsible trekking to the ancient Inca citadel', 1599.99, '2024-10-12', '2024-10-19');

-- Create a view for travels with country information
CREATE VIEW travels_with_countries AS
SELECT 
    t.id,
    t.title,
    t.description,
    t.price,
    t.seats_available,
    t.start_date,
    t.end_date,
    t.created_at,
    t.updated_at,
    c.id as country_id,
    c.name as country_name
FROM travels t
JOIN countries c ON t.country_id = c.id;
