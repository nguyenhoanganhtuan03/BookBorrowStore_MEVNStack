<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <div class="container mt-4">
            <h2 class="text-center mb-4">Quản lý sách</h2>

            <!-- Nút thêm người dùng và quay lại -->
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-secondary" @click="goBack">
                    🔙 Quay lại
                </button>
                <button class="btn btn-primary" @click="showAddBookModal = true">
                    ➕ Thêm Sách
                </button>
            </div>

            <!-- Danh sách người dùng -->
            <div v-if="bookList.length > 0" class="list-group">
                <BookCardManage v-for="book in bookList" 
                          :key="book._id" 
                          :book="book" 
                          @deleted="removeBookFromList"/>
            </div>

            <!-- Hiển thị nếu không có người dùng -->
            <div v-else class="text-center">
                <p class="text-muted">Không có người dùng nào.</p>
            </div>
        </div>

        <!-- Footer -->
        <AppFooter />

        <!-- Modal thêm người dùng -->
        <div v-if="showAddBookModal" class="modal-overlay">
            <div class="modal-content">
                <h5>Thêm Sách</h5>

                <input type="text" v-model="newBook.bookname" placeholder="Tên sách" class="form-control mb-2" required />
                <input type="text" v-model="newBook.author" placeholder="Tác giả" class="form-control mb-2" required />
                <input type="number" v-model="newBook.price" placeholder="Giá" class="form-control mb-2" required />
                <input type="number" v-model="newBook.quantity" placeholder="Số lượng" class="form-control mb-2" required />
                <input type="number" v-model="newBook.publishYear" placeholder="Năm xuất bản" class="form-control mb-2" />
                <input type="text" v-model="newBook.publisherCode" placeholder="Mã nhà xuất bản" class="form-control mb-2" />
                <input type="text" v-model="newBook.category" placeholder="Thể loại" class="form-control mb-2" />
                
                <label class="form-label">Ảnh bìa sách:</label>
                <input type="file" @change="handleImageUpload" class="form-control mb-2" accept="image/*" />
                
                <div v-if="newBook.imagePreview" class="mt-2">
                    <img :src="newBook.imagePreview" alt="Ảnh bìa sách" class="img-thumbnail" style="max-width: 150px;" />
                </div>

                <div class="d-flex justify-content-end mt-3">
                    <button class="btn btn-secondary me-2" @click="cancelAndCloseModal">Hủy</button>
                    <button class="btn btn-success" @click="addBook">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import BookService from "@/services/book.service";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import BookCardManage from "@/components/books/bookCardManage.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
        BookCardManage,
    },
    setup() {
        const router = useRouter();
        const bookList = ref([]);
        const showAddBookModal = ref(false);
        const newBook = ref({
            bookname: "",
            author: "",
            price: null,
            quantity: null,
            publishYear: null,
            publisherCode: "",
            category: null,
            image: null,
        });

        const goBack = () => {
            router.push("/admin");
        };

        const fetchBookList = async () => {
            try {
                const response = await BookService.getBooks();
                console.log(response.data);
                bookList.value = response.data || [];
            } catch (error) {
                console.error("🔴 Lỗi khi tải danh sách sách:", error);
            }
        };

        const addBook = async () => {
            try {
                if (!newBook.value.bookname || !newBook.value.author || 
                    !newBook.value.price || !newBook.value.quantity ) {
                    alert("❌ Vui lòng điền đầy đủ thông tin!");
                    return;
                }

                // Chuyển đổi publishYear và publisherCode về đúng kiểu dữ liệu
                newBook.value.publishYear = newBook.value.publishYear ? Number(newBook.value.publishYear) : null;
                newBook.value.publisherCode = newBook.value.publisherCode ? String(newBook.value.publisherCode) : null;

                // Nếu có ảnh, chuyển sang base64
                if (newBook.value.image) {
                    const convertToBase64 = (file) => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = (error) => reject(error);
                            reader.readAsDataURL(file);
                        });
                    };

                    try {
                        newBook.value.image = await convertToBase64(newBook.value.image);
                    } catch (error) {
                        console.error("🔴 Lỗi khi chuyển ảnh sang base64:", error);
                        alert("❌ Lỗi xử lý ảnh!");
                        return;
                    }
                }

                // Gửi dữ liệu lên server
                await BookService.addBook(newBook.value);

                // Reset form
                newBook.value = { 
                    bookname: "", author: "", price: null, quantity: null, publishYear: null, 
                    publisherCode: "", category: "", image: null
                };

                // Tải lại danh sách sách
                await fetchBookList();
                showAddBookModal.value = false;

                alert("✅ Sách đã được thêm!");
            } catch (error) {
                console.error("🔴 Lỗi khi thêm sách:", error);
                alert("❌ Không thể thêm sách!");
            }
        };

        const handleImageUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newBook.value.image = file;
                    newBook.value.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        const removeBookFromList = (bookId) => {
            bookList.value = bookList.value.filter(book => book.bookId !== bookId);
        };

        const cancelAndCloseModal = () => {
            showAddBookModal.value = false; 
        };

        onMounted(fetchBookList);

        return { bookList, showAddBookModal, newBook, addBook, removeBookFromList, cancelAndCloseModal, goBack, handleImageUpload };
    },
};
</script>


<style scoped>
.list-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
}
</style>