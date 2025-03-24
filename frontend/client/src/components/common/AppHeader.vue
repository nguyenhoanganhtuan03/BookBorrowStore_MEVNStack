<template>
    <nav class="navbar navbar-dark bg-primary px-3">
        <div class="d-flex align-items-center gap-3">
            <!-- Logo -->
            <router-link to="/" class="navbar-brand fw-semibold">
                📚 Quản lý Mượn Sách
            </router-link>

            <!-- Nút Tìm kiếm -->
            <router-link to="/search" class="custom-btn">
                <i class="fas fa-search"></i> Tìm kiếm
            </router-link>

            <!-- Nút Lịch sử mượn sách -->
            <router-link to="/history" class="custom-btn">
                <i class="fas fa-book-open"></i> Lịch sử mượn sách
            </router-link>
        </div>

        <!-- Kiểm tra trạng thái đăng nhập -->
        <div>
            <template v-if="authStore.isLoggedIn">
                <!-- Hiển thị icon user khi đăng nhập -->
                <div class="dropdown">
                    <button class="btn btn-primary border-0 dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user-circle fa-lg"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li class="dropdown-item text-muted">
                            Xin chào, <strong>{{ username }}</strong>
                        </li>
                        <li>
                            <button @click="handleLogout" class="dropdown-item">Đăng xuất</button>
                        </li>
                    </ul>
                </div>
            </template>
            <template v-else>
                <!-- Hiển thị "Đăng nhập / Đăng ký" -->
                <div class="auth-links">
                    <router-link to="/login" class="auth-link">Đăng nhập</router-link>
                    <span style="color: white;">/</span>
                    <router-link to="/register" class="auth-link">Đăng ký</router-link>
                </div>
            </template>
        </div>
    </nav>
</template>

<script>
import { computed } from "vue";
import { useAuthStore } from "@/store/auth";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default {
    setup() {
        const authStore = useAuthStore(); // ✅ Khởi tạo store

        // ✅ Lấy username từ store
        const username = computed(() => authStore.user?.username || "Người dùng");

        const handleLogout = () => {
            authStore.logout(); // ✅ Gọi action đăng xuất
        };

        return { authStore, username, handleLogout };
    },
};
</script>

<style scoped>
.custom-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 16px;
    text-decoration: none;
    padding: 6px 12px;
    transition: color 0.3s ease-in-out;
}

.custom-btn:hover {
    color: #f8f9fa;
    text-decoration: underline;
}

.auth-links {
    display: flex;
    align-items: center;
    gap: 6px;
}

.auth-link {
    color: white;
    text-decoration: underline;
    font-size: 16px;
    cursor: pointer;
}

.auth-link:hover {
    color: #f8f9fa;
}
</style>
