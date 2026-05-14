<template>
    <div class="admin-dashboard-container text-start">

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
                <h4 class="fw-bold text-dark mb-1">Commercia Pro Performance Hub</h4>
                <p class="text-muted small mb-0">Real-time enterprise metrics and sales pipeline oversight.</p>
            </div>
            <div>
                <button @click="refreshMetrics" :disabled="loading"
                    class="btn btn-white btn-sm border shadow-sm px-3 py-2 fw-semibold">
                    <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': loading }"></i> Sync Data
                </button>
            </div>
        </div>

        <div v-if="loading && recentOrders.length === 0" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading Stream...</span>
            </div>
            <p class="text-muted mt-2 small">Syncing with Commercia Pro Live API...</p>
        </div>

        <div v-else>
            <div class="row g-3 mb-4">
                <div class="col-6 col-lg-3">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-muted x-small text-uppercase fw-bold tracking-wider">Total Earnings</span>
                            <div class="bg-success bg-opacity-10 text-success rounded-3 p-2">
                                <i class="bi bi-currency-dollar fs-5"></i>
                            </div>
                        </div>
                        <h3 class="fw-bold text-dark mb-1">৳{{ numberFormat(metrics.totalSales) }}</h3>
                        <span class="x-small text-success fw-semibold"><i class="bi bi-graph-up-arrow me-1"></i>Live
                            Stream Active</span>
                    </div>
                </div>

                <div class="col-6 col-lg-3">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-muted x-small text-uppercase fw-bold tracking-wider">Total
                                Pipelines</span>
                            <div class="bg-primary bg-opacity-10 text-primary rounded-3 p-2">
                                <i class="bi bi-bag-check-fill fs-5"></i>
                            </div>
                        </div>
                        <h3 class="fw-bold text-dark mb-1">{{ metrics.totalOrders }}</h3>
                        <span class="x-small text-muted">Active conversions in database</span>
                    </div>
                </div>

                <div class="col-6 col-lg-3">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-muted x-small text-uppercase fw-bold tracking-wider">Pending Orders</span>
                            <div class="bg-warning bg-opacity-10 text-warning rounded-3 p-2">
                                <i class="bi bi-hourglass-split fs-5"></i>
                            </div>
                        </div>
                        <h3 class="fw-bold text-dark mb-1">{{ metrics.pendingOrders }}</h3>
                        <span class="x-small text-warning fw-semibold"><i
                                class="bi bi-exclamation-triangle-fill me-1"></i>Requires fulfillment</span>
                    </div>
                </div>

                <div class="col-6 col-lg-3">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-muted x-small text-uppercase fw-bold tracking-wider">Inventory SKUs</span>
                            <div class="bg-info bg-opacity-10 text-info rounded-3 p-2">
                                <i class="bi bi-boxes fs-5"></i>
                            </div>
                        </div>
                        <h3 class="fw-bold text-dark mb-1">{{ metrics.totalProducts }}</h3>
                        <span class="x-small text-muted">Live items on storefront</span>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="fw-bold mb-0 text-dark">Revenue Analytics</h5>
                            <span class="badge bg-light text-dark border">Data Node Synced</span>
                        </div>
                        <div class="chart-placeholder d-flex align-items-center justify-content-center bg-light rounded-3 text-muted"
                            style="height: 280px; border: 2px dashed #e3e6f0;">
                            <div class="text-center">
                                <i class="bi bi-bar-chart-line-fill display-4 text-muted opacity-50 mb-2"></i>
                                <p class="small mb-0 fw-semibold">Sales Trend Data Stream Visualization</p>
                                <span class="x-small text-muted">Chart JS framework ready container</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                        <h5 class="fw-bold mb-3 text-dark">Security & Role Log</h5>
                        <div class="timeline small flex-grow-1">
                            <div class="timeline-item d-flex gap-3 pb-3 border-bottom border-light mb-3">
                                <div class="text-primary"><i class="bi bi-circle-fill"></i></div>
                                <div>
                                    <p class="mb-0 fw-bold text-dark">System Gateways Online</p>
                                    <span class="x-small text-muted">Authorized workspace user: {{ authStore.user?.name
                                        }}</span>
                                </div>
                            </div>
                            <div class="timeline-item d-flex gap-3 pb-3 border-bottom border-light mb-3">
                                <div class="text-success"><i class="bi bi-circle-fill"></i></div>
                                <div>
                                    <p class="mb-0 fw-bold text-dark">REST API Pipeline Operational</p>
                                    <span class="x-small text-muted">All CRUD scopes verified with core backend</span>
                                </div>
                            </div>
                            <div class="timeline-item d-flex gap-3">
                                <div class="text-warning"><i class="bi bi-circle-fill"></i></div>
                                <div>
                                    <p class="mb-0 fw-bold text-dark">Destructive Action Lockdown</p>
                                    <span class="x-small text-muted">Managers restricted from target DELETE
                                        routes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0 text-dark">Recent Incoming Orders</h5>
                    <router-link to="/admin/orders" class="btn btn-light btn-sm fw-bold border text-primary small px-3">
                        View Pipeline <i class="bi bi-arrow-right ms-1"></i>
                    </router-link>
                </div>

                <div class="table-responsive">
                    <table class="table align-middle table-hover border-0 mb-0">
                        <thead class="bg-light text-secondary small text-uppercase border-bottom">
                            <tr>
                                <th class="border-0 px-3">Invoice</th>
                                <th class="border-0">Customer</th>
                                <th class="border-0">Payment</th>
                                <th class="border-0">Total</th>
                                <th class="border-0 text-end px-3">Status</th>
                            </tr>
                        </thead>
                        <tbody class="small border-0">
                            <tr v-for="order in recentOrders" :key="order.id" class="border-bottom border-light">
                                <td class="fw-bold px-3">#{{ order.invoice_number }}</td>
                                <td>{{ order.name }}</td>
                                <td>
                                    <span class="badge bg-light text-dark border px-2 py-1 rounded">
                                        {{ order.payment_method }}
                                    </span>
                                </td>
                                <td class="fw-semibold">৳{{ numberFormat(order.total_amount) }}</td>
                                <td class="text-end px-3">
                                    <span
                                        class="badge bg-warning bg-opacity-10 text-warning px-2.5 py-1 rounded-pill fw-bold text-uppercase x-small">
                                        {{ order.status }}
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="recentOrders.length === 0">
                                <td colspan="5" class="text-center py-4 text-muted">No recent pipelines detected on live
                                    records.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import axiosClient from '../../api/axios';

const authStore = useAuthStore();
const loading = ref(true);

// লাইভ কমার্স ম্যাট্রিক্স অবজেক্ট স্টেট
const metrics = ref({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0
});

// লাইভ রিসেন্ট অর্ডার কালেকশন এরে
const recentOrders = ref([]);

// 🚀 লাইভ এপিআই কানেক্টিভিটি মেথড
const fetchDashboardStats = async () => {
    loading.value = true;
    try {
        const response = await axiosClient.get('/admin/dashboard-stats');

        // লারাভেল ব্যাকএন্ড জেসন কি-ম্যাপিং এর সাথে সিঙ্ক করা
        metrics.value = {
            totalSales: response.data.metrics?.total_sales || 0,
            totalOrders: response.data.metrics?.total_orders || 0,
            pendingOrders: response.data.metrics?.pending_orders || 0,
            totalProducts: response.data.metrics?.total_products || 0
        };

        recentOrders.value = response.data.recent_orders || [];
    } catch (error) {
        console.error("Commercia Pro Data Hub Connection Failure:", error);
    } finally {
        loading.value = false;
    }
};

const refreshMetrics = () => {
    fetchDashboardStats();
};

// লোকাল কারেন্সি ফরম্যাটার (৳১,৫০,০০০.০০ সাব-কন্টিনেন্টাল টাইপ)
const numberFormat = (value) => {
    return Number(value).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

onMounted(() => {
    fetchDashboardStats();
});
</script>

<style scoped>
.tracking-wider {
    letter-spacing: 0.05em;
}

.x-small {
    font-size: 11px;
}

.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .08) !important;
}

.spin {
    animation: spinner-animation 1s linear infinite;
}

@keyframes spinner-animation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>