<template>
  <div class="container mt-5" v-if="user">
    <div class="card shadow-lg">
      <div class="card-header text-center bg-primary text-white">
        <h3>Thông tin cá nhân</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="updateUser">
          <!-- Tên người dùng -->
          <div class="mb-3">
            <label for="username" class="form-label">Tên người dùng</label>
            <input type="text" id="username" class="form-control" v-model="user.username" disabled />
          </div>
          
          <!-- Họ và tên -->
          <div class="mb-3">
            <label for="fullname" class="form-label">Họ tên</label>
            <input type="text" id="fullname" class="form-control" v-model="user.fullname" />
          </div>

          <!-- Số điện thoại -->
          <div class="mb-3">
            <label for="phone" class="form-label">Số điện thoại</label>
            <input type="text" id="phone" class="form-control" v-model="user.phone" />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" v-model="user.email" />
          </div>

          <!-- Địa chỉ -->
          <div class="mb-3">
            <label for="address" class="form-label">Địa chỉ</label>
            <input type="text" id="address" class="form-control" v-model="user.address" />
          </div>

          <!-- Giới tính -->
          <div class="mb-3">
            <label for="gender" class="form-label">Giới tính</label>
            <select id="gender" class="form-select" v-model="user.gender">
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <!-- Ngày sinh -->
          <div class="mb-3">
            <label for="dob" class="form-label">Ngày sinh</label>
            <input type="date" id="dob" class="form-control" v-model="user.dob" />
          </div>

          <div class="d-flex justify-content-center">
            <!-- Nút Cập nhật thông tin -->
            <button type="submit" class="btn btn-warning btn-lg">Cập nhật thông tin</button>

            <!-- Nút Xóa tài khoản -->
            <button @click="deleteUser" class="btn btn-danger btn-lg">Xóa tài khoản</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import UserService from "@/services/user.service";  // Import UserService for API calls

export default {
  props: {
    user: Object, // Nhận đối tượng user từ parent component
  },
  created() {
    // Trước khi cập nhật, hiển thị thông tin người dùng
    if (this.user && this.user.username) {
      this.getUserInfo();
    }
  },
  methods: {
    // Lấy thông tin người dùng để hiển thị lên form
    async getUserInfo() {
      try {
        const response = await UserService.getUserById(this.user.userId);
        if (response.status === "success") {
          // Nếu thông tin người dùng được lấy thành công, cập nhật lại
          this.user = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    },

    // Hàm cập nhật thông tin người dùng
    async updateUser() {
      try {
        const response = await UserService.updateUser(this.user.username, this.user);
        if (response.status === "success") {
          alert("Thông tin người dùng đã được cập nhật.");
        } else {
          alert("Cập nhật thông tin người dùng thất bại.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      }
    },

    // Hàm xóa tài khoản người dùng
    async deleteUser() {
      const confirmDelete = confirm("Bạn có chắc chắn muốn xóa tài khoản không?");
      if (confirmDelete) {
        try {
          const response = await UserService.deleteUser(this.user.username);
          if (response.status === "success") {
            alert("Tài khoản đã được xóa.");
            // Sau khi xóa thành công, có thể chuyển hướng đến trang đăng nhập hoặc trang chủ
            this.$router.push("/login");
          } else {
            alert("Xóa tài khoản thất bại.");
          }
        } catch (error) {
          console.error("Lỗi khi xóa tài khoản:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
/* Custom CSS for better styling */
.card {
  border-radius: 15px;
}

.card-header {
  background-color: #007bff;
  color: white;
}

.form-label {
  font-weight: bold;
}

.form-control {
  border-radius: 10px;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 18px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.d-flex {
  gap: 10px;
}
</style>
