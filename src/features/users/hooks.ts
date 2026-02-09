import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as userService from './services/user.service'
import type { UpdateProfileDTO } from './types'

export { useUpdateProfile as useUpdateUser }
export { useDeleteAccount as useDeleteUser }

const USERS_QUERY_KEY = ['users']
const USER_QUERY_KEY = (id: string) => ['users', id]

export function useUsers() {
  return useQuery({ queryKey: USERS_QUERY_KEY, queryFn: userService.listUsers })
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: USER_QUERY_KEY(id ?? ''),
    queryFn: () => userService.getProfile(id!),
    enabled: Boolean(id),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfileDTO }) =>
      userService.updateProfile(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY })
      qc.invalidateQueries({ queryKey: USER_QUERY_KEY(id) })
    },
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof userService.createUser>[0]) =>
      userService.createUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
  })
}

export function useDeleteAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userService.deleteAccount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
  })
}
