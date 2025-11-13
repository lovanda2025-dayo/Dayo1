export interface Profile {
  id: string;
  email: string;
  name: string;
  age: number;
  bio: string;
  gender: string;
  gender_interest: string;
  province: string;
  neighborhood: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileDetails {
  id: string;
  user_id: string;
  height: number | null;
  occupation: string | null;
  company: string | null;
  education: string | null;
  educational_institution: string | null;
  smoking: string;
  drinking: string;
  exercise: string;
  diet: string[];
  pets: string[];
  children: string;
  interests: string[];
  languages: string[];
  religion: string | null;
  political_view: string | null;
  life_desires: string[];
  relationship_intention: string;
  created_at: string;
  updated_at: string;
}

export interface ProfilePhoto {
  id: string;
  user_id: string;
  photo_url: string;
  order: number;
  created_at: string;
}

export interface Interaction {
  id: string;
  user_id: string;
  target_user_id: string;
  interaction_type: 'like' | 'pass' | 'favorite' | 'archive' | 'comment';
  comment_text: string | null;
  created_at: string;
}

export interface Match {
  id: string;
  user_id_1: string;
  user_id_2: string;
  matched_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    user_metadata: Record<string, any>;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
    token_type: string;
    user: any;
  };
}
