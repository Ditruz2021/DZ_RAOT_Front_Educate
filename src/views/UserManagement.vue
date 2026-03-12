<template>
    <v-container>
        <v-row class="mb-4 align-center">
            <v-col>
                <h2 class="page-title">จัดการผู้ใช้งาน</h2>
            </v-col>
            <v-col>
                <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">เพิ่มผู้ใช้งาน</v-btn>
            </v-col>
        </v-row>
        <UserTable :headers="headers" :users="userStore.users" :isLoading="isLoading" @edit="openDialog" @delete="deleteUser"/>
        <v-dialog v-model="dialog" max-width="600px">
            <v-card class="rounded-lg">
                <v-card-title class="pa-4 bg-primary text-white">เพิ่มผู้ใช้งานใหม่</v-card-title>
                <v-card-text class="pt-6">
                    <v-form>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field label="ชื่อ" v-model="formData.firstname" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="นามสกุล" v-model="formData.lastname" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Username" v-model="formData.username" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Email" v-model="formData.email" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select label="บทบาท" v-model="formData.roleId" :items="roleList" item-title="name" item-value="id" required></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-switch label="สถานะใช้งาน" v-model="formData.isActive"></v-switch>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-card-actions class="pa-4">
                        <v-btn color="gray" variant="text" @click="dialog = false">ยกเลิก</v-btn>
                        <v-btn color="primary" variant="elevated" @click="saveUser">บันทึก</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserTable from '../components/UserTable.vue'
import { useUserStore } from '../store/userStore';
import type { User } from '../services/userService';
import { onMounted } from 'vue';
const dialog = ref(false)
const isEdit = ref(false);
const isLoading = ref(false)

const userStore = useUserStore()
const formData = ref({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    roleId: null,
    isActive: true
})

const headers = [
    { title: 'ชื่อ', value: 'name' },
    { title: 'อีเมล', value: 'email' },
    { title: 'บทบาท', value: 'role' },
    { title: 'สถานะ', value: 'isActive' },
    { title: 'จัดการ', value: 'actions'}
]
const roleList = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' }
]
const openDialog = (item? :any) => {
    if(item){
         isEdit.value = true
         formData.value = {
            firstname: item.firstname,
            lastname: item.lastname,
            username: item.username,
            email: item.email,
            roleId: item.roleId,
            isActive: item.isActive
         }
    } else {
        isEdit.value = false
        formData.value = {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            roleId: null,
            isActive: true
        }
    }
    dialog.value = true
}

onMounted(() => {
    userStore.fetchUsers();
});

const saveUser = () => {
    alert('บันทึกผู้ใช้งาน')
}

const deleteUser = (id: number) => {
    alert('ลบผู้ใช้งาน id: ' + id)
}
</script>

<style scoped>
</style>