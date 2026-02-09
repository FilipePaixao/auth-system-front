import { api } from '@/shared/services/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { User, NewUser, UpdateProfileDTO } from '../types'

export async function listUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>(ENDPOINTS.users)
  return data
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const trimmed = email.trim()
  if (!trimmed) return null
  try {
    const { data } = await api.get<User>(ENDPOINTS.userByEmail(trimmed))
    return data
  } catch (err) {
    if (err && typeof err === 'object' && 'response' in err) {
      const res = (err as { response?: { status?: number } }).response
      if (res?.status === 404) return null
    }
    throw err
  }
}

export async function getProfile(id: string): Promise<User> {
  const { data } = await api.get<User>(ENDPOINTS.userById(id))
  return data
}

export async function createUser(payload: NewUser): Promise<User> {
  const body = { name: payload.name, email: payload.email, passwordHash: payload.password }
  const { data } = await api.post<User>(ENDPOINTS.users, body)
  return data
}

export async function updateProfile(
  id: string,
  payload: UpdateProfileDTO
): Promise<User> {
  const body: Record<string, string> = {}
  if (payload.name != null) body.name = payload.name
  if (payload.email != null) body.email = payload.email
  if (payload.password != null) body.passwordHash = payload.password
  const { data } = await api.put<User>(ENDPOINTS.userById(id), body)
  return data
}

export async function deleteAccount(id: string): Promise<void> {
  await api.put(ENDPOINTS.userInactive(id))
}
