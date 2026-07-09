export interface AuthenticatedUserResponse {
  id: string;
  email: string;
  roles: string[];
  token: string;
}
