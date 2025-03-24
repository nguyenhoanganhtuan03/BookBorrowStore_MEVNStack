<template>
  <div>
    <!-- App Header -->
    <AppHeader />

    <!-- Main Content -->
    <div class="container mt-2">
      <!-- Kiểm tra nếu user có username -->
      <div v-if="user.username">
        <div class="card-body">
          <!-- Truyền thông tin user vào UserDetail -->
          <UserDetail :user="user" />
        </div>
      </div>
      <!-- Nếu chưa có thông tin user, hiển thị thông báo -->
      <div v-else>
        <p>Đang tải thông tin người dùng...</p>
      </div>
    </div>

    <!-- App Footer -->
    <AppFooter />
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth";  // Import store từ Pinia
import UserDetail from "@/components/users/userDetail.vue"; // Import UserDetail component
import AppHeader from "@/components/common/AppHeader.vue";  // Import AppHeader component
import AppFooter from "@/components/common/AppFooter.vue";  // Import AppFooter component

export default {
  components: {
    UserDetail,
    AppHeader,
    AppFooter
  },
  data() {
    return {
      user: {}  // Khởi tạo đối tượng user rỗng
    };
  },
  created() {
    const authStore = useAuthStore(); // Lấy thông tin user từ store Pinia
    if (authStore.isAuthenticated) {
      this.user = authStore.user;  // Gán thông tin user từ store vào component
    } else {
      console.error("User not authenticated");
    }
  }
};
</script>

<style scoped>
/* Custom styling for the page */
.container {
  max-width: 800px;
  margin-top: 10px;
}

.card {
  border-radius: 15px;
}

.card-header {
  background-color: #007bff;
  color: white;
}

.card-body {
  padding: 5px;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 18px;
}

.d-flex {
  gap: 10px;
}
</style>
