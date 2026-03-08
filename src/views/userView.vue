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
    if (isEditMode.value && editUserId.value) await userListStore.updateUser(editUserId.value, formData.value)
    else await userListStore.addUser(formData.value)
    
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
        <span><v-icon icon="mdi-account-group" class="mr-2"/> ระบบจัดการผู้ใช้งาน</span>
        <v-btn color="white" variant="outlined" @click="openAddDialog"><v-icon icon="mdi-plus"/> เพิ่มผู้ใช้</v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-text-field v-model="searchQuery" label="ค้นหา..." append-inner-icon="mdi-magnify" variant="outlined" density="compact" class="mb-4" style="max-width: 300px;" @keyup.enter="loadUsers"/>
        
        <v-data-table :headers="tableHeaders" :items="userList" :loading="isLoading" class="border rounded-lg">
          <template v-slot:item.role="{ item }">
            <v-chip :color="item.role === 'admin' ? 'red' : 'blue'" size="small">{{ item.role.toUpperCase() }}</v-chip>
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status === 'active' ? 'success' : 'grey'" size="small">{{ item.status === 'active' ? 'ใช้งาน' : 'ระงับ' }}</v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-pencil" size="small" color="info" variant="text" @click="openEditDialog(item.id)"/>
            <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="deleteUser(item.id)"/>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isDialogVisible" max-width="600px">
      <v-card>
        <v-card-title class="bg-red-darken-4 text-white pa-4">{{ isEditMode ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล' }}</v-card-title>
        <v-card-text class="pt-6">
          <v-form ref="formRef" @submit.prevent="saveUser">
            <v-row>
              <v-col cols="12" md="6"><v-text-field v-model="formData.firstname" label="ชื่อจริง" variant="outlined" :rules="[v => !!v || 'บังคับกรอก']"/></v-col>
              <v-col cols="12" md="6"><v-text-field v-model="formData.lastname" label="นามสกุล" variant="outlined" :rules="[v => !!v || 'บังคับกรอก']"/></v-col>
              <v-col cols="12" md="6"><v-text-field v-model="formData.username" label="Username" variant="outlined" :disabled="isEditMode" :rules="[v => !!v || 'บังคับกรอก']"/></v-col>
              <v-col cols="12" md="6"><v-text-field v-model="formData.email" label="อีเมล" type="email" variant="outlined" :rules="[v => !!v || 'บังคับกรอก']"/></v-col>
              <v-col cols="12" md="6"><v-select v-model="formData.roleId" :items="[{title:'Admin',value:1},{title:'User',value:2}]" label="สิทธิ์" variant="outlined"/></v-col>
              <v-col cols="12" md="6"><v-switch v-model="formData.isActive" :label="formData.isActive ? 'Active' : 'Inactive'" color="success" hide-details/></v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider/>
        <v-card-actions class="pa-4">
          <v-spacer/>
          <v-btn variant="text" @click="isDialogVisible = false">ยกเลิก</v-btn>
          <v-btn color="red-darken-4" variant="elevated" @click="saveUser">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
