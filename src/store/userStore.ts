import { defineStore } from 'pinia';
import { userService } from '../services/userService';

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        isLoading: false,
    }),
    actions: {
        async fetchUsers() {
            this.isLoading = true;
            try {
                const response = await userService.getUsers();
                this.users = response.data.items;
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                this.isLoading = false;
            }
        }
    }
})