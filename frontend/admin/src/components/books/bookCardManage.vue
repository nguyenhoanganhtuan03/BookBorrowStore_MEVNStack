<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <div class="card book-card shadow-sm">
        <div class="row g-0">
            <!-- Image/Icon Column -->
            <div class="book-image-container p-3 d-flex justify-content-center align-items-center border rounded bg-light">
                <div v-if="processedImage">
                    <img 
                        :src="processedImage" 
                        :alt="book.bookname" 
                        class="book-image img-fluid rounded shadow-sm" 
                        @error="handleImageError"
                        style="max-width: 150px; max-height: 200px;"
                    />
                </div>
                <div v-else class="default-book-icon text-center">
                    <i class="bi bi-book text-dark" style="font-size: 3rem;"></i>
                </div>
            </div>

            <!-- Book Information Column -->
            <div class="col-md-7 p-3">
                <p class="card-text"><strong>Tên sách:</strong> {{ book.bookname }}</p>
                <p class="card-text"><strong>Tác giả:</strong> {{ book.author }}</p>
                <p class="card-text"><strong>Giá:</strong> {{ formatPrice(book.price) }}</p>
                <p class="card-text"><strong>Số lượng:</strong> {{ book.quantity }}</p>
                <p class="card-text"><strong>Thể loại:</strong> {{ book.category }}</p>
                <p class="card-text"><strong>Năm xuất bản:</strong> {{ book.publishYear || 'Không xác định' }}</p>
                <p class="card-text"><strong>Mã nhà xuất bản:</strong> {{ book.publisherCode || 'Không có' }}</p>
            </div>

            <!-- Action Buttons Column -->
            <div class="col-md-2 d-flex align-items-center justify-content-center">
                <div class="btn-group">
                    <button class="btn btn-warning btn-sm" @click="openUpdateForm">
                        ✏️
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deleteBook">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Update Form -->
    <div v-if="showUpdateForm" class="update-form-overlay">
        <div class="update-form">
            <h5>Cập nhật thông tin sách</h5>
            <input v-model="updatedBook.bookname" placeholder="Tên sách" class="form-control mb-2" />
            <input v-model="updatedBook.author" placeholder="Tác giả" class="form-control mb-2" />
            <input v-model="updatedBook.price" type="number" placeholder="Giá" class="form-control mb-2" />
            <input v-model="updatedBook.quantity" type="number" placeholder="Số lượng" class="form-control mb-2" />
            <input v-model="updatedBook.publishYear" type="number" placeholder="Năm xuất bản" class="form-control mb-2" />
            <input v-model="updatedBook.publisherCode" placeholder="Mã nhà xuất bản" class="form-control mb-2" />
            <input v-model="updatedBook.category" placeholder="Thể loại" class="form-control mb-2" />
            
            <!-- Image Upload -->
            <div class="mb-3">
                <label class="form-label">Ảnh bìa sách</label>
                <input 
                    type="file" 
                    class="form-control" 
                    @change="handleImageUpload" 
                    accept="image/*"
                />
                <div v-if="processedImage" class="mt-2">
                    <img :src="processedImage" alt="Book Cover" style="max-width: 200px; max-height: 200px;" />
                </div>
            </div>
            
            <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-secondary" @click="showUpdateForm = false">Hủy</button>
                <button class="btn btn-primary" @click="saveChanges">Lưu thay đổi</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import bookService from "@/services/book.service";

export default {
    props: {
        book: {
            type: Object,
            required: true
        }
    },
    setup(props, { emit }) {
        const router = useRouter();
        const showUpdateForm = ref(false);
        const updatedBook = ref({ ...props.book });
        const imageFile = ref(null);

        // Image processing computed property
        const processedImage = computed(() => {
            // If no image exists, return null
            if (!props.book.image) return null;

            // If it's already a valid URL or base64 string, return as-is
            if (
                typeof props.book.image === 'string' && 
                (props.book.image.startsWith('http') || 
                 props.book.image.startsWith('data:image'))
            ) {
                return props.book.image;
            }

            // Handle image stored as Buffer or object with data
            if (props.book.image.data) {
                try {
                    // Convert buffer to base64
                    const base64 = btoa(
                        new Uint8Array(props.book.image.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte), 
                            ''
                        )
                    );
                    return `data:${props.book.image.contentType || 'image/jpeg'};base64,${base64}`;
                } catch (error) {
                    console.error('Error processing image:', error);
                    return null;
                }
            }

            // If image is a base64 string without prefix
            if (typeof props.book.image === 'string') {
                return `data:image/jpeg;base64,${props.book.image}`;
            }

            return null;
        });

        // Handle image file selection
        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Store base64 string
                    updatedBook.value.image = e.target.result;
                    imageFile.value = file;
                };
                reader.readAsDataURL(file);
            }
        };

        const formatPrice = (price) => {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        };

        const openUpdateForm = () => {
            updatedBook.value = { ...props.book };
            showUpdateForm.value = true;
        };

        const saveChanges = async () => {
            try {
                // If an image file was selected, ensure it's in the right format
                if (imageFile.value) {
                    // The image is already in base64 format from handleImageUpload
                }

                await bookService.updateBook(updatedBook.value._id, updatedBook.value);
                alert(`✅ Cập nhật thành công!`);
                emit("update-book", updatedBook.value);
                showUpdateForm.value = false;
                router.push("/").then(() => {
                    router.push("/admin/book-manage");
                });
            } catch (error) {
                console.error("🔴 Lỗi khi cập nhật sách:", error);
                alert("❌ Cập nhật thất bại!");
            }
        };

        const deleteBook = async () => {
            if (!confirm(`Bạn có chắc muốn xóa sách "${props.book._id}"?`)) return;
            try {
                await bookService.deleteBook(props.book._id);
                alert(`✅ Đã xóa sách "${props.book.bookname}"`);
                router.push("/").then(() => {
                    router.push("/admin/book-manage");
                });
            } catch (error) {
                console.error("🔴 Lỗi khi xóa sách:", error);
                alert("❌ Xóa sách thất bại!");
            }
        };

        return { 
            showUpdateForm, 
            updatedBook, 
            openUpdateForm, 
            saveChanges, 
            deleteBook,
            formatPrice,
            processedImage,
            handleImageUpload,
            imageFile
        };
    },
    methods: {
        handleImageError(event) {
            // Fallback to default book icon if image fails to load
            event.target.style.display = 'none';
            this.$nextTick(() => {
                event.target.closest('.book-image-container').innerHTML = `
                    <div class="default-book-icon">
                        <i class="bi bi-book text-dark" style="font-size: 3rem;"></i>
                    </div>
                `;
            });
        }
    }
};
</script>

<style scoped>
.book-card {
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
    margin-bottom: 15px;
}

.book-card:hover {
    transform: scale(1.03);
    filter: brightness(1.05);
}

.bg-primary, .bg-success, .bg-warning, .bg-danger, .bg-secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.btn-group {
    display: flex;
    gap: 5px;
}

.update-form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.update-form {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    max-width: 90%;
}
</style>