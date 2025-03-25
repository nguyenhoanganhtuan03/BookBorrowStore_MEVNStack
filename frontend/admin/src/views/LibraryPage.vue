<template>
    <div>
        <AppHeader />

        <main class="container mt-4">
            <h2 class="text-center mb-4">📚 Thư viện sách</h2>

            <!-- Loading -->
            <div v-if="loading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
            </div>

            <!-- Lỗi tải sách -->
            <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

            <!-- Danh sách sách dạng list -->
            <ul v-if="books.length > 0" class="list-group">
                <li v-for="book in books" :key="book.id" class="list-group-item">
                    <BookCard :book="book" />
                </li>
            </ul>

            <!-- Không có sách -->
            <div v-else-if="!loading" class="text-center">
                <p class="text-muted">Không có sách nào trong thư viện.</p>
            </div>
        </main>

        <AppFooter />
    </div>
</template>

<script>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import BookCard from "@/components/books/bookCard.vue";
import bookService from "@/services/book.service";

export default {
    components: { AppHeader, AppFooter, BookCard },
    data() {
        return {
            books: [],
            loading: false,
            error: "",
        };
    },
    async created() {
        this.fetchBooks();
    },
    methods: {
        async fetchBooks() {
            try {
                this.loading = true;
                this.error = "";

                const response = await bookService.getBooks();
                console.log("Dữ liệu API nhận được:", response);

                if (response && response.status === "success" && Array.isArray(response.data)) {
                    this.books = response.data.map(book => ({
                        id: book._id,
                        bookname: book.bookname,
                        author: book.author,
                        price: book.price || 0,
                        quantity: book.quantity || 0,
                        image: book.image || "/book.jpg",
                    }));
                } else {
                    this.error = "Không có sách nào.";
                }
            } catch (err) {
                console.error("Lỗi tải sách:", err);
                this.error = "Không thể tải danh sách sách. Vui lòng thử lại.";
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.list-group-item {
    border: none;
    padding: 15px 0;
}
</style>
