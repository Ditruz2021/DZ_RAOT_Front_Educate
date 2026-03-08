# 🛠️ Vue IT Workshop — ระบบจัดการผู้ใช้งาน

> Workshop การสร้างระบบ User Management ด้วย **Vue 3 + TypeScript + Vuetify** แบบครบวงจร  
> ตั้งแต่การ Setup โปรเจ็คจนถึงการเชื่อมต่อ REST API จริง

---

## 📋 สารบัญ

- [Tech Stack](#-tech-stack)
- [โครงสร้างโปรเจ็ค](#-โครงสร้างโปรเจ็ค)
- [ขั้นตอนที่ 1 — สร้างโปรเจ็คและติดตั้ง Library](#-ขั้นตอนที่-1--สร้างโปรเจ็คและติดตั้ง-library)
- [ขั้นตอนที่ 2 — ตั้งค่า Config พื้นฐาน](#️-ขั้นตอนที่-2--ตั้งค่า-config-พื้นฐาน)
- [ขั้นตอนที่ 3 — ประกอบส่วนกลาง (Main / Router / App)](#-ขั้นตอนที่-3--ประกอบส่วนกลาง-main--router--app)
- [ขั้นตอนที่ 4 — สร้าง State Management (Pinia Store)](#-ขั้นตอนที่-4--สร้าง-state-management-pinia-store)
- [ขั้นตอนที่ 5 — สร้าง UI Component (View)](#-ขั้นตอนที่-5--สร้าง-ui-component-view)
- [ตั้งค่า Environment Variable](#-ตั้งค่า-environment-variable)

---

## 🚀 Tech Stack

| เทคโนโลยี | รายละเอียด |
|---|---|
| **Vue 3** | Frontend Framework (Composition API) |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build Tool ความเร็วสูง |
| **Vuetify 3** | UI Component Library (Material Design) |
| **Pinia** | State Management |
| **Vue Router 4** | Client-side Routing |
| **Axios** | HTTP Client สำหรับเรียก API |
| **@mdi/font** | Material Design Icons |

---

## 📁 โครงสร้างโปรเจ็ค

```
vue-it-workshop/
├── src/
│   ├── plugins/
│   │   └── axios.ts          # ตั้งค่า Axios Instance
│   ├── router/
│   │   └── index.ts          # กำหนดเส้นทาง URL
│   ├── store/
│   │   └── user/
│   │       ├── types.ts          # TypeScript Interface / Type
│   │       ├── userMapper.ts     # แปลงข้อมูลจาก API
│   │       └── useUserListStore.ts  # Pinia Store
│   ├── views/
│   │   └── UserView.vue      # หน้าจอหลักระบบจัดการผู้ใช้
│   ├── App.vue
│   └── main.ts
├── .env
└── vite.config.ts
```

---

## 📦 ขั้นตอนที่ 1 — สร้างโปรเจ็คและติดตั้ง Library

### 1.1 สร้างโปรเจ็ค Vue + TypeScript ด้วย Vite

```bash
npm create vite@latest vue-it-workshop -- --template vue-ts
```

> 💡 ถ้ามีคำถามระหว่างสร้างโปรเจ็ค ให้กด `Enter` หรือเลือก `No` สำหรับ Experimental features

### 1.2 เข้าไปในโฟลเดอร์โปรเจ็ค

```bash
cd vue-it-workshop
```

### 1.3 ติดตั้ง Package พื้นฐาน

```bash
npm install
```

### 1.4 ติดตั้ง Library หลักทั้งหมด

```bash
npm install vue-router@4 pinia axios vuetify @mdi/font
```

### 1.5 สร้างโครงสร้างโฟลเดอร์

```bash
# สำหรับ macOS / Linux
mkdir -p src/views src/router src/store/user src/plugins

# สำหรับ Windows PowerShell (ใช้ลูกน้ำคั่น)
mkdir src/views, src/router, src/store, src/store/user, src/plugins
```

---

## ⚙️ ขั้นตอนที่ 2 — ตั้งค่า Config พื้นฐาน

### 2.1 แก้ไขไฟล์ `vite.config.ts`

กำหนด Path Alias เพื่อให้ระบบรู้จัก `@` และ `@axios` แทน Path ยาว ๆ

```ts
// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@axios': fileURLToPath(new URL('./src/plugins/axios.ts', import.meta.url))
    }
  }
})
```

### 2.2 สร้างไฟล์ `src/plugins/axios.ts`

ตัวจัดการการเรียก API กลาง รองรับการดึงค่า Base URL จากไฟล์ `.env`

```ts
// src/plugins/axios.ts
import axios from 'axios'

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

export default axiosIns
```

---

## 🔗 ขั้นตอนที่ 3 — ประกอบส่วนกลาง (Main / Router / App)

### 3.1 สร้างไฟล์ `src/router/index.ts`

กำหนด Route ของแอปพลิเคชัน

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import UserView from '@/views/UserView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/users' },
    { path: '/users', name: 'Users', component: UserView }
  ]
})

export default router
```

### 3.2 แก้ไขไฟล์ `src/main.ts`

จุดเริ่มต้นของแอป — เชื่อม Library ทั้งหมดเข้าด้วยกัน

```ts
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({ components, directives })
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
```

### 3.3 แก้ไขไฟล์ `src/App.vue`

Layout หลักของแอป

```vue
<!-- src/App.vue -->
<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html, body { font-family: 'Sarabun', sans-serif; }
</style>
```

---

## 🗄️ ขั้นตอนที่ 4 — สร้าง State Management (Pinia Store)

### 4.1 สร้างไฟล์ `src/store/user/types.ts`

กำหนด Interface และ Type ที่ใช้ทั่วทั้งระบบ

```ts
// src/store/user/types.ts
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

export type ApiUser = Partial<CreateUserPayload> & {
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

export interface UserProperties {
  id: number
  fullName: string
  company: string
  role: string
  username: string
  country: string
  contact: string
  email: string
  currentPlan: string
  status: string
  avatar: string
}

export interface UserParams {
  q?: string
  options?: any
}
```

### 4.2 สร้างไฟล์ `src/store/user/userMapper.ts`

ตัวแปลงข้อมูลจาก API ให้อยู่ในรูปแบบที่ UI ต้องการ

```ts
// src/store/user/userMapper.ts
import type { ApiUser, EditUserPayload, UserProperties } from './types'

export const roleIdToNameMap: Record<number, string> = { 1: 'admin', 2: 'user' }
export const roleNameToIdMap: Record<string, number> = { admin: 1, user: 2 }

const splitName = (fullName: string) => {
  const [firstname = '', ...rest] = fullName.trim().split(' ')
  return { firstname, lastname: rest.join(' ').trim() }
}

export const mapApiUserToEditUserPayload = (user: ApiUser, fallbackId?: number): EditUserPayload => {
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

export const mapApiUserToUserProperties = (user: ApiUser, index: number): UserProperties => {
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
```

### 4.3 สร้างไฟล์ `src/store/user/useUserListStore.ts`

Pinia Store สำหรับจัดการ CRUD ของผู้ใช้งาน

```ts
// src/store/user/useUserListStore.ts
import { defineStore } from 'pinia'
import axios from '@axios'
import type { AxiosResponse } from 'axios'
import type { CreateUserPayload, ApiUser, UserParams } from './types'
import { mapApiUserToEditUserPayload, mapApiUserToUserProperties } from './userMapper'

const USERS_PATH = '/users'

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
        const users = Array.isArray(rawUsers)
          ? rawUsers.map((user, index) => mapApiUserToUserProperties(user, index))
          : []

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
```

---

## 🖥️ ขั้นตอนที่ 5 — สร้าง UI Component (View)

สร้างไฟล์ `src/views/UserView.vue` — หน้าจอหลักสำหรับจัดการข้อมูลผู้ใช้ รองรับการ **ค้นหา / เพิ่ม / แก้ไข / ลบ**

```vue
<!-- src/views/UserView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserListStore } from '@/store/user/useUserListStore'
import type { CreateUserPayload } from '@/store/user/types'

const userListStore = useUserListStore()

const userList = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const isDialogVisible = ref(false)
const isEditMode = ref(false)
const editUserId = ref<number | null>(null)
const formRef = ref()

const tableHeaders = [
  { title: 'ID', key: 'id' },
  { title: 'ชื่อ-นามสกุล', key: 'fullName' },
  { title: 'ชื่อผู้ใช้งาน', key: 'username' },
  { title: 'อีเมล', key: 'email' },
  { title: 'สิทธิ์', key: 'role' },
  { title: 'สถานะ', key: 'status' },
  { title: 'จัดการ', key: 'actions', sortable: false },
]

const defaultForm: CreateUserPayload = {
  firstname: '', lastname: '', username: '', email: '', roleId: 2, isActive: true,
}
const formData = ref<CreateUserPayload>({ ...defaultForm })

const loadUsers = async () => {
  isLoading.value = true
  try {
    const response = await userListStore.fetchUsers({ q: searchQuery.value })
    userList.value = response.data.users
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isLoading.value = false
  }
}

const openAddDialog = () => {
  isEditMode.value = false
  formData.value = { ...defaultForm }
  isDialogVisible.value = true
}

const openEditDialog = async (id: number) => {
  isEditMode.value = true
  editUserId.value = id
  isDialogVisible.value = true
  try {
    const response = await userListStore.fetchUser(id)
    const u = response.data.user
    formData.value = {
      firstname: u.firstname, lastname: u.lastname, username: u.username,
      email: u.email, roleId: u.roleId, isActive: u.isActive,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const saveUser = async () => {
  const { valid } = await formRef.value?.validate() || { valid: false }
  if (!valid) return
  try {
    if (isEditMode.value && editUserId.value) {
      await userListStore.updateUser(editUserId.value, formData.value)
    } else {
      await userListStore.addUser(formData.value)
    }
    isDialogVisible.value = false
    loadUsers()
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

const deleteUser = async (id: number) => {
  if (confirm(`ยืนยันการลบผู้ใช้งานรหัส ${id} ใช่หรือไม่?`)) {
    try {
      await userListStore.deleteUser(id)
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

onMounted(() => loadUsers())
</script>

<template>
  <div class="pa-6">
    <v-card class="elevation-3 rounded-lg">
      <v-card-title class="bg-red-darken-4 text-white pa-4 d-flex justify-space-between align-center">
        <span><v-icon icon="mdi-account-group" class="mr-2" /> ระบบจัดการผู้ใช้งาน</span>
        <v-btn color="white" variant="outlined" @click="openAddDialog">
          <v-icon icon="mdi-plus" /> เพิ่มผู้ใช้
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-text-field
          v-model="searchQuery"
          label="ค้นหา..."
          append-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="mb-4"
          style="max-width: 300px;"
          @keyup.enter="loadUsers"
        />

        <v-data-table :headers="tableHeaders" :items="userList" :loading="isLoading" class="border rounded-lg">
          <template v-slot:item.role="{ item }">
            <v-chip :color="item.role === 'admin' ? 'red' : 'blue'" size="small">
              {{ item.role.toUpperCase() }}
            </v-chip>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'active' ? 'success' : 'grey'" size="small">
              {{ item.status === 'active' ? 'ใช้งาน' : 'ระงับ' }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-pencil" size="small" color="info" variant="text" @click="openEditDialog(item.id)" />
            <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="deleteUser(item.id)" />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Dialog เพิ่ม / แก้ไข -->
    <v-dialog v-model="isDialogVisible" max-width="600px">
      <v-card>
        <v-card-title class="bg-red-darken-4 text-white pa-4">
          {{ isEditMode ? 'แก้ไขข้อมูลผู้ใช้' : 'เพิ่มผู้ใช้งานใหม่' }}
        </v-card-title>
        <v-card-text class="pt-6">
          <v-form ref="formRef" @submit.prevent="saveUser">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.firstname" label="ชื่อจริง" variant="outlined" :rules="[v => !!v || 'บังคับกรอก']" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.lastname" label="นามสกุล" variant="outlined" :rules="[v => !!v || 'บังคับกรอก']" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.username" label="Username" variant="outlined" :disabled="isEditMode" :rules="[v => !!v || 'บังคับกรอก']" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="formData.email" label="อีเมล" type="email" variant="outlined" :rules="[v => !!v || 'บังคับกรอก']" />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.roleId"
                  :items="[{ title: 'Admin', value: 1 }, { title: 'User', value: 2 }]"
                  label="สิทธิ์การใช้งาน"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch v-model="formData.isActive" :label="formData.isActive ? 'Active' : 'Inactive'" color="success" hide-details />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="isDialogVisible = false">ยกเลิก</v-btn>
          <v-btn color="red-darken-4" variant="elevated" @click="saveUser">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
```

---

## 🌐 ตั้งค่า Environment Variable

สร้างไฟล์ `.env` ที่ root ของโปรเจ็ค แล้วกำหนด URL ของ API

```env
VITE_API_BASE_URL=http://79.108.225.69/user999/api/api
```

> ⚠️ **หมายเหตุ:** ไฟล์ `.env` ไม่ควร Commit ขึ้น Git โปรดเพิ่ม `.env` ใน `.gitignore`

---

## ✅ สรุปขั้นตอนทั้งหมด

```
1. สร้างโปรเจ็ค Vue + TypeScript ด้วย Vite
2. ติดตั้ง Library: Vue Router, Pinia, Axios, Vuetify, MDI Font
3. ตั้งค่า vite.config.ts และ Axios Plugin
4. สร้าง Router, เชื่อม Main.ts, ตั้งค่า App.vue
5. สร้าง Pinia Store พร้อม Type และ Mapper
6. สร้าง UserView.vue สำหรับแสดงผลและจัดการข้อมูล
7. ตั้งค่า .env สำหรับ API Base URL
```

---

<p align="center">Made with ❤️ for Vue.js Workshop</p>
