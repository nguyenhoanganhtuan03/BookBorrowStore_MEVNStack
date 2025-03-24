import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        isAuthenticated: false,
    }),
    actions: {
        login(userData) {
            this.user = userData; // Lưu thông tin user vào state
            this.isAuthenticated = true;
            console.log("🔹 User logged in:", this.user);
        },
        logout() {
            this.user = null;
            this.isAuthenticated = false;
            console.log("🔹 User logged out");
        }
    }
});
