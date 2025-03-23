<script>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
    },
};
</script>

<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <!-- Nội dung chính -->
        <div class="container text-center mt-5">
            <h1 class="fw-bold text-primary">Chào mừng đến Book Borrow Store</h1>
            <p class="lead">Nơi bạn có thể tìm và mượn những cuốn sách yêu thích.</p>

            <img src="@/assets/library.jpg" alt="Thư viện sách" class="img-fluid mt-3 shadow-lg rounded">
        </div>

        <!-- Footer -->
        <AppFooter />
    </div>
</template>
