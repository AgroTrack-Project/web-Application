export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  iam_user_id: string;
  user_type: string;
  plan_type: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
}
