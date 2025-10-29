/*
  # Create Content Management Tables

  1. New Tables
    - `site_sections`
      - `id` (uuid, primary key)
      - `section_key` (text, unique) - Identifier like 'hero', 'historia', 'vision', etc.
      - `title` (text) - Section title
      - `content` (text) - Main content/description
      - `image_url` (text, nullable) - Optional image URL
      - `order_index` (integer) - Display order
      - `is_visible` (boolean) - Show/hide section
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `news`
      - `id` (uuid, primary key)
      - `title` (text) - News title
      - `content` (text) - News content
      - `image_url` (text, nullable) - Optional image
      - `published_date` (date) - Publication date
      - `is_published` (boolean) - Published status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text) - Event title
      - `description` (text) - Event description
      - `location` (text) - Event location
      - `event_date` (timestamptz) - Event date and time
      - `image_url` (text, nullable) - Optional image
      - `is_active` (boolean) - Active status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `gallery_images`
      - `id` (uuid, primary key)
      - `title` (text) - Image title
      - `description` (text, nullable) - Optional description
      - `image_url` (text) - Image URL
      - `order_index` (integer) - Display order
      - `is_visible` (boolean) - Show/hide image
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Allow public read access for all tables (public website)
    - Only authenticated users can modify content (admin panel)
*/

CREATE TABLE IF NOT EXISTS site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_url text,
  order_index integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_url text,
  published_date date NOT NULL DEFAULT CURRENT_DATE,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  event_date timestamptz NOT NULL,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text,
  image_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site sections"
  ON site_sections FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert site sections"
  ON site_sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site sections"
  ON site_sections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site sections"
  ON site_sections FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read published news"
  ON news FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert news"
  ON news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update news"
  ON news FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete news"
  ON news FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read active events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read visible gallery images"
  ON gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert gallery images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO site_sections (section_key, title, content, order_index, is_visible) VALUES
  ('hero', 'Bienvenido a Nuestra Organización', 'Trabajando por un mejor futuro para nuestra comunidad', 0, true),
  ('historia', 'Nuestra Historia', 'Fundada con el propósito de servir a la comunidad, nuestra organización ha crecido y evolucionado a lo largo de los años.', 1, true),
  ('vision', 'Nuestra Visión', 'Ser una organización líder que impulse el desarrollo sostenible y el bienestar de nuestra comunidad.', 2, true),
  ('mision', 'Nuestra Misión', 'Promover el desarrollo integral de nuestra comunidad a través de programas educativos, culturales y sociales.', 3, true)
ON CONFLICT (section_key) DO NOTHING;