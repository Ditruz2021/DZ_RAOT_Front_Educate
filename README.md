# 🛠️ Vue IT Workshop — ระบบจัดการผู้ใช้งาน

> Workshop การสร้างระบบ User Management ด้วย **Vue 3 + TypeScript + Vuetify** แบบครบวงจร
> ตั้งแต่การ Setup โปรเจกต์จนถึงการเชื่อมต่อ REST API จริง (GET, POST, PUT, DELETE)

---

## 📋 สารบัญ

- [Tech Stack](#-tech-stack)
- [โครงสร้างโปรเจกต์](#-โครงสร้างโปรเจกต์)
- [ขั้นตอนที่ 1 — สร้างโปรเจกต์และติดตั้ง Library](#-ขั้นตอนที่-1--สร้างโปรเจกต์และติดตั้ง-library)
- [ขั้นตอนที่ 2 — ตั้งค่า Config พื้นฐาน](#️-ขั้นตอนที่-2--ตั้งค่า-config-พื้นฐาน)
- [ขั้นตอนที่ 3 — ประกอบส่วนกลาง (Main / Router / App)](#-ขั้นตอนที่-3--ประกอบส่วนกลาง-main--router--app)
- [ขั้นตอนที่ 4 — สร้าง State Management (Pinia Store)](#️-ขั้นตอนที่-4--สร้าง-state-management-pinia-store)
- [ขั้นตอนที่ 5 — สร้าง UI Component (View)](#️-ขั้นตอนที่-5--สร้าง-ui-component-view)
- [ตั้งค่า Environment Variable](#-ตั้งค่า-environment-variable)

---

## 🚀 Tech Stack

| เทคโนโลยี | รายละเอียด |
| --- | --- |
| **Vue 3** | Frontend Framework (Composition API) |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build Tool ความเร็วสูง |
| **Vuetify 3** | UI Component Library (Material Design) |
| **Pinia** | State Management |
| **Vue Router 4** | Client-side Routing |
| **Axios** | HTTP Client สำหรับเรียก API |
| **@mdi/font** | Material Design Icons |

---

## 📁 โครงสร้างโปรเจกต์

```text
vue-it-workshop/
├── src/
│   ├── components/
│   │   └── UserTable.vue       # Component ตารางแสดงข้อมูล
│   ├── plugins/
│   │   └── axios.ts            # ตั้งค่า Axios Instance
│   ├── router/
│   │   └── index.ts            # กำหนดเส้นทาง URL
│   ├── services/
│   │   └── userService.ts      # API Endpoints & Types
│   ├── store/
│   │   └── userStore.ts        # Pinia Store สำหรับจัดการ State
│   ├── views/
│   │   └── UserManagement.vue  # หน้าจอหลักระบบจัดการผู้ใช้
│   ├── App.vue
│   ├── main.ts
│   └── env.d.ts                # TypeScript Declaration
├── .env
└── vite.config.ts
```

---

## 📦 ขั้นตอนที่ 1 — สร้างโปรเจกต์และติดตั้ง Library

### 1.1 สร้างโปรเจกต์ Vue + TypeScript ด้วย Vite

```bash
npm create vite@latest vue-it-workshop -- --template vue-ts
```

### 1.2 ติดตั้ง Library หลักทั้งหมด

```bash
cd vue-it-workshop
npm install
npm install vue-router@4 pinia axios vuetify @mdi/font
npm install -D sass
```

### 1.3 สร้างโครงสร้างโฟลเดอร์

```bash
# สำหรับ Windows PowerShell
mkdir src/components, src/views, src/router, src/store, src/services, src/plugins
```

---

## ⚙️ ขั้นตอนที่ 2 — ตั้งค่า Config พื้นฐาน

### 2.1 สร้างไฟล์ `src/env.d.ts` (แก้ Error Vuetify Styles)

```ts
/// <reference types="vite/client" />

declare module 'vuetify/styles' {
  const content: any;
  export default content;
}
```

### 2.2 สร้างไฟล์ `src/plugins/axios.ts`

```ts
import axios from 'axios'

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

export default axiosIns
```

### 2.3 สร้างไฟล์ `src/services/userService.ts` (Types & Service)

```ts
import axiosInstance from '../plugins/axios';

export interface User { userId?: number; name: string; username: string; email: string; role: string; isActive: boolean; }
export interface UserPayload { firstname: string; lastname: string; username: string; email: string; isActive: boolean; roleId: number | null; }
export interface UserDetail { userId: number; firstname: string; lastname: string; username: string; email: string; isActive: boolean; roleId: number; roleName: string; }

export const userService = {
  getUsers: () => axiosInstance.get('/users'),
  getUserById: (id: number) => axiosInstance.get<UserDetail>(`/users/${id}`),
  createUser: (payload: UserPayload) => axiosInstance.post('/users', payload),
  updateUser: (id: number, payload: UserPayload) => axiosInstance.put(`/users/${id}`, payload),
  deleteUser: (id: number) => axiosInstance.delete(`/users/${id}`)
};
```

---

## 🔗 ขั้นตอนที่ 3 — ประกอบส่วนกลาง (Main / Router / App)

### 3.1 สร้างไฟล์ `src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'
import UserManagement from '../views/UserManagement.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', name: 'Users', component: UserManagement }]
})
export default router
```

### 3.2 แก้ไขไฟล์ `src/main.ts`

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({ components, directives })
const app = createApp(App)

app.use(createPinia()).use(router).use(vuetify).mount('#app')
```

### 3.3 แก้ไขไฟล์ `src/App.vue`

```vue
<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="2">
      <v-toolbar-title>IT Training Workshop</v-toolbar-title>
    </v-app-bar>
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

### สร้างไฟล์ `src/store/userStore.ts`

```ts
import { defineStore } from 'pinia';
import { userService, type User, type UserPayload } from '../services/userService';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    isLoading: false,
  }),
  actions: {
    async fetchUsers() {
      this.isLoading = true;
      try {
        const res = await userService.getUsers();
        this.users = res.data.items;
      } finally { this.isLoading = false; }
    },
    async fetchUserById(id: number) {
      const res = await userService.getUserById(id);
      return res.data;
    },
    async addUser(payload: UserPayload) {
      await userService.createUser(payload);
      await this.fetchUsers();
    },
    async editUser(id: number, payload: UserPayload) {
      await userService.updateUser(id, payload);
      await this.fetchUsers();
    },
    async removeUser(id: number) {
      await userService.deleteUser(id);
      await this.fetchUsers();
    }
  }
});
```

---

## 🖥️ ขั้นตอนที่ 5 — สร้าง UI Component (View)

### 5.1 สร้างไฟล์ `src/components/UserTable.vue`

```vue
<template>
  <v-data-table :headers="headers" :items="users" :loading="isLoading" class="elevation-1 rounded-lg">
    <template v-slot:item.isActive="{ item }">
      <v-chip :color="item.isActive ? 'green' : 'red'" size="small">
        {{ item.isActive ? 'ใช้งาน' : 'ระงับ' }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon color="warning" class="mr-2" @click="$emit('edit', item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="$emit('delete', item.userId!)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { User } from '../services/userService';
defineProps<{ headers: any[]; users: User[]; isLoading: boolean }>();
defineEmits<{ (e: 'edit', item: User): void; (e: 'delete', id: number): void }>();
</script>
```

### 5.2 สร้างไฟล์ `src/views/UserManagement.vue`

```vue
<template>
  <v-container>
    <v-row class="mb-4 align-center">
      <v-col><h2 class="page-title">จัดการผู้ใช้งาน</h2></v-col>
      <v-col class="text-right">
        <v-btn color="primary" class="add-btn" elevation="3" prepend-icon="mdi-plus" @click="openDialog()">
          เพิ่มผู้ใช้งาน
        </v-btn>
      </v-col>
    </v-row>

    <UserTable
      :headers="headers" :users="userStore.users" :isLoading="userStore.isLoading"
      @edit="openDialog" @delete="deleteUser"
    />

    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="rounded-lg">
        <v-card-title class="pa-4 bg-primary text-white">
          {{ isEdit ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่' }}
        </v-card-title>
        <v-card-text class="pt-6">
          <v-form>
            <v-row>
              <v-col cols="12" sm="6"><v-text-field v-model="formData.firstname" label="ชื่อจริง" variant="outlined" density="comfortable" /></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="formData.lastname" label="นามสกุล" variant="outlined" density="comfortable" /></v-col>
              <v-col cols="12"><v-text-field v-model="formData.username" label="Username" variant="outlined" density="comfortable" :disabled="isEdit" /></v-col>
              <v-col cols="12"><v-text-field v-model="formData.email" label="Email" variant="outlined" density="comfortable" /></v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="formData.roleId" :items="roleOptions" item-title="title" item-value="value" label="สิทธิ์ผู้ใช้งาน" variant="outlined" density="comfortable" />
              </v-col>
              <v-col cols="12" sm="6"><v-switch v-model="formData.isActive" label="สถานะการใช้งาน" color="success" inset /></v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="grey" variant="text" @click="dialog = false">ยกเลิก</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveUser">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../store/userStore';
import type { User, UserPayload } from '../services/userService';
import UserTable from '../components/UserTable.vue';

const userStore = useUserStore();
const headers = [
  { title: 'ชื่อ-นามสกุล', key: 'name' },
  { title: 'Username', key: 'username' },
  { title: 'อีเมล', key: 'email' },
  { title: 'สิทธิ์', key: 'role' },
  { title: 'สถานะ', key: 'isActive' },
  { title: 'จัดการ', key: 'actions', sortable: false },
];

const roleOptions = [{ title: 'User', value: 1 }, { title: 'Admin', value: 2 }];
const dialog = ref(false);
const isEdit = ref(false);
let editId: number | null = null;

const defaultForm: UserPayload = { firstname: '', lastname: '', username: '', email: '', roleId: null, isActive: true };
const formData = ref<UserPayload>({ ...defaultForm });

onMounted(() => { userStore.fetchUsers(); });

const openDialog = async (item?: User) => {
  if (item) {
    isEdit.value = true;
    editId = item.userId!;
    try {
      const userData = await userStore.fetchUserById(editId);
      formData.value = {
        firstname: userData.firstname, lastname: userData.lastname,
        username: userData.username, email: userData.email,
        roleId: userData.roleId, isActive: userData.isActive
      };
      dialog.value = true;
    } catch (error) { alert('ดึงข้อมูลล้มเหลว'); }
  } else {
    isEdit.value = false; editId = null; formData.value = { ...defaultForm }; dialog.value = true;
  }
};

const saveUser = async () => {
  if (isEdit.value && editId !== null) await userStore.editUser(editId, formData.value);
  else await userStore.addUser(formData.value);
  dialog.value = false;
};

const deleteUser = async (id: number) => { if (confirm('ยืนยันการลบ?')) await userStore.removeUser(id); };
</script>

<style scoped>
.page-title { font-weight: 800; font-size: 2rem; background: linear-gradient(45deg, #1A237E, #42A5F5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.add-btn { border-radius: 8px; font-weight: bold; }
</style>
```

---

## 🌐 ตั้งค่า Environment Variable

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์

```env
VITE_API_URL=http://79.108.225.69/user999/api/api
```

---

<p align="center">Made with ❤️ for Vue.js IT Workshop</p>