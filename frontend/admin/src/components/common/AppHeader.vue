<template>
    <nav class="navbar navbar-dark bg-primary px-3">
        <div class="d-flex align-items-center gap-3">
            <!-- Logo -->
            <router-link to="/" class="navbar-brand fw-semibold">
                📚 Quản lý Mượn Sách
            </router-link>

            <!-- Nút Thư viên -->
            <router-link to="/library" class="custom-btn">
                <i class="fas fa-book"></i> Thư viện
            </router-link>

            <!-- Nút Tìm kiếm -->
            <router-link to="/search" class="custom-btn">
                <i class="fas fa-search"></i> Tìm kiếm
            </router-link>

            <!-- Nút Lịch sử mượn sách -->
            <router-link 
            v-if="authStore.user" 
            :to="{ name: 'BorrowListPage', params: { userId: authStore.user._id } }" 
            class="custom-btn">
            <i class="fas fa-book-open"></i> Lịch sử mượn sách
            </router-link>
        </div>

        <!-- Kiểm tra trạng thái đăng nhập -->
        <div>
            <template v-if="authStore.isAuthenticated">
                <!-- User Dropdown Menu -->
                <div class="dropdown">
                    <button 
                        class="btn btn-primary border-0" 
                        type="button" 
                        id="userDropdown" 
                        aria-expanded="false"
                        @click="toggleDropdown"
                    >
                        <i class="fas fa-user-circle fa-lg"></i>
                    </button>
                    <ul 
                        class="dropdown-menu dropdown-menu-end" 
                        :class="{ show: isDropdownOpen }" 
                        aria-labelledby="userDropdown"
                    >
                        <li class="dropdown-item text-muted">
                            👤 Xin chào, <strong>{{ username }}</strong>
                        </li>
                        <li>
                            <router-link :to="{ name: 'UserDetail', params: { userId: authStore.user._id } }" class="dropdown-item">
                                <i class="fas fa-user"></i> Thông tin cá nhân
                            </router-link>
                        </li>
                        <li>
                            <button @click="handleLogout" class="dropdown-item text-danger">
                                <i class="fas fa-sign-out-alt"></i> Đăng xuất
                            </button>
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
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

export default {
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        const isDropdownOpen = ref(false);

        // Lấy username từ store
        const username = computed(() => authStore.user?.username || "Người dùng");

        const toggleDropdown = () => {
            isDropdownOpen.value = !isDropdownOpen.value;
        };

        const closeDropdown = (event) => {
            // Đóng dropdown khi click bên ngoài
            if (isDropdownOpen.value && !event.target.closest('.dropdown')) {
                isDropdownOpen.value = false;
            }
        };

        const handleLogout = () => {
            authStore.logout();
            isDropdownOpen.value = false;
            router.push("/login"); // Chuyển hướng sau khi đăng xuất
        };

        // Xử lý sự kiện click ngoài dropdown để đóng nó
        onMounted(() => {
            document.addEventListener('click', closeDropdown);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('click', closeDropdown);
        });

        return { 
            authStore, 
            username, 
            handleLogout,
            isDropdownOpen,
            toggleDropdown
        };
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

.dropdown-menu.show {
    display: block;
}

/* Cải thiện hiệu ứng dropdown */
.dropdown-menu {
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
    display: none;
}

.dropdown-menu.show {
    opacity: 1;
    display: block;
}

/* Thêm hiệu ứng hover cho nút user */
#userDropdown {
    transition: transform 0.2s ease-in-out;
}

#userDropdown:hover {
    transform: scale(1.1);
}
</style>