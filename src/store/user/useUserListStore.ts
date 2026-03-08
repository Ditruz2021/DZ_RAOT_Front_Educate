import { defineStore } from 'pinia'
import axios from '@axios'
import type { AxiosResponse } from 'axios'
import type { CreateUserPayload, ApiUser, UserParams } from './types'
import { mapApiUserToEditUserPayload, mapApiUserToUserProperties } from './userMapper'

const USERS_PATH = '/users' // ถ้าใช้ .env ให้ใส่ import.meta.env.VITE_API_BASE_URL ที่ axios.ts แทน

export const useUserListStore = defineStore('UserListStore', {
  actions: {
    fetchUsers(params: UserParams) {
      const options = params.options as { page?: number; itemsPerPage?: number } || {}
      return axios.get(USERS_PATH, {
        params: {
          Keyword: params.q || '',
          Page: options.page || 1,
          PageSize: options.itemsPerPage || 10,
        },
      }).then(response => {
        const responseData = response.data || {}
        const rawUsers = (responseData.items || responseData.users || responseData.data || responseData) as ApiUser[]
        const users = Array.isArray(rawUsers) ? rawUsers.map((user, index) => mapApiUserToUserProperties(user, index)) : []

        return { ...response, data: { users, totalUsers: users.length } }
      })
    },
    addUser(userData: CreateUserPayload) {
      return axios.post(USERS_PATH, userData)
    },
    fetchUser(id: number) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        axios.get(`${USERS_PATH}/${id}`).then(response => {
          const rawUser = (response.data.item || response.data) as ApiUser
          resolve({ ...response, data: { user: mapApiUserToEditUserPayload(rawUser || {}, id) } })
        }).catch(reject)
      })
    },
    updateUser(id: number, userData: CreateUserPayload) {
      return axios.put(`${USERS_PATH}/${id}`, userData)
    },
    deleteUser(id: number) {
      return axios.delete(`${USERS_PATH}/${id}`)
    },
  },
})