<template>
    <div>
        <!-- Header -->
        <AppHeader />

        <div class="container mt-5">
            <h2 class="text-center mb-4">Quản lý hệ thống</h2>
            
            <div class="row row-cols-md-3 row-cols-2 g-4 justify-content-center">
                <div v-for="(item, index) in menuItems" :key="index" class="col">
                    <div 
                        class="card text-white text-center p-4 shadow-sm admin-card" 
                        :class="item.bgColor"
                        @click="navigateTo(item.route)"
                    >
                        <div class="card-body">
                            <i :class="item.icon"></i>
                            <h5 class="card-title mt-3">{{ item.title }}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <AppFooter />
    </div>
</template>

<script>
import { useRouter } from "vue-router";
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";

export default {
    components: {
        AppHeader,
        AppFooter,
    },
    setup() {
        const router = useRouter();

        const menuItems = [
            { title: "Quản lý tài khoản", icon: "fas fa-user-cog fa-3x", route: "/admin/user-manage", bgColor: "bg-primary" },
            { title: "Quản lý nhân viên", icon: "fas fa-users fa-3x", route: "/admin/staff-manage", bgColor: "bg-success" },
            { title: "Quản lý sách", icon: "fas fa-book fa-3x", route: "/admin/book-manage", bgColor: "bg-warning" },
            { title: "Quản lý đơn mượn sách", icon: "fas fa-file-alt fa-3x", route: "/admin/borrow-manage", bgColor: "bg-danger" },
            { title: "Quản lý nhà xuất bản", icon: "fas fa-building fa-3x", route: "/admin/publisher-manage", bgColor: "bg-info" }
        ];

        const navigateTo = (route) => {
            router.push(route);
        };

        return { menuItems, navigateTo };
    },
};
</script>

<style scoped>
.admin-card {
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
    border-radius: 12px;
    min-height: 150px;
    margin: 10px;
}

.admin-card:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
}
</style>
