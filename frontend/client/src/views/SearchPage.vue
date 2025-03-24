<template>
    <div>
        <AppHeader />

        <main class="container mt-4">
            <!-- Ô nhập tìm kiếm -->
            <InputSearch v-model="searchQuery" class="mb-3" />

            <!-- Hiển thị trạng thái tải -->
            <div v-if="loading" class="text-primary text-center">Đang tìm kiếm...</div>

            <!-- Hiển thị lỗi nếu có -->
            <div v-if="error" class="text-danger text-center">{{ error }}</div>

            <!-- Hiển thị kết quả tìm kiếm -->
            <div v-if="searchPerformed">
                <div v-if="books.length > 0" class="list-group">
                    <BookCard 
                        v-for="book in books" 
                        :key="book.id" 
                        :book="book" 
                        class="list-group-item"
                    />
                </div>
                <div v-else class="alert alert-warning text-center">
                    Không tìm thấy kết quả nào.
                </div>
            </div>
        </main>

        <AppFooter />
    </div>
</template>

<script>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import InputSearch from "@/components/common/InputSearch.vue";
import BookCard from "@/components/books/bookCard.vue";
import bookService from "@/services/book.service";

export default {
    components: { AppHeader, AppFooter, InputSearch, BookCard },
    data() {
        return {
            searchQuery: "",
            books: [],
            loading: false,
            error: "",
            searchPerformed: false
        };
    },
    watch: {
        async searchQuery(newQuery) {
            if (!newQuery.trim()) {
                this.books = [];
                this.searchPerformed = false;
                this.error = "";
                return;
            }

            this.loading = true;
            this.searchPerformed = true;
            this.error = "";

            try {
                const response = await bookService.getBookByName(newQuery.trim());
                console.log("📚 API response:", response);

                if (response.status === "success") {
                    this.books = response.data.map(book => ({
                        id: book._id,
                        bookname: book.bookname,  // 🔍 Đảm bảo lấy đúng key từ API
                        author: book.author,
                        image: book.image || "/book.jpg",
                        price: book.price || 0,
                        quantity: book.quantity ?? "Không rõ"
                    }));
                } else {
                    this.books = [];
                    this.error = response.message;
                }
            } catch (err) {
                console.error("❌ Lỗi khi gọi API:", err);
            }
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 800px;
}

.list-group-item {
    border-bottom: 1px solid #ddd;
    padding: 15px;
}

.list-group-item:last-child {
    border-bottom: none;
}
</style>