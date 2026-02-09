export interface LoginRequest {
  email: string
  password: string
}

/** Alias for spec: login credentials */
export type LoginDTO = LoginRequest

export interface RegisterDTO {
  name: string
  email: string
  password: string
}

export interface UserPublic {
  id: string
  name: string
  email: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginResponse {
  token: string
  user: UserPublic
}
