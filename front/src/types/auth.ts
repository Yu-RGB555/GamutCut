export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  errors?: string[];
}