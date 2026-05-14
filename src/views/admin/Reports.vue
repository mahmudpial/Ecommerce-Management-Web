<template>
    <div class="analytics-reports-container text-start">

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
                <h4 class="fw-bold text-dark mb-1">Commercia Pro Analytics Engine</h4>
                <p class="text-muted small mb-0">Monitor financial performance, sales velocities, and warehouse stock
                    logistics.</p>
            </div>
            <div>
                <button @click="fetchReportData"
                    class="btn btn-white btn-sm border shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-secondary">
                    <i class="bi bi-arrow-clockwise" :class="{ 'spin': loading }"></i> Sync Analytics
                </button>
            </div>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-12 col-sm-6 col-lg-3">
                <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <span class="text-muted small fw-semibold text-uppercase tracking-wider">Gross
                                Revenue</span>
                            <h3 class="fw-bold text-dark mb-0 mt-1">৳{{ numberFormat(totalRevenue) }}</h3>
                        </div>
                        <div class="bg-success bg-opacity-10 rounded-3 p-2.5 text-success">
                            <i class="bi bi-currency-bangla fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
                <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <span class="text-muted small fw-semibold text-uppercase tracking-wider">Processed
                                Orders</span>
                            <h3 class="fw-bold text-dark mb-0 mt-1">{{ salesData.length }}</h3>
                        </div>
                        <div class="bg-primary bg-opacity-10 rounded-3 p-2.5 text-primary">
                            <i class="bi bi-cart-check-fill fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
                <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <span class="text-muted small fw-semibold text-uppercase tracking-wider">Total Stock
                                Units</span>
                            <h3 class="fw-bold text-dark mb-0 mt-1">{{ totalStockUnits }} Units</h3>
                        </div>
                        <div class="bg-info bg-opacity-10 rounded-3 p-2.5 text-info">
                            <i class="bi bi-boxes fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-lg-3">
                <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <span class="text-muted small fw-semibold text-uppercase tracking-wider">Critical
                                Alerts</span>
                            <h3 class="fw-bold text-danger mb-0 mt-1">{{ outOfStockCount }} SKUs</h3>
                        </div>
                        <div class="bg-danger bg-opacity-10 rounded-3 p-2.5 text-danger">
                            <i class="bi bi-exclamation-triangle-fill fs-4"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ul class="nav nav-tabs border-bottom mb-4">
            <li class="nav-item cursor-pointer">
                <button class="nav-link fw-bold px-4 py-2.5" :class="{ 'active text-primary': activeTab === 'sales' }"
                    @click="activeTab = 'sales'">
                    <i class="bi bi-graph-up-arrow me-2"></i>Sales Performance Report
                </button>
            </li>
            <li class="nav-item cursor-pointer">
                <button class="nav-link fw-bold px-4 py-2.5" :class="{ 'active text-primary': activeTab === 'stock' }"
                    @click="activeTab = 'stock'">
                    <i class="bi bi-pie-chart-fill me-2"></i>Warehouse Stock Ledger
                </button>
            </li>
        </ul>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Compiling Report Metrics...</span>
            </div>
            <p class="text-muted mt-2 small">Processing multi-node ledger streams...</p>
        </div>

        <div v-else class="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white overflow-hidden">

            <div v-if="activeTab === 'sales'" class="table-responsive-md w-100">
                <table class="table align-middle table-hover border-0 mb-0">
                    <thead class="bg-light text-secondary small text-uppercase border-bottom">
                        <tr>
                            <th class="border-0 px-3">Order Ref</th>
                            <th class="border-0">Customer Info</th>
                            <th class="border-0">Date / Timestamp</th>
                            <th class="border-0">Payment Method</th>
                            <th class="border-0 text-end px-3">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody class="small border-0">
                        <tr v-for="(sale, index) in salesData" :key="sale.id || index"
                            class="border-bottom border-light">
                            <td class="px-3 font-monospace fw-bold text-primary">#{{ sale.order_number || sale.id }}
                            </td>
                            <td>
                                <div class="fw-semibold text-dark">
                                    {{ sale.user?.name || sale.customer_name || `Walking Customer` }}
                                </div>
                                <div class="text-muted x-small">
                                    {{ sale.user?.email || `N/A` }}
                                </div>
                            </td>
                            <td class="text-secondary">{{ formatDate(sale.created_at) }}</td>
                            <td>
                                <span class="badge bg-light text-dark border px-2 py-1 text-uppercase x-small">
                                    {{ sale.payment_method || 'COD' }}
                                </span>
                            </td>
                            <td class="text-end fw-bold text-dark px-3">৳{{ numberFormat(sale.total_amount ||
                                sale.price) }}</td>
                        </tr>
                        <tr v-if="salesData.length === 0">
                            <td colspan="5" class="text-center py-5 text-muted">
                                <i class="bi bi-journal-x display-4 d-block mb-2 opacity-50"></i>
                                No historical sales operations captured within this cluster.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="activeTab === 'stock'" class="table-responsive-md w-100">
                <table class="table align-middle table-hover border-0 mb-0">
                    <thead class="bg-light text-secondary small text-uppercase border-bottom">
                        <tr>
                            <th class="border-0 px-3">Product / SKU Details</th>
                            <th class="border-0">Category Ref</th>
                            <th class="border-0">Unit Price</th>
                            <th class="border-0">Current Quantity</th>
                            <th class="border-0 text-end px-3">Logistics Status</th>
                        </tr>
                    </thead>
                    <tbody class="small border-0">
                        <tr v-for="(item, index) in stockData" :key="item.id || index"
                            class="border-bottom border-light">
                            <td class="px-3">
                                <div class="fw-semibold text-dark fs-6">{{ item.name }}</div>
                                <span class="text-muted x-small">System Catalog ID: #{{ item.id }}</span>
                            </td>
                            <td><span class="badge bg-light text-secondary border">ID: {{ item.category_id }}</span>
                            </td>
                            <td class="fw-semibold text-dark">৳{{ numberFormat(item.price) }}</td>
                            <td class="fw-bold" :class="item.stock <= 10 ? 'text-danger' : 'text-dark'">
                                {{ item.stock }} Units
                            </td>
                            <td class="text-end px-3">
                                <span class="badge px-2.5 py-1.5 rounded fw-bold text-uppercase x-small"
                                    :class="stockAlertClass(item.stock)">
                                    {{ Number(item.stock) > 10 ? `Healthy Stock` : (Number(item.stock) > 0 ? `Low
                                    Volume` : `Depleted SKU`) }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="stockData.length === 0">
                            <td colspan="5" class="text-center py-5 text-muted">
                                <i class="bi bi-building-exclamation display-4 d-block mb-2 opacity-50"></i>
                                Warehouse analytics channel empty. No SKU nodes matching database structure.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axiosClient from '../../api/axios';

const activeTab = ref('sales');
const loading = ref(true);

const salesData = ref([]);
const stockData = ref([]);

// 📊 ব্যাকএন্ড থেকে সরাসরি আসা রেভিনিউ ও অর্ডার কাউন্টারে সেট করার জন্য রিয়েক্টিভ স্টেট
const backendTotalSales = ref(0);
const backendTotalOrders = ref(0);

// 📈 ডাইনামিক কমপুটেড মেট্রিক্স জেনারেটরসমূহ (ব্যাকএন্ড ডেটা অনুযায়ী সুরক্ষিত)
const totalRevenue = computed(() => {
    // যদি ব্যাকএন্ড সরাসরি টোটাল সেলস পাঠায়, সেটা ব্যবহার করবে; অন্যথায় ফলব্যাক হিসাব করবে
    if (backendTotalSales.value > 0) return backendTotalSales.value;
    if (!Array.isArray(salesData.value)) return 0;
    return salesData.value.reduce((sum, record) => sum + Number(record.total_amount || record.price || 0), 0);
});

const totalOrdersCount = computed(() => {
    return backendTotalOrders.value > 0 ? backendTotalOrders.value : (Array.isArray(salesData.value) ? salesData.value.length : 0);
});

const totalStockUnits = computed(() => {
    if (!Array.isArray(stockData.value)) return 0;
    return stockData.value.reduce((sum, item) => sum + Number(item.stock || 0), 0);
});

const outOfStockCount = computed(() => {
    if (!Array.isArray(stockData.value)) return 0;
    return stockData.value.filter(item => Number(item.stock || 0) === 0).length;
});

// 🚀 ওয়ান-স্টপ এপিআই ডাটা পুলিং ইন্টিগ্রেশন (আপনার কন্ট্রোলার স্ট্রাকচার অনুযায়ী ম্যাপড)
const fetchReportData = async () => {
    loading.value = true;
    try {
        const [salesResponse, stockResponse] = await Promise.all([
            axiosClient.get('/admin/reports/sales'),
            axiosClient.get('/admin/reports/stock')
        ]);

        // 🎯 লারাভেলের রেসপন্স স্ট্রাকচার ম্যাপ করা ('orders' কী টার্গেট করা হয়েছে)
        const salesResult = salesResponse.data;
        if (salesResult && typeof salesResult === 'object') {
            salesData.value = salesResult.orders || salesResult.data?.orders || [];
            backendTotalSales.value = Number(salesResult.total_sales || 0);
            backendTotalOrders.value = Number(salesResult.total_orders || 0);
        } else {
            salesData.value = [];
        }

        // স্টক রেসপন্স ম্যাপিং (স্ট্যান্ডার্ড ডাটা সেফগার্ড)
        const rawStock = stockResponse.data?.data || stockResponse.data;
        stockData.value = Array.isArray(rawStock) ? rawStock : (rawStock?.data || []);

    } catch (error) {
        console.error("Analytics Pipeline Synchronization Error:", error);
    } finally {
        loading.value = false;
    }
};

// কারেন্সি ও ডেইট ইউটিলিটি ফরম্যাটার্স
const numberFormat = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateString) => {
    if (!dateString) return 'Just Now';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// লজিস্টিকস অ্যালার্ট কালার জেনারেটর
const stockAlertClass = (stock) => {
    const count = Number(stock);
    if (count <= 0) return 'bg-danger bg-opacity-10 text-danger';
    if (count <= 10) return 'bg-warning bg-opacity-10 text-warning';
    return 'bg-success bg-opacity-10 text-success';
};

onMounted(() => {
    fetchReportData();
});
</script>

<style scoped>
.x-small {
    font-size: 11px;
}

.cursor-pointer {
    cursor: pointer;
}

.nav-tabs .nav-link {
    border: none;
    color: #6c757d;
}

.nav-tabs .nav-link.active {
    border-bottom: 3px solid #0d6efd;
    background: transparent;
}

.spin {
    animation: rotation 1s infinite linear;
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>