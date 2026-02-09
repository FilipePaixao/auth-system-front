export interface User {
  id: string
  name: string
  email: string
  role?: string
  status?: string
  createdAt?: string
}

export interface NewUser {
  name: string
  email: string
  password: string
}

export interface UpdateUser {
  name: string
  email: string
}

export interface UpdateProfileDTO {
  name?: string
  email?: string
  password?: string
}
