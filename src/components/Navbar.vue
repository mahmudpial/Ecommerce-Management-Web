<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div class="container">
            <router-link class="navbar-brand fw-bold text-primary" to="/">
                <i class="bi bi-shop me-2"></i>Commercia pro
            </router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/products">Products</router-link>
                    </li>
                </ul>

                <div class="d-flex align-items-center">
                    <router-link to="/cart" class="btn btn-outline-light me-3 position-relative">
                        <i class="bi bi-cart3"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                            v-if="cartStore.cartCount > 0" style="font-size: 0.6rem;">
                            {{ cartStore.cartCount }}
                        </span>
                    </router-link>

                    <template v-if="!authStore.isAuthenticated">
                        <router-link to="/login" class="btn btn-outline-primary me-2">Login</router-link>
                    </template>

                    <template v-else>
                        <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" type="button" id="userDropdown"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle me-1"></i> {{ authStore.user?.name }}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                                <li><router-link class="dropdown-item" to="/dashboard">Dashboard</router-link></li>
                                <li><router-link class="dropdown-item" to="/my-orders">My Orders</router-link></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><button @click="handleLogout" class="dropdown-item text-danger">Logout</button></li>
                            </ul>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

const authStore = useAuthStore();
const router = useRouter();
const cartStore = useCartStore();

const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
        authStore.logout();
        router.push({ name: 'Login' });
    }
};
</script>

<style scoped>
.navbar-brand {
    font-size: 1.5rem;
    letter-spacing: 1px;
}

.nav-link {
    font-weight: 500;
    transition: color 0.3s;
}

.nav-link:hover {
    color: #0d6efd !important;
}

.dropdown-menu {
    border-radius: 10px;
}
</style>