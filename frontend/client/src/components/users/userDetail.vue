<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <div class="container mt-5" v-if="user">
    <div class="card shadow-lg">
      <div class="card-header text-center bg-primary text-white">
        <h3>Thông tin cá nhân</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="updateUser">
          <!-- Tên người dùng -->
          <div class="mb-3">
            <label class="form-label">Tên người dùng</label>
            <input type="text" id="username" class="form-control" v-model="user.username" disabled />
          </div>
          
          <!-- Họ và tên -->
          <div class="mb-3">
            <label class="form-label">Họ tên</label>
            <input type="text" id="fullname" class="form-control" v-model="user.fullname" />
          </div>

          <!-- Số điện thoại -->
          <div class="mb-3">
            <label class="form-label">Số điện thoại</label>
            <input type="text" id="phone" class="form-control" v-model="user.phone" />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" id="email" class="form-control" v-model="user.email" />
          </div>

          <!-- Địa chỉ -->
          <div class="mb-3">
            <label class="form-label">Địa chỉ</label>
            <input type="text" id="address" class="form-control" v-model="user.address" />
          </div>

          <!-- Giới tính -->
          <div class="mb-3">
            <label class="form-label">Giới tính</label>
            <select id="gender" class="form-select" v-model="user.gender">
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <!-- Ngày sinh -->
          <div class="mb-3">
            <label class="form-label">Ngày sinh</label>
            <input type="date" id="dob" class="form-control" v-model="user.dob" />
          </div>

          <!-- Mật khẩu -->
          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <div class="input-group">
              <input 
                :type="isPasswordVisible ? 'text' : 'password'" 
                id="password" 
                class="form-control" 
                v-model="user.password" 
                placeholder="Nhập mật khẩu"
              />
              <button 
                type="button" 
                class="btn btn-outline-secondary" 
                @click="togglePasswordVisibility"
              >
                <i :class="isPasswordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
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
  props: ['userId'],
  data() {
    return {
      user: null,  // Biến để chứa thông tin người dùng
      isPasswordVisible: false,  // Biến để điều khiển trạng thái hiển thị mật khẩu
    };
  },
  async created() {
    try {
      const userId = this.$route.params.userId;  // Lấy userId từ tham số URL

      if (!userId) {
        window.location.reload();
      }

      const response = await UserService.getUserById(userId);  // Gọi API lấy thông tin người dùng

      if (response.status === "success") {
        this.user = response.data.data;  // Lưu thông tin người dùng vào biến `user`
        console.log("Dữ liệu người dùng", this.user.data);  // In ra dữ liệu để kiểm tra
      } else {
        alert("Không thể tải thông tin người dùng: " + response.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      alert("Đã có lỗi xảy ra khi tải thông tin người dùng");
    }
  },

  methods: {
    // Hàm để chuyển đổi trạng thái hiển thị mật khẩu
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },

    // Cập nhật thông tin người dùng
    async updateUser() {
      try {
        const userId = this.$route.params.userId;

        // Khởi tạo đối tượng JSON để chứa dữ liệu cập nhật
        const updatedUserData = {
          fullname: this.user.fullname,
          phone: this.user.phone,
          email: this.user.email,
          address: this.user.address,
          gender: this.user.gender,
          dob: this.user.dob,
          password: this.user.password,
        };

        const response = await UserService.updateUser(userId, updatedUserData);  // Gọi API cập nhật với dữ liệu thay đổi
        if (response.status === "success") {
          alert("Thông tin người dùng đã được cập nhật.");
        } else {
          alert("Cập nhật thông tin người dùng thất bại: " + response.message);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        alert("Đã có lỗi xảy ra khi cập nhật thông tin người dùng.");
      }
    },

    // Hàm xóa tài khoản người dùng
    async deleteUser() {
      const confirmDelete = confirm("Bạn có chắc chắn muốn xóa tài khoản không?");
      if (confirmDelete) {
        try {
          const userId = this.$route.params.userId;
          const response = await UserService.deleteUser(userId);  // Gọi API xóa tài khoản
          if (response.status === "success") {
            alert("Tài khoản đã được xóa.");
            window.location.reload();  
          } else {
            alert("Xóa tài khoản thất bại: " + response.message);
          }
        } catch (error) {
          console.error("Lỗi khi xóa tài khoản:", error);
          alert("Đã có lỗi xảy ra khi xóa tài khoản.");
        }
      }
    }
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
