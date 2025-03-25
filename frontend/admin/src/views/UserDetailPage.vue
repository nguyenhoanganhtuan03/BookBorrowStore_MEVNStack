<template>
  <div>
    <!-- App Header -->
    <AppHeader />

    <!-- Main Content -->
    <div class="container mt-2">
      <!-- Kiểm tra nếu user có dữ liệu -->
      <div v-if="user">
        <!-- Truyền thông tin user vào UserDetail -->
        <UserDetail :user="user"/>
      </div>
      <!-- Nếu chưa có thông tin user, hiển thị thông báo -->
      <div v-else class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden"></span>
        </div>
        <p class="mt-3">Đang tải thông tin người dùng...</p>
      </div>
    </div>

    <!-- App Footer -->
    <AppFooter />
  </div>
</template>

<script>
import UserDetail from "@/components/users/userDetail.vue"; 
import AppHeader from "@/components/common/AppHeader.vue";  
import AppFooter from "@/components/common/AppFooter.vue";  
import UserService from "@/services/user.service"; 

export default {
  components: {
    UserDetail,
    AppHeader,
    AppFooter
  },

  props: ['userId'],

  data() {
    return {
      user: null,  // Biến chứa thông tin người dùng
    };
  },

  async created() {
    try {
      // Lấy userId từ tham số URL
      const userId = this.$route.params.userId;
      
      // Debug để xác nhận userId có đúng không
      console.log("UserId from URL:", userId);
      
      if (!userId) {
        console.error("Missing userId in URL");
        this.$router.push("/login");
        return;
      }

      // Gọi API để lấy thông tin người dùng với userId
      const response = await UserService.getUserById(userId);

      // Debugging response
      console.log("API Response:", response);
      
      if (response.status === "success") {
        this.user = response.data;  // Chỉ gán data từ response vào user
      } else {
        console.error("Error:", response.message);
        alert("Không thể tải thông tin người dùng: " + response.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      alert("Đã có lỗi xảy ra khi tải thông tin người dùng");
    }
  }
};
</script>

<style scoped>
/* Custom styling for the page */
.container {
  max-width: 800px;
  margin-top: 20px;
}

.card {
  border-radius: 15px;
  overflow: hidden;
}

.card-header {
  background-color: #007bff;
  color: white;
  padding: 15px;
}

.card-body {
  padding: 20px;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
