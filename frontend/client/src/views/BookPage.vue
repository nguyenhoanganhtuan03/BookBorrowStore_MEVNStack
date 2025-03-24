<template>
  <div>
    <AppHeader />

    <main class="container mt-4">
      <h2 class="text-center mb-4">Thông tin chi tiết sách</h2>

      <!-- Loading Spinner -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

      <!-- Book Details -->
      <div v-if="book" class="row">
        <!-- Book Image and Info -->
        <div class="col-md-12">
          <!-- BookDetail Component is used to display all the book information -->
          <BookDetail :book="book" />
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import BookDetail from "@/components/books/bookDetail.vue"; 
import bookService from "@/services/book.service";

export default {
  components: {
    AppHeader,
    AppFooter,
    BookDetail,
  },
  data() {
    return {
      book: null,
      loading: false,
      error: "",
    };
  },
  async created() {
    this.fetchBook();
  },
  methods: {
    async fetchBook() {
      try {
        this.loading = true;
        this.error = "";

        const response = await bookService.getBookById(this.$route.params.bookId);
        console.log("Dữ liệu sách nhận được:", response);

        if (response && response.status === "success") {
          this.book = response.data;
        } else {
          this.error = "Không tìm thấy sách.";
        }
      } catch (err) {
        console.error("Lỗi lấy sách:", err);
        this.error = "Không thể lấy thông tin sách. Vui lòng thử lại.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Có thể thêm CSS tùy chỉnh nếu cần */
</style>
