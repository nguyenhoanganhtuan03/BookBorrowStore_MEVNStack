<template>
  <div class="book-detail">
    <div class="book-detail-container">
      <!-- Phần hiển thị ảnh sách -->
      <img v-if="book.image" :src="book.image" :alt="book.bookname ? `${book.bookname}` : 'Book Cover'"  class="book-image"/>
      <i v-else class="fas fa-book book-icon" aria-hidden="true"></i>

      <!-- Phần hiển thị thông tin chi tiết sách -->
      <div class="book-info">
        <h2>{{ book.bookname || "No name available" }}</h2>
        <p><strong>Tác giả:</strong> {{ book.author || "Not available" }}</p>
        <p><strong>Giá:</strong> {{ formatPrice(book.price) }}</p>
        <p><strong>Số lượng:</strong> {{ book.quantity || "Not available" }}</p>
        <p><strong>Năm xuất bản:</strong> {{ book.publishYear || "Not available" }}</p>
        <p><strong>Mã nhà xuất bản:</strong> {{ book.publisherCode || "Not available" }}</p>
        <p><strong>Thể loại:</strong> {{ book.category || "Not available" }}</p>
      </div>
    </div>

    <!-- Phần Actions với nút "Mượn sách" và nút "Quay lại" -->
    <div class="actions">
      <button class="btn btn-primary btn-lg shadow-sm" @click="borrowBook">Mượn sách</button>
      
      <!-- Nút Quay lại ở góc dưới bên phải -->
      <button class="btn btn-outline-primary btn-lg back-button shadow-sm" @click="goBack">Quay lại</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth"; // Import store auth

export default {
  props: {
    book: Object, // Nhận dữ liệu từ BookPage
  },
  methods: {
    formatPrice(price) {
      return price ? new Intl.NumberFormat().format(price) + " VND" : "Chưa có giá";
    },
    // Hàm mượn sách
    borrowBook() {
      const authStore = useAuthStore(); // Sử dụng store auth
      if (authStore.isLoggedIn) {
        const bookId = this.$route.params.bookId;
        this.$router.push(`/borrow/${bookId}`); // Chuyển hướng đến trang mượn sách nếu đã đăng nhập
      } else {
        this.$router.push(`/login`); // Chuyển hướng đến trang login nếu chưa đăng nhập
      }
    },
    // Hàm quay lại trang trước
    goBack() {
      this.$router.go(-1);  // Quay lại trang trước trong Vue Router
    }
  }
};
</script>

<style scoped>
.book-detail {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.book-detail-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.book-image {
  width: 40%;
  text-align: center;
}

.book-image img {
  max-width: 100%;
  height: auto;
}

.book-info {
  width: 55%;
  padding-left: 20px;
}

.book-info h2 {
  margin-bottom: 10px;
}

.book-info p {
  margin: 5px 0;
}

.actions {
  margin-top: 70px;
  text-align: center;
  position: relative;
}

/* Nút Mượn sách */
button {
  position: absolute;
  right: 10px;
  padding: 15px 30px;  /* Tăng kích thước nút */
  font-size: 1.2rem;   /* Tăng kích thước chữ */
  border-radius: 5px;
  transition: all 0.3s ease;
  width: 200px;  /* Cố định chiều rộng */
}

button:hover {
  transform: translateY(-2px); /* Thêm hiệu ứng nhấc nút khi hover */
}

/* Nút Quay lại */
.back-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: transparent; /* Nền trong suốt */
  color: #007bff; /* Màu chữ giống màu nút */
  border: 2px solid #007bff; /* Đặt viền màu giống màu nút */
  padding: 15px 30px;  /* Tăng kích thước nút */
  font-size: 1.2rem;   /* Tăng kích thước chữ */
  border-radius: 5px;
  width: 200px;  /* Cố định chiều rộng */
}

.back-button:hover {
  background-color: rgba(0, 123, 255, 0.1); /* Thêm hiệu ứng nền khi hover */
  transform: translateY(-2px); /* Thêm hiệu ứng nhấc nút khi hover */
}
</style>
