<template>
  <v-container>
    <v-row class="mb-4 align-center">
      <v-col><h2 class="page-title">จัดการผู้ใช้งาน (โหมดจำลอง)</h2></v-col>
      <v-col class="text-right">
        <v-btn color="primary" elevation="3" prepend-icon="mdi-plus" @click="openDialog()">เพิ่มผู้ใช้งาน</v-btn>
      </v-col>
    </v-row>

    <UserTable 
        :headers="headers" 
        :users="userStore.users" 
        :isLoading="userStore.isLoading"
        @edit="openDialog" 
        @delete="deleteUser" 
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
              <v-col cols="12" sm="6"><v-select v-model="formData.roleId" :items="roleOptions" item-title="title" item-value="value" label="สิทธิ์" variant="outlined" density="comfortable" /></v-col>
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

const headers = [{ title: 'ชื่อ-นามสกุล', key: 'name' }, { title: 'Username', key: 'username' }, { title: 'อีเมล', key: 'email' }, { title: 'สิทธิ์', key: 'role' }, { title: 'สถานะ', key: 'isActive' }, { title: 'จัดการ', key: 'actions', sortable: false }];
const roleOptions = [{ title: 'Admin', value: 1 }, { title: 'User', value: 2 }];

const dialog = ref(false);
const isEdit = ref(false);
let editId: number | null = null; // เพิ่มตัวแปรเก็บ ID
const defaultForm: UserPayload = { firstname: '', lastname: '', username: '', email: '', roleId: null, isActive: true };
const formData = ref<UserPayload>({ ...defaultForm });

onMounted(() => { userStore.fetchUsers(); });

// 🛑 ฟังก์ชันจำลอง (Fake Logic)
const openDialog = async (item?: User) => {
  if (item) {
    isEdit.value = true;
    editId = item.userId!;
    try {
      const userData = await userStore.fetchUserById(editId); // ดึงข้อมูล API
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

const deleteUser = async (id: number) => { 
  if (confirm('ยืนยันการลบ?')) await userStore.removeUser(id); 
};
</script>