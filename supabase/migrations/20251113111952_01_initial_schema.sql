/*
  # Flame Match - Initial Database Schema

  1. New Tables
    - `profiles` - User profile information
      - `id` (uuid, primary key, auth.users.id)
      - `email` (text)
      - `name` (text)
      - `age` (integer)
      - `bio` (text)
      - `gender` (text)
      - `gender_interest` (text)
      - `province` (text)
      - `neighborhood` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `profile_details` - Detailed profile information
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `height` (integer)
      - `occupation` (text)
      - `company` (text)
      - `education` (text)
      - `educational_institution` (text)
      - `smoking` (text)
      - `drinking` (text)
      - `exercise` (text)
      - `diet` (jsonb)
      - `pets` (jsonb)
      - `children` (text)
      - `interests` (jsonb)
      - `languages` (jsonb)
      - `religion` (text)
      - `political_view` (text)
      - `life_desires` (jsonb)
      - `relationship_intention` (text)

    - `profile_photos` - User profile photos
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `photo_url` (text)
      - `order` (integer)
      - `created_at` (timestamp)

    - `interactions` - User interactions (likes, passes, favorites)
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `target_user_id` (uuid, foreign key)
      - `interaction_type` (text) - 'like', 'pass', 'favorite', 'archive', 'comment'
      - `comment_text` (text, nullable)
      - `created_at` (timestamp)

    - `matches` - Matched users (mutual likes)
      - `id` (uuid, primary key)
      - `user_id_1` (uuid, foreign key)
      - `user_id_2` (uuid, foreign key)
      - `matched_at` (timestamp)

    - `messages` - Chat messages
      - `id` (uuid, primary key)
      - `match_id` (uuid, foreign key)
      - `sender_id` (uuid, foreign key)
      - `content` (text)
      - `read_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to access only their own data
    - Add policies for profile viewing and interaction
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL,
  bio text DEFAULT '',
  gender text DEFAULT 'não-especificado',
  gender_interest text DEFAULT 'não-especificado',
  province text DEFAULT '',
  neighborhood text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profile_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  height integer,
  occupation text,
  company text,
  education text,
  educational_institution text,
  smoking text DEFAULT 'Não',
  drinking text DEFAULT 'Não',
  exercise text DEFAULT 'Moderado',
  diet jsonb DEFAULT '[]'::jsonb,
  pets jsonb DEFAULT '[]'::jsonb,
  children text DEFAULT 'Talvez',
  interests jsonb DEFAULT '[]'::jsonb,
  languages jsonb DEFAULT '[]'::jsonb,
  religion text,
  political_view text,
  life_desires jsonb DEFAULT '[]'::jsonb,
  relationship_intention text DEFAULT 'relacionamento-serio',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profile_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('like', 'pass', 'favorite', 'archive', 'comment')),
  comment_text text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_interaction CHECK (user_id != target_user_id),
  UNIQUE(user_id, target_user_id, interaction_type)
);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  matched_at timestamptz DEFAULT now(),
  CONSTRAINT users_ordering CHECK (user_id_1 < user_id_2),
  UNIQUE(user_id_1, user_id_2)
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view other profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own profile details"
  ON profile_details FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile details"
  ON profile_details FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile details"
  ON profile_details FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view profile photos"
  ON profile_photos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own photos"
  ON profile_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos"
  ON profile_photos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create interactions"
  ON interactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own interactions"
  ON interactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their matches"
  ON matches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "Users can send messages in their matches"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM matches
      WHERE id = match_id AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  );

CREATE POLICY "Users can view messages from their matches"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE id = match_id AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  );

CREATE POLICY "Users can update read status on messages they received"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE id = match_id AND (user_id_1 = auth.uid() OR user_id_2 = auth.uid())
    )
  )
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_details_user_id ON profile_details(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_photos_user_id ON profile_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_target_user_id ON interactions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type_created ON interactions(interaction_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_user_id_1 ON matches(user_id_1);
CREATE INDEX IF NOT EXISTS idx_matches_user_id_2 ON matches(user_id_2);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
