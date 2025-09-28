type Task = {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
  expires_at: Date;
};
