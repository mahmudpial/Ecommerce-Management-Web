<template>
    <div class="dashboard-page bg-light-subtle min-vh-100 py-5">
        <div class="container">
            <div class="row mb-4">
                <div class="col-md-8">
                    <h2 class="fw-bold text-dark mb-1">Welcome back, {{ authStore.user?.name }}! 👋</h2>
                    <p class="text-muted">Manage your orders and personal information from your account dashboard.</p>
                </div>
                <div class="col-md-4 text-md-end d-flex align-items-center justify-content-md-end gap-2">
                    <router-link to="/cart" class="btn btn-white border rounded-3 shadow-sm px-4">
                        <i class="bi bi-cart3 me-2"></i>View Cart
                    </router-link>
                </div>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
                        <div class="bg-primary-subtle text-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style="width: 60px; height: 60px;">
                            <i class="bi bi-bag-check fs-3"></i>
                        </div>
                        <h4 class="fw-bold mb-0">{{ orders.length }}</h4>
                        <span class="text-muted small fw-bold text-uppercase">Total Orders</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
                        <div class="bg-warning-subtle text-warning rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style="width: 60px; height: 60px;">
                            <i class="bi bi-clock-history fs-3"></i>
                        </div>
                        <h4 class="fw-bold mb-0">{{ pendingOrdersCount }}</h4>
                        <span class="text-muted small fw-bold text-uppercase">Pending Deliveries</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
                        <div class="bg-success-subtle text-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style="width: 60px; height: 60px;">
                            <i class="bi bi-wallet2 fs-3"></i>
                        </div>
                        <h4 class="fw-bold mb-0">৳{{ cartStore.totalPrice }}</h4>
                        <span class="text-muted small fw-bold text-uppercase">Saved for Cart</span>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <div class="text-center mb-4">
                            <img :src="`https://ui-avatars.com/api/?name=${authStore.user?.name}&background=0d6efd&color=fff&bold=true`"
                                class="rounded-circle border border-4 border-white shadow-sm" width="100">
                            <h5 class="fw-bold mt-3 mb-0">{{ authStore.user?.name }}</h5>
                            <span class="badge bg-dark rounded-pill px-3 mt-2">{{ authStore.role }}</span>
                        </div>
                        <hr class="opacity-25">
                        <div class="mb-3">
                            <label class="small text-muted fw-bold text-uppercase mb-1">Email Address</label>
                            <p class="mb-0 fw-bold text-dark text-truncate">{{ authStore.user?.email }}</p>
                        </div>
                        <div class="mb-3">
                            <label class="small text-muted fw-bold text-uppercase mb-1">Member Since</label>
                            <p class="mb-0 fw-bold text-dark">{{ formatDate(authStore.user?.created_at) }}</p>
                        </div>
                        <button class="btn btn-outline-primary w-100 rounded-3 mt-3 fw-bold">
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div
                            class="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
                            <h5 class="fw-bold mb-0">Recent Orders</h5>
                            <span v-if="loading" class="spinner-border spinner-border-sm text-primary"></span>
                        </div>

                        <div class="table-responsive">
                            <table class="table table-borderless align-middle mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="ps-4 text-uppercase small text-muted fw-bold py-3">Order ID</th>
                                        <th class="text-uppercase small text-muted fw-bold py-3">Date</th>
                                        <th class="text-uppercase small text-muted fw-bold py-3">Status</th>
                                        <th class="text-end pe-4 text-uppercase small text-muted fw-bold py-3">Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="orders.length === 0 && !loading">
                                        <td colspan="4" class="text-center py-5 text-muted">
                                            <i class="bi bi-mailbox fs-2 d-block mb-2"></i>
                                            You haven't placed any orders yet.
                                        </td>
                                    </tr>
                                    <tr v-for="order in orders.slice(0, 5)" :key="order.id" class="border-bottom-0">
                                        <td class="ps-4 py-3 fw-bold text-primary">#{{ order.invoice_number ||
                                            'COM-' + order.id }}</td>
                                        <td class="py-3 text-muted">{{ formatDate(order.created_at) }}</td>
                                        <td class="py-3">
                                            <span :class="getStatusClass(order.status)"
                                                class="badge rounded-pill px-3 py-1 text-uppercase border-0">
                                                {{ order.status }}
                                            </span>
                                        </td>
                                        <td class="py-3 text-end pe-4 fw-bold text-dark">৳{{ order.total_amount }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="p-4 text-center bg-light-subtle border-top">
                            <router-link to="/orders" class="text-primary text-decoration-none fw-bold small">
                                View All Orders <i class="bi bi-arrow-right ms-1"></i>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // ফিক্সড: onMounted এখানে ইমপোর্ট করা হয়েছে
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import axiosClient from '../api/axios';

const authStore = useAuthStore();
const cartStore = useCartStore();

const orders = ref([]);
const loading = ref(true);

// এপিআই থেকে কাস্টমারের রিয়েল অর্ডার ডেটা তুলে আনা
const fetchDashboardData = async () => {
    try {
        const response = await axiosClient.get('/my-orders');
        // লারাভেল paginate(10) ব্যবহার করায় ডেটা response.data.data এর ভেতরে থাকে
        orders.value = response.data.data || response.data;
    } catch (error) {
        console.error("Failed to load dashboard orders:", error);
    } finally {
        loading.value = false;
    }
};

// কম্পিউটেড প্রোপার্টি: পেন্ডিং অর্ডার কাউন্ট করা
const pendingOrdersCount = computed(() => {
    return orders.value.filter(order => order.status.toLowerCase() === 'pending').length;
});

// ডেট ফরম্যাটার হিলপার ফাংশন
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

// স্ট্যাটাস ব্যাজ ডাইনামিক সিএসএস ক্লাস
const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s === 'delivered') return 'bg-success-subtle text-success';
    if (s === 'pending') return 'bg-warning-subtle text-warning';
    if (s === 'processing') return 'bg-info-subtle text-info';
    return 'bg-danger-subtle text-danger';
};

onMounted(() => {
    if (authStore.isAuthenticated) {
        cartStore.fetchCart(); // ডাটাবেজ কার্ট লোড
        fetchDashboardData();  // ড্যাশবোর্ড অর্ডার হিস্টোরি লোড
    }
});
</script>

<style scoped>
.dashboard-page {
    font-family: 'Inter', sans-serif;
}

.btn-white {
    background: #fff;
    color: #333;
}

.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
}

.table tbody tr {
    border-bottom: 1px solid #f8fafc;
}

.table tbody tr:last-child {
    border-bottom: none;
}
</style>