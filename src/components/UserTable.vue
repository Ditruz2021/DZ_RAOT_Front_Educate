<template>
  <v-data-table :headers="headers" :items="users" :loading="isLoading" class="elevation-1 rounded-lg">
    <template v-slot:item.isActive="{ item }">
      <v-chip :color="item.isActive ? 'green' : 'red'" size="small">
        {{ item.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon color="warning" class="mr-2" @click="$emit('edit', item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="$emit('delete', item.userId!)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
defineProps<{ headers: any[]; users: any[]; isLoading: boolean }>();
defineEmits<{ (e: 'edit', item: any): void; (e: 'delete', id: number): void }>();
</script>