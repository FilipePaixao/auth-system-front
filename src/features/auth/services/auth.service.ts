import { api } from '@/shared/services/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { LoginDTO, LoginResponse, RegisterDTO } from '../types'

export async function login(credentials: LoginDTO): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    ENDPOINTS.auth.login,
    credentials
  )
  return data
}

export async function register(payload: RegisterDTO): Promise<{ id: string; name: string; email: string }> {
  const { data } = await api.post<{ id: string; name: string; email: string }>(
    ENDPOINTS.users,
    {
      name: payload.name,
      email: payload.email,
      passwordHash: payload.password,
    }
  )
  return data
}
