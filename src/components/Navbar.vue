<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top glass-navbar py-2">
        <div class="container">
            <router-link class="navbar-brand d-flex align-items-center" to="/">
                <div class="logo-icon bg-primary text-white rounded-3 me-2">
                    <i class="bi bi-shop-window"></i>
                </div>
                <span class="fw-bolder text-dark">Commercia<span class="text-primary ms-1">Pro</span></span>
            </router-link>

            <div class="d-flex align-items-center gap-2 d-lg-none">
                <router-link to="/cart" class="nav-icon-btn position-relative">
                    <i class="bi bi-bag"></i>
                    <span v-if="cartStore.cartCount > 0" class="badge-dot"></span>
                </router-link>
                <button class="navbar-toggler border-0 shadow-none p-0" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav">
                    <i class="bi bi-list fs-1 text-dark"></i>
                </button>
            </div>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto text-center">
                    <li class="nav-item mx-lg-2">
                        <router-link class="nav-link custom-link" active-class="active" to="/">Home</router-link>
                    </li>
                    <li class="nav-item mx-lg-2">
                        <router-link class="nav-link custom-link" active-class="active"
                            to="/products">Collections</router-link>
                    </li>
                    <li class="nav-item mx-lg-2">
                        <a class="nav-link custom-link" href="#">Offers</a>
                    </li>
                </ul>

                <div class="d-none d-lg-flex align-items-center gap-4">
                    <router-link to="/cart" class="nav-icon-btn position-relative">
                        <i class="bi bi-bag"></i>
                        <span v-if="cartStore.cartCount > 0" class="cart-badge">{{ cartStore.cartCount }}</span>
                    </router-link>

                    <div class="auth-section border-start ps-4">
                        <template v-if="!authStore.isAuthenticated">
                            <div class="d-flex align-items-center gap-2">
                                <router-link to="/login"
                                    class="btn btn-link text-decoration-none text-dark fw-bold small">Login</router-link>
                                <router-link to="/register"
                                    class="btn btn-primary px-4 py-2 rounded-pill shadow-sm small fw-bold">Get
                                    Started</router-link>
                            </div>
                        </template>

                        <template v-else>
                            <div class="dropdown">
                                <button class="user-pill dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <img :src="`https://ui-avatars.com/api/?name=${authStore.user?.name}&background=0d6efd&color=fff&bold=true`"
                                        class="user-avatar">
                                    <div class="user-info d-none d-xl-block">
                                        <p class="name">{{ authStore.user?.name }}</p>
                                        <p class="role">{{ authStore.role }}</p>
                                    </div>
                                </button>
                                <ul
                                    class="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-4 p-2 mt-3 animate slideIn">
                                    <li class="dropdown-header py-3 px-4 border-bottom mb-2">
                                        <p class="text-muted small mb-0">Hello,</p>
                                        <p class="text-dark fw-bold mb-0 text-truncate">{{ authStore.user?.email }}</p>
                                    </li>
                                    <li><router-link class="dropdown-item rounded-3" to="/dashboard"><i
                                                class="bi bi-grid-1x2 me-2"></i> Dashboard</router-link></li>
                                    <li><router-link class="dropdown-item rounded-3" to="/cart"><i
                                                class="bi bi-bag-check me-2"></i> My Orders</router-link></li>
                                    <li>
                                        <hr class="dropdown-divider opacity-50">
                                    </li>
                                    <li><button @click="handleLogout"
                                            class="dropdown-item text-danger rounded-3 fw-bold"><i
                                                class="bi bi-box-arrow-right me-2"></i> Logout</button></li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="d-lg-none text-center border-top pt-3 mt-3">
                    <template v-if="!authStore.isAuthenticated">
                        <router-link to="/login" class="btn btn-outline-dark w-100 mb-2">Login</router-link>
                        <router-link to="/register" class="btn btn-primary w-100">Sign Up</router-link>
                    </template>
                    <template v-else>
                        <router-link to="/dashboard" class="btn btn-light w-100 mb-2">Go to Dashboard</router-link>
                        <button @click="handleLogout" class="btn btn-danger w-100">Logout</button>
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>
<script setup>
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

// স্টোর এবং রাউটার ইনিশিয়ালাইজ
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

// স্ক্রল করলে নেভবারের শ্যাডো পরিবর্তনের জন্য (Optional UI Effect)
const isScrolled = ref(false);

onMounted(() => {
    window.addEventListener('scroll', () => {
        isScrolled.value = window.scrollY > 20;
    });
});

// লগআউট হ্যান্ডেলার
const handleLogout = async () => {
    // প্রফেশনাল কনফার্মেশন ডায়ালগ
    const confirmLogout = confirm("Are you sure you want to log out of Commercia Pro?");

    if (confirmLogout) {
        try {
            await authStore.logout();
            // সাকসেসফুল লগআউটের পর ইউজারকে হোম পেজে বা লগইন পেজে পাঠিয়ে দিন
            router.push({ name: 'Login' });
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Something went wrong during logout. Please try again.");
        }
    }
};
</script>
<style scoped>
/* Glassmorphism Effect */
.glass-navbar {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Logo Styling */
.logo-icon {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
}

/* Nav Links */
.custom-link {
    font-weight: 600;
    color: #4b5563 !important;
    font-size: 0.95rem;
    position: relative;
    padding: 0.5rem 1rem !important;
}

.custom-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: #0d6efd;
    transition: 0.3s;
    transform: translateX(-50%);
}

.custom-link:hover::after,
.custom-link.active::after {
    width: 20px;
}

.custom-link.active {
    color: #0d6efd !important;
}

/* Icons & Badges */
.nav-icon-btn {
    font-size: 1.4rem;
    color: #374151;
    transition: 0.2s;
    display: flex;
    align-items: center;
}

.cart-badge {
    position: absolute;
    top: -5px;
    right: -10px;
    background: #0d6efd;
    color: white;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 50px;
    border: 2px solid #fff;
}

.badge-dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background: #0d6efd;
    border-radius: 50%;
    border: 1px solid #fff;
}

/* User Pill Styling */
.user-pill {
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    padding: 5px 12px 5px 5px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: 0.3s;
}

.user-pill:hover {
    background: #f1f5f9;
}

.user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.user-info .name {
    font-size: 0.85rem;
    font-weight: 700;
    margin-bottom: 0;
    color: #1e293b;
    line-height: 1;
}

.user-info .role {
    font-size: 0.65rem;
    color: #64748b;
    margin-bottom: 0;
    text-transform: uppercase;
    font-weight: 800;
}

/* Dropdown Animation */
.animate {
    animation-duration: 0.3s;
    animation-fill-mode: both;
}

@keyframes slideIn {
    0% {
        transform: translateY(1rem);
        opacity: 0;
    }

    100% {
        transform: translateY(0rem);
        opacity: 1;
    }
}

.dropdown-item {
    padding: 10px 15px;
    font-weight: 500;
    color: #475569;
}

.dropdown-item:hover {
    background: #f1f5f9;
    color: #0d6efd;
    transform: translateX(5px);
    transition: 0.2s;
}
</style>