<template>
    <nav class="navbar navbar-dark bg-primary px-3">
        <div class="d-flex align-items-center gap-3">
            <!-- Logo -->
            <router-link to="/" class="navbar-brand fw-semibold">
                📚 Quản lý Mượn Sách
            </router-link>

            <!-- Nút Tìm kiếm (Trong suốt) -->
            <router-link to="/search" class="custom-btn">
                <i class="fas fa-search"></i> Tìm kiếm
            </router-link>

            <!-- Nút Lịch sử mượn sách (Trong suốt) -->
            <router-link to="/history" class="custom-btn">
                <i class="fas fa-book-open"></i> Lịch sử mượn sách
            </router-link>
        </div>

        <!-- Icon User với Dropdown -->
        <div class="dropdown">
            <button class="btn btn-primary border-0 dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-user-circle fa-lg"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li>
                    <router-link to="/login" class="dropdown-item">
                        Đăng nhập
                    </router-link>
                </li>
                <li>
                    <router-link to="/register" class="dropdown-item">
                        Đăng ký
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
.custom-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 16px;
    text-decoration: none;
    padding: 6px 12px;
    transition: color 0.3s ease-in-out;
}

.custom-btn:hover {
    color: #f8f9fa;
    text-decoration: underline;
}
</style>
