<template>
    <div class="admin-wrapper d-flex min-vh-100 bg-light">

        <div class="mobile-top-bar d-md-none bg-dark text-white d-flex align-items-center justify-content-between px-3 py-2 position-fixed top-0 start-0 w-100"
            style="z-index: 1040; height: 56px;">
            <h6 class="fw-bold mb-0 text-primary d-flex align-items-center">
                <i class="bi bi-shield-lock-fill me-1"></i> Commercia <span class="text-white small ms-1">Pro</span>
            </h6>
            <button @click="toggleSidebar" class="btn btn-dark border-secondary px-2.5 py-1">
                <i class="bi" :class="isSidebarOpen ? 'bi-x-lg' : 'bi-list'"></i>
            </button>
        </div>

        <aside class="sidebar bg-dark text-white p-3 d-flex flex-column justify-content-between"
            :class="{ 'mobile-open': isSidebarOpen }">
            <div>
                <div class="brand border-bottom border-secondary pb-3 mb-4 text-start">
                    <h5 class="fw-bold mb-0 text-primary d-none d-md-block">
                        <i class="bi bi-shield-lock-fill me-1"></i> Commercia <span class="text-white small">Pro</span>
                    </h5>
                    <div class="d-md-none d-flex justify-content-between align-items-center">
                        <h5 class="fw-bold mb-0 text-primary">Control Menu</h5>
                        <button @click="toggleSidebar" class="btn btn-sm btn-outline-secondary d-md-none py-0 px-1.5"><i
                                class="bi bi-x-lg"></i></button>
                    </div>
                    <span class="badge bg-opacity-10 mt-2 text-uppercase"
                        :class="authStore.user?.role_id === 1 ? 'bg-danger text-danger' : 'bg-warning text-warning'">
                        Role: {{ authStore.user?.role_id === 1 ? 'Admin' : 'Manager' }}
                    </span>
                </div>

                <ul class="nav flex-column gap-2 text-start">
                    <li class="nav-item">
                        <router-link to="/admin/dashboard" @click="closeSidebarOnMobile"
                            class="nav-link text-white rounded p-2.5 d-flex align-items-center gap-2">
                            <i class="bi bi-speedometer2"></i> Overview Metrics
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/orders" @click="closeSidebarOnMobile"
                            class="nav-link text-white rounded p-2.5 d-flex align-items-center gap-2">
                            <i class="bi bi-cart-check"></i> Manage Orders
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/products" @click="closeSidebarOnMobile"
                            class="nav-link text-white rounded p-2.5 d-flex align-items-center gap-2">
                            <i class="bi bi-boxes"></i> Products Control
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/categories-brands" @click="closeSidebarOnMobile"
                            class="nav-link text-white rounded p-2.5 d-flex align-items-center gap-2">
                            <i class="bi bi-tags"></i> Brandegory Control
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/reports" @click="closeSidebarOnMobile"
                            class="nav-link text-white rounded p-2.5 d-flex align-items-center gap-2">
                            <i class="bi bi-graph-up-arrow"></i> Business Reports
                        </router-link>
                    </li>
                </ul>
            </div>

            <div class="logout-zone border-top border-secondary pt-3">
                <button @click="handleLogout"
                    class="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold small">
                    <i class="bi bi-box-arrow-left"></i> Exit Workspace
                </button>
            </div>
        </aside>

        <main class="content-area bg-light flex-grow-1 p-3 p-md-4 d-flex flex-column overflow-x-hidden">
            <header
                class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center bg-white p-3 rounded-3 shadow-sm mb-4 gap-2">
                <h6 class="fw-bold mb-0 text-secondary">
                    <i class="bi bi-terminal-box-fill me-1 text-primary"></i> Control Panel Workspace
                </h6>
                <div class="user-meta small text-dark">
                    Welcome, <strong>{{ authStore.user?.name }}</strong>
                </div>
            </header>

            <div class="w-100 flex-grow-1">
                <router-view />
            </div>
        </main>

        <div v-if="isSidebarOpen" @click="toggleSidebar"
            class="sidebar-backdrop d-md-none position-fixed top-0 start-0 w-100 h-100"
            style="z-index: 1025; background-color: rgba(0,0,0,0.4);"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// রেসপনসিভ সাইডবার স্টেট
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
        isSidebarOpen.value = false;
    }
};

// লগআউট সিকোয়েন্স হ্যান্ডলার (হুবহু অপরিবর্তিত)
const handleLogout = async () => {
    if (confirm("Are you sure you want to exit the Commercia Pro control panel?")) {
        try {
            await authStore.logout();
            router.push({ name: 'Login' });
        } catch (error) {
            console.error("Logout runtime breakdown:", error);
        }
    }
};
</script>

<style scoped>
.nav-link {
    transition: all 0.2s ease-in-out;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #0d6efd !important;
}

.router-link-active {
    background-color: rgba(13, 110, 253, 0.15) !important;
    color: #0d6efd !important;
    font-weight: 600;
}

/* 🖥️ ডেস্কটপ সাইডবার মেজারমেন্ট */
.sidebar {
    width: 260px;
    min-width: 260px;
    position: sticky;
    top: 0;
    height: 100vh;
    z-index: 1030;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-area {
    max-width: 100%;
}

/* 📱 মোবাইল এবং ট্যাবলেট ব্রেপপয়েন্ট রেসপনসিভ ম্যাজিক */
@media (max-width: 767.98px) {
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        transform: translateX(-100%);
        /* ডিফল্ট স্ক্রিনের বাইরে থাকবে */
        z-index: 1050;
    }

    .sidebar.mobile-open {
        transform: translateX(0);
        /* টগল বাটন ক্লিক করলে স্লাইড হয়ে ভেতরে আসবে */
    }

    .content-area {
        margin-top: 56px;
        /* টপ মোবাইল বারের জায়গা ফিক্স করার জন্য */
        padding: 15px !important;
    }
}
</style>