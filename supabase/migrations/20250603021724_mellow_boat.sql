/*
  # Portfolio Management System Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `images` (jsonb)
      - `technologies` (text[])
      - `live_url` (text)
      - `github_url` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `read_status` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated admin access
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  images jsonb DEFAULT '[]'::jsonb,
  technologies text[] DEFAULT ARRAY[]::text[],
  live_url text,
  github_url text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for projects
CREATE POLICY "Allow public read access for published projects" ON projects
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Allow admin full access to projects" ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for messages
CREATE POLICY "Allow public to create messages" ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow admin full access to messages" ON messages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);