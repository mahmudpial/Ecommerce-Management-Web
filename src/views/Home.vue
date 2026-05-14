<template>
    <div class="home-simple bg-white min-vh-100 text-start">

        <section class="py-5 border-bottom bg-light bg-opacity-50">
            <div class="container py-md-5">
                <div class="row justify-content-center text-center">
                    <div class="col-lg-8">
                        <h1 class="fw-bold text-dark display-5 mb-3">Manage Your Business Effortlessly</h1>
                        <p class="lead text-muted mb-4">
                            Commercia Pro is a powerful e-commerce management dashboard built with Vue.js, designed to
                            help you effortlessly manage your online store's products, orders, and customers from a
                            sleek and intuitive interface.
                        </p>
                        <div class="d-flex justify-content-center gap-2">
                            <router-link to="/admin/dashboard" class="btn btn-primary px-4 py-2 fw-semibold">
                                Dashboard
                            </router-link>
                            <router-link to="/admin/reports" class="btn btn-outline-dark px-4 py-2">
                                Reports
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="container py-5">
            <div class="row g-4 text-center">
                <div class="col-6 col-md-3">
                    <h2 class="fw-bold text-primary mb-0">{{ products.length }}</h2>
                    <small class="text-muted text-uppercase fw-bold tracking-wide">Total Products</small>
                </div>
                <div class="col-6 col-md-3">
                    <h2 class="fw-bold text-success mb-0">৳{{ numberFormat(totalStockValue) }}</h2>
                    <small class="text-muted text-uppercase fw-bold tracking-wide">Stock Value</small>
                </div>
                <div class="col-6 col-md-3">
                    <h2 class="fw-bold text-warning mb-0">{{ lowStockCount }}</h2>
                    <small class="text-muted text-uppercase fw-bold tracking-wide">Low Stock Alerts</small>
                </div>
                <div class="col-6 col-md-3">
                    <h2 class="fw-bold text-info mb-0">Active</h2>
                    <small class="text-muted text-uppercase fw-bold tracking-wide">System Status</small>
                </div>
            </div>
        </section>

        <section class="container pb-5">
            <div class="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2">
                <h4 class="fw-bold mb-0 text-dark">Recent Products</h4>
                <router-link to="/admin/products" class="text-decoration-none small fw-bold">View All →</router-link>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border spinner-border-sm text-secondary"></div>
            </div>

            <div v-else class="row g-4">
                <div v-for="product in products.slice(0, 4)" :key="product.id" class="col-12 col-sm-6 col-md-3">
                    <div class="product-card border-0">
                        <div class="bg-light rounded-3 mb-3 d-flex align-items-center justify-content-center"
                            style="height: 180px;">
                            <i class="bi bi-image text-muted opacity-25 display-4"></i>
                        </div>
                        <h6 class="fw-bold text-dark mb-1 text-truncate">{{ product.name }}</h6>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-primary fw-bold">৳{{ numberFormat(product.price) }}</span>
                            <span class="badge bg-light text-dark border fw-normal">{{ product.stock }} Qty</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axiosClient from '../api/axios';

const products = ref([]);
const loading = ref(true);

const fetchLiveCatalog = async () => {
    loading.value = true;
    try {
        const response = await axiosClient.get('/admin/products');
        const rawData = response.data?.data || response.data;
        products.value = Array.isArray(rawData) ? rawData : (rawData?.data || []);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        loading.value = false;
    }
};


const totalStockValue = computed(() => {
    return products.value.reduce((sum, p) => sum + (Number(p.price) * Number(p.stock)), 0);
});

const lowStockCount = computed(() => {
    return products.value.filter(p => Number(p.stock) <= 10).length;
});

const numberFormat = (v) => Number(v).toLocaleString('en-IN');

onMounted(fetchLiveCatalog);
</script>

<style scoped>
.product-card {
    transition: opacity 0.2s ease;
}

.product-card:hover {
    opacity: 0.8;
}

.tracking-wide {
    letter-spacing: 0.5px;
    font-size: 10px;
}
</style>