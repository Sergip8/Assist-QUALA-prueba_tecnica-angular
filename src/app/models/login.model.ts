export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface UserRegistrationData {
  userName: string;
  email: string;
  userId: string;
  registrationDate: Date;

  
}