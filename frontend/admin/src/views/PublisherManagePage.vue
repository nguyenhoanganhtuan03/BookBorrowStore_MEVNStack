<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <div class="container mt-4">
            <h2 class="text-center mb-4">Quản lý nhà xuất bản</h2>

            <!-- Nút thêm nhà xuất bản và quay lại -->
            <div class="d-flex justify-content-between mb-3">
                <button class="btn btn-secondary" @click="goBack">
                    🔙 Quay lại
                </button>
                <button class="btn btn-primary" @click="showAddPublisherModal = true">
                    ➕ Thêm Nhà Xuất Bản
                </button>
            </div>

            <!-- Danh sách nhà xuất bản -->
            <div v-if="publisherList.length > 0" class="list-group">
                <PublisherCard v-for="publisher in publisherList" 
                            :key="publisher.id" 
                            :publisher="publisher" 
                            @deleted="removePublisherFromList"/>
            </div>

            <!-- Hiển thị nếu không có dữ liệu -->
            <div v-else class="text-center">
                <p class="text-muted">Không có dữ liệu nhà xuất bản.</p>
            </div>
        </div>

        <!-- Footer -->
        <AppFooter />

        <!-- Modal thêm nhà xuất bản -->
        <div v-if="showAddPublisherModal" class="modal-overlay">
            <div class="modal-content">
                <h5>Thêm Nhà Xuất Bản</h5>

                <input type="text" v-model="newPublisher.publisherName" placeholder="Tên nhà xuất bản" class="form-control mb-2" required />
                <input type="text" v-model="newPublisher.address" placeholder="Địa chỉ" class="form-control mb-2" required />

                <div class="d-flex justify-content-end mt-3">
                    <button class="btn btn-secondary me-2" @click="cancelAndCloseModal">Hủy</button>
                    <button class="btn btn-success" @click="addPublisher">Thêm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PublisherService from "@/services/publisher.service";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";
import PublisherCard from "@/components/publisher/publisherCard.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
        PublisherCard,
    },
    setup() {
        const router = useRouter();
        const publisherList = ref([]);
        const showAddPublisherModal = ref(false);
        const newPublisher = ref({
            publisherName: "",
            address: "",
        });

        const goBack = () => {
            router.push("/admin");
        };

        const fetchPublisherList = async () => {
            try {
                const response = await PublisherService.getAllPublishers();
                publisherList.value = response.data || [];
                console.log("Nhận từ Frontend", publisherList.value)
            } catch (error) {
                console.error("🔴 Lỗi khi tải danh sách nhà xuất bản:", error);
            }
        };

        const addPublisher = async () => {
            try {
                if (!newPublisher.value.publisherName || !newPublisher.value.address) {
                    alert("❌ Vui lòng điền đầy đủ thông tin!");
                    return;
                }

                await PublisherService.addPublisher(newPublisher.value);

                // Reset form
                newPublisher.value = { publisherName: "", address: "" };

                // Tải lại danh sách
                await fetchPublisherList();

                // Đóng modal
                showAddPublisherModal.value = false;

                alert("✅ Thêm nhà xuất bản thành công!");
            } catch (error) {
                console.error("🔴 Lỗi khi thêm nhà xuất bản:", error);
                alert("❌ Không thể thêm nhà xuất bản!");
            }
        };

        const removePublisherFromList = (id) => {
            publisherList.value = publisherList.value.filter(publisher => publisher.id !== id);
        };

        const cancelAndCloseModal = () => {
            showAddPublisherModal.value = false;
        };

        onMounted(fetchPublisherList);

        return { publisherList, showAddPublisherModal, newPublisher, addPublisher, removePublisherFromList, cancelAndCloseModal, goBack };
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
