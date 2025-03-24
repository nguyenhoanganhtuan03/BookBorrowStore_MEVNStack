<template>
    <div 
        class="d-flex align-items-center book-card border border-primary"
        @click="goToDetail"
        @mouseover="hover = true" 
        @mouseleave="hover = false"
        :class="{ 'hover-effect': hover }"
    >
        <!-- Hình ảnh sách -->
        <img 
            :src="book.image ? `data:image/jpeg;base64,${book.image}` : defaultImage"
            alt="Book Cover"
            class="book-image"
        />
        
        <!-- Thông tin sách -->
        <div class="book-info">
            <h5 class="mb-1">{{ book.bookname || "Chưa có tên" }}</h5>
            <p class="mb-1"><strong>Tác giả:</strong> {{ book.author || "Không rõ" }}</p>
            <p class="mb-1"><strong>Giá:</strong> {{ formatPrice(book.price) }}</p>
            <p class="mb-0"><strong>Số lượng:</strong> {{ book.quantity ?? "Không có thông tin" }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        book: Object
    },
    data() {
        return {
            hover: false
        };
    },
    computed: {
        defaultImage() {
            return "/book.jpg"; // Ảnh mặc định
        }
    },
    methods: {
        formatPrice(price) {
            return price ? `${price.toLocaleString()} VNĐ` : "Chưa có giá";
        },
        goToDetail() {
            this.$router.push({ name: 'BookPage', params: { bookId: this.book.id } });
        }
    }
};
</script>

<style scoped>
.book-card {
    gap: 10px; /* Khoảng cách giữa ảnh và nội dung */
    padding: 10px; /* Thêm khoảng trống bên trong */
    border-radius: 8px; /* Bo tròn viền */
    cursor: pointer; /* Hiển thị con trỏ tay khi hover */
    transition: background-color 0.3s ease-in-out;
}

/* Hiệu ứng khi di chuột vào */
.hover-effect {
    background-color: rgba(0, 123, 255, 0.1);
}

.book-image {
    width: 80px;
    height: 120px;
    object-fit: cover;
    border-radius: 5px;
}

/* Đảm bảo nội dung không bị đè sát vào ảnh */
.book-info {
    flex: 1;
}
</style>
