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
                        <h4 class="fw-bold mb-0">12</h4>
                        <span class="text-muted small fw-bold text-uppercase">Total Orders</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 text-center">
                        <div class="bg-warning-subtle text-warning rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                            style="width: 60px; height: 60px;">
                            <i class="bi bi-clock-history fs-3"></i>
                        </div>
                        <h4 class="fw-bold mb-0">02</h4>
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
                            <img :src="`https://ui-avatars.com/api/?name=${authStore.user?.name}&background=0d6efd&color=fff`"
                                class="rounded-circle border border-4 border-white shadow-sm" width="100">
                            <h5 class="fw-bold mt-3 mb-0">{{ authStore.user?.name }}</h5>
                            <span class="badge bg-dark rounded-pill px-3 mt-2">{{ authStore.role }}</span>
                        </div>
                        <hr class="opacity-25">
                        <div class="mb-3">
                            <label class="small text-muted fw-bold text-uppercase mb-1">Email Address</label>
                            <p class="mb-0 fw-bold text-dark">{{ authStore.user?.email }}</p>
                        </div>
                        <div class="mb-3">
                            <label class="small text-muted fw-bold text-uppercase mb-1">Member Since</label>
                            <p class="mb-0 fw-bold text-dark">{{ new
                                Date(authStore.user?.created_at).toLocaleDateString() }}</p>
                        </div>
                        <button class="btn btn-outline-primary w-100 rounded-3 mt-3 fw-bold">
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="card-header bg-white p-4 border-0">
                            <h5 class="fw-bold mb-0">Recent Orders</h5>
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
                                    <tr>
                                        <td class="ps-4 py-4 fw-bold">#COM-98421</td>
                                        <td class="py-4 text-muted">May 14, 2026</td>
                                        <td class="py-4">
                                            <span
                                                class="badge bg-success-subtle text-success border-0 px-3">Delivered</span>
                                        </td>
                                        <td class="py-4 text-end pe-4 fw-bold">৳1,450</td>
                                    </tr>
                                    <tr>
                                        <td class="ps-4 py-4 fw-bold">#COM-98410</td>
                                        <td class="py-4 text-muted">May 10, 2026</td>
                                        <td class="py-4">
                                            <span
                                                class="badge bg-warning-subtle text-warning border-0 px-3">Pending</span>
                                        </td>
                                        <td class="py-4 text-end pe-4 fw-bold">৳3,200</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="p-4 text-center bg-light-subtle">
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
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
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
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-3px);
}
</style>