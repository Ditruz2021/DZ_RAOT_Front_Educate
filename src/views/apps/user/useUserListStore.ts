import type { UserProperties } from '@/@fake-db/types'
import type { UserParams } from '@/views/apps/user/types'
import axios from '@axios'
import type { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'

export interface CreateUserPayload {
  firstname: string
  lastname: string
  username: string
  email: string
  isActive: boolean
  roleId: number
}

export interface EditUserPayload extends CreateUserPayload {
  id: number | null
  roleName?: string
}

type ApiUser = Partial<CreateUserPayload> & {
  id?: number
  userId?: number
  fullName?: string
  name?: string
  role?: string
  roleName?: string
  status?: string
  isActive?: boolean
  currentPlan?: string
  avatar?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const USERS_PATH = '/users'

const roleIdToNameMap: Record<number, string> = {
  1: 'admin',
  2: 'user',
}

const roleNameToIdMap: Record<string, number> = {
  admin: 1,
  user: 2
}

const splitName = (fullName: string) => {
  const [firstname = '', ...rest] = fullName.trim().split(' ')

  return {
    firstname,
    lastname: rest.join(' ').trim(),
  }
}

const mapApiUserToEditUserPayload = (user: ApiUser, fallbackId?: number): EditUserPayload => {
  const fullName = user.name || user.fullName || ''
  const nameParts = splitName(fullName)
  const normalizedRoleName = (user.roleName || user.role || '').toLowerCase()
  const roleId = user.roleId || roleNameToIdMap[normalizedRoleName] || 5

  return {
    id: user.userId || user.id || fallbackId || null,
    firstname: user.firstname || nameParts.firstname,
    lastname: user.lastname || nameParts.lastname,
    username: user.username || '',
    email: user.email || '',
    isActive: typeof user.isActive === 'boolean' ? user.isActive : user.status === 'active',
    roleId,
    roleName: user.roleName || roleIdToNameMap[roleId],
  }
}

const mapApiUserToUserProperties = (user: ApiUser, index: number): UserProperties => {
  const firstName = user.firstname?.trim() || ''
  const lastName = user.lastname?.trim() || ''
  const fullName = user.name || user.fullName || `${firstName} ${lastName}`.trim() || user.username || 'Unknown'
  const role = (user.role || user.roleName || '').toLowerCase() || roleIdToNameMap[user.roleId || 0] || 'subscriber'
  const status = user.status || (typeof user.isActive === 'boolean' ? (user.isActive ? 'active' : 'inactive') : 'inactive')

  return {
    id: user.userId || user.id || index + 1,
    fullName,
    company: '-',
    role,
    username: user.username || '-',
    country: '-',
    contact: '-',
    email: user.email || '-',
    currentPlan: user.currentPlan || '-',
    status,
    avatar: user.avatar || '',
  }
}

export const useUserListStore = defineStore('UserListStore', {
  actions: {

    fetchUsers(params: UserParams) {
      const options = params.options as { page?: number; itemsPerPage?: number }

      return axios.get(USERS_PATH, {
        baseURL: API_BASE_URL,
        params: {
          Keyword: params.q || '',
          Page: options.page || 1,
          PageSize: options.itemsPerPage || 10,
        },
      }).then(response => {
        const responseData = response.data || {}
        const rawUsers = (responseData.items || responseData.users || responseData.data || responseData) as ApiUser[]
        const users = Array.isArray(rawUsers)
          ? rawUsers.map((user, index) => mapApiUserToUserProperties(user, index))
          : []

        const itemsPerPage = Number(responseData.pageSize || options.itemsPerPage || 10)
        const totalUsers = Number(responseData.totalItems || responseData.totalUsers || users.length)
        const totalPage = Number(responseData.totalPage || responseData.totalPages || Math.max(1, Math.ceil(totalUsers / itemsPerPage)))
        const page = Number(responseData.page || options.page || 1)

        return {
          ...response,
          data: {
            ...responseData,
            users,
            totalUsers,
            totalPage,
            page,
          },
        }
      })
    },

    addUser(userData: CreateUserPayload) {
      return new Promise((resolve, reject) => {
        axios.post(USERS_PATH, userData, {
          baseURL: API_BASE_URL,
        }).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    fetchUser(id: number) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        axios.get(`${USERS_PATH}/${id}`, {
          baseURL: API_BASE_URL,
        }).then(response => {
          const responseData = response.data || {}
          const rawUser = (responseData.item || responseData.user || responseData.data || responseData) as ApiUser
          const user = mapApiUserToEditUserPayload(rawUser || {}, id)

          resolve({
            ...response,
            data: {
              ...responseData,
              user,
            },
          })
        }).catch(error => reject(error))
      })
    },

    updateUser(id: number, userData: CreateUserPayload) {
      return new Promise((resolve, reject) => {
        axios.put(`${USERS_PATH}/${id}`, userData, {
          baseURL: API_BASE_URL,
        }).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    deleteUser(id: number) {
      return new Promise((resolve, reject) => {
        axios.delete(`${USERS_PATH}/${id}`, {
          baseURL: API_BASE_URL,
        }).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
