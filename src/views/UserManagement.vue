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
        <v-data-table :headers="headers" :items="users" :loading="isLoading" class="elevetion-1 rounded-lg">
            <template #item.roleId="{item}">
                <span v-if="item.roleId == 1">Admin</span>
                <span v-else-if="item.roleId == 2">User</span>
            </template>
            <template #item.isActive="{item}">
                <v-chip :color="item.isActive ? 'green' : 'red'">
                    {{ item.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
                </v-chip>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog" max-width="600px">
            <v-card class="rounded-lg">
                <v-card-title class="pa-4 bg-primary text-white">เพิ่มผู้ใช้งานใหม่</v-card-title>
                <v-card-text class="pt-6">
                    <v-form>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field label="ชื่อ" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="นามสกุล" required></v-text-field>
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
const dialog = ref(false)
const isLoading = ref(false)
const users = ref([
    { userId: 1 ,firstname:'สมชาย', lastname: 'ใจดี', email: 'somchai@example.com' , roleId: 1, isActive:true},
    { userId: 2 ,firstname:'สมหญิง', lastname: 'ใจดี', email: 'somying@example.com' , roleId: 2, isActive:false}
])
const headers = [
    { title: 'ชื่อ', value: 'firstname' },
    { title: 'นามสกุล', value: 'lastname' },
    { title: 'อีเมล', value: 'email' },
    { title: 'บทบาท', value: 'roleId' },
    { title: 'สถานะ', value: 'isActive' },
]
const openDialog = () => {
    dialog.value = true
}

const saveUser = () => {
    alert('บันทึกผู้ใช้งาน')
}
</script>

<style scoped>
</style>