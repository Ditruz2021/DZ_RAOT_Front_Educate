<template>
    <v-data-table :headers="headers" :items="users" :loading="isLoading" class="elevetion-1 rounded-lg">
        <template #item.role="{item}">
            <span>{{ item.role }}</span>
        </template>
        <template #item.isActive="{item}">
            <v-chip :color="item.isActive ? 'green' : 'red'">
                {{ item.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
            </v-chip>
        </template>
        <template #item.actions="{item}">
            <v-icon color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
            <v-icon color="red" @click="$emit('delete', item.userId!)">mdi-delete</v-icon>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
defineProps<{headers: any[], users: any[], isLoading: boolean}>()
defineEmits<{(e: 'edit', item: any) : void; (e: 'delete', item: any) : void}>();
</script>

<style scoped>
</style>