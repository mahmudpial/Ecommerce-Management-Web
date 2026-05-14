<template>
    <div class="orders-page bg-light-subtle min-vh-100 py-5">
        <div class="container">
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><router-link to="/dashboard"
                            class="text-decoration-none">Dashboard</router-link></li>
                    <li class="breadcrumb-item active">My Orders</li>
                </ol>
            </nav>

            <div class="d-flex align-items-center justify-content-between mb-4">
                <h2 class="fw-bold text-dark mb-0">
                    <i class="bi bi-bag-check text-primary me-2"></i>Order History
                </h2>
                <span class="badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill fw-bold">
                    Total: {{ orders.length }} Orders
                </span>
            </div>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Fetching your orders...</p>
            </div>

            <div v-else-if="orders.length > 0" class="row g-4">
                <div v-for="order in orders" :key="order.id" class="col-12">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden order-card">
                        <div class="card-body p-0">
                            <div class="row g-0">
                                <div class="col-md-3 p-4 border-end bg-white">
                                    <span class="text-muted small fw-bold text-uppercase d-block mb-1">Order
                                        Number</span>
                                    <h5 class="fw-bold text-primary mb-3">#COM-{{ order.order_number }}</h5>
                                    <span class="text-muted small fw-bold text-uppercase d-block mb-1">Placed On</span>
                                    <p class="mb-0 fw-medium text-dark">{{ formatDate(order.created_at) }}</p>
                                </div>

                                <div class="col-md-5 p-4 bg-white d-flex align-items-center">
                                    <div class="w-100">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="small fw-bold">Order Status:</span>
                                            <span :class="getStatusClass(order.status)" class="badge rounded-pill px-3">
                                                {{ order.status }}
                                            </span>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar" role="progressbar"
                                                :style="{ width: getProgressWidth(order.status) }"
                                                :class="getProgressClass(order.status)"></div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="col-md-4 p-4 bg-light-subtle d-flex align-items-center justify-content-between">
                                    <div class="text-start">
                                        <span class="text-muted small fw-bold text-uppercase d-block mb-1">Total
                                            Amount</span>
                                        <h4 class="fw-bold text-dark mb-0">৳{{ order.total_amount }}</h4>
                                    </div>
                                    <div class="text-end">
                                        <button @click="viewDetails(order.id)"
                                            class="btn btn-dark rounded-3 px-4 py-2 fw-bold shadow-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-5 bg-white rounded-5 shadow-sm border mt-4">
                <i class="bi bi-cart-x display-1 text-muted opacity-25"></i>
                <h4 class="mt-3 fw-bold">No orders found!</h4>
                <p class="text-muted">You haven't placed any orders yet.</p>
                <router-link to="/products" class="btn btn-primary rounded-pill px-5 py-2 mt-2 fw-bold">Start
                    Shopping</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosClient from '../api/axios';

const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
    try {
        const response = await axiosClient.get('/user/orders');
        orders.value = response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        // মক ডাটা (টেস্টিং এর জন্য যদি এপিআই রেডি না থাকে)
        orders.value = [
            { id: 1, order_number: '98421', status: 'Delivered', total_amount: '1,450', created_at: '2026-05-14' },
            { id: 2, order_number: '98410', status: 'Processing', total_amount: '3,200', created_at: '2026-05-10' },
            { id: 3, order_number: '98405', status: 'Pending', total_amount: '950', created_at: '2026-05-08' },
        ];
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
};

const getStatusClass = (status) => {
    const classes = {
        'Pending': 'bg-warning-subtle text-warning border border-warning',
        'Processing': 'bg-info-subtle text-info border border-info',
        'Delivered': 'bg-success-subtle text-success border border-success',
        'Cancelled': 'bg-danger-subtle text-danger border border-danger'
    };
    return classes[status] || 'bg-secondary text-white';
};

const getProgressWidth = (status) => {
    if (status === 'Pending') return '25%';
    if (status === 'Processing') return '60%';
    if (status === 'Delivered') return '100%';
    return '0%';
};

const getProgressClass = (status) => {
    if (status === 'Delivered') return 'bg-success';
    if (status === 'Processing') return 'bg-info';
    return 'bg-warning';
};

onMounted(fetchOrders);
</script>

<style scoped>
.orders-page {
    font-family: 'Inter', sans-serif;
}

.order-card {
    transition: all 0.3s ease;
}

.order-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
}

.progress {
    background-color: #f1f5f9;
}
</style>