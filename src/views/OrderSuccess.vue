<template>
    <div class="order-success-page bg-light-subtle min-vh-100 d-flex align-items-center py-4 py-md-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-10 col-lg-8 text-center">

                    <div class="success-icon-box mb-4 mx-auto bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center animate-scale"
                        style="width: 85px; height: 85px;">
                        <i class="bi bi-check-circle-fill text-success" style="font-size: 2.8rem;"></i>
                    </div>

                    <h1 class="fw-bold text-dark mb-2 fs-2 fs-md-1">Order Placed Successfully!</h1>
                    <p class="text-muted mb-4 px-3">Thank you for shopping with <span
                            class="fw-semibold text-primary">Commercia Pro</span>. Your order has been registered into
                        our system.</p>

                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white text-start">
                        <div
                            class="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                            <span class="small fw-bold text-uppercase tracking-wider">Order Invoice Statement</span>
                            <span class="badge bg-primary px-2.5 py-1 rounded-pill">#{{ invoiceNo || 'Loading...'
                                }}</span>
                        </div>

                        <div class="card-body p-4">
                            <div class="row g-3 mb-4 border-bottom pb-4">
                                <div class="col-md-6">
                                    <label class="x-small text-uppercase fw-bold text-muted d-block mb-2">Billing
                                        Address & Customer Info</label>
                                    <div
                                        class="bg-light bg-opacity-50 p-3 rounded-3 h-100 gap-2 d-flex flex-column justify-content-center">
                                        <h6 class="fw-bold text-dark mb-1.5">
                                            <i class="bi bi-person-fill text-secondary me-1"></i> {{ name ||
                                                authStore.user?.name }}
                                        </h6>
                                        <p class="text-secondary small mb-1">
                                            <i class="bi bi-envelope-fill text-secondary me-1"></i> {{ email ||
                                                authStore.user?.email }}
                                        </p>
                                        <p class="text-secondary small mb-1">
                                            <i class="bi bi-telephone-fill text-secondary me-1"></i> {{ phone || 'N/A'
                                            }}
                                        </p>
                                        <p class="text-secondary small mb-0 text-capitalize">
                                            <i class="bi bi-geo-alt-fill text-secondary me-1"></i> {{ address || 'N/A'
                                            }}
                                        </p>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label class="x-small text-uppercase fw-bold text-muted d-block mb-2">Payment &
                                        Fulfillment</label>
                                    <div
                                        class="bg-light bg-opacity-50 p-3 rounded-3 h-100 d-flex flex-column justify-content-center gap-3">

                                        <div class="d-flex justify-content-between align-items-center mb-2.5 small">
                                            <span class="text-muted">Payment Method:</span>
                                            <span class="fw-bold text-dark">
                                                <i class="bi bi-cash-stack text-success me-1"></i>
                                                {{ paymentMethod === 'COD' ? 'Cash On Delivery' : paymentMethod }}
                                            </span>
                                        </div>

                                        <div class="d-flex justify-content-between align-items-center mb-2.5 small">
                                            <span class="text-muted">Payment Status:</span>
                                            <span :class="{
                                                'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25': paymentStatus === 'unpaid',
                                                'bg-success bg-opacity-10 text-success border border-success border-opacity-25': paymentStatus === 'paid'
                                            }" class="badge px-2.5 py-1 rounded-pill small fw-bold text-uppercase">
                                                {{ paymentStatus || 'unpaid' }}
                                            </span>
                                        </div>

                                        <div class="d-flex justify-content-between align-items-center small">
                                            <span class="text-muted">Delivery Status:</span>
                                            <span
                                                class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2.5 py-1 rounded-pill small fw-bold text-uppercase">
                                                Pending
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <label class="x-small text-uppercase fw-bold text-muted d-block mb-2">Product
                                Details</label>
                            <div class="table-responsive border rounded-3 mb-4">
                                <table class="table table-borderless align-middle mb-0 small">
                                    <thead class="bg-light border-bottom text-secondary">
                                        <tr>
                                            <th class="ps-3 py-2.5">Item Description</th>
                                            <th class="text-center py-2.5">Qty</th>
                                            <th class="text-end py-2.5">Total</th>
                                            <th class="text-end pe-3 py-2.5">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="orderItems.length === 0">
                                            <td colspan="4" class="text-center py-4 text-muted">Loading ordered items...
                                            </td>
                                        </tr>
                                        <tr v-for="item in orderItems" :key="item.id"
                                            class="border-bottom border-light">
                                            <td class="ps-3 py-3">
                                                <div class="fw-bold text-dark text-truncate" style="max-width: 250px;">
                                                    {{ item.product_name }}
                                                </div>
                                                <span class="x-small text-muted">Unit Price: ৳{{ item.unit_price
                                                    }}</span>
                                            </td>
                                            <td class="text-center py-3 fw-semibold text-secondary">{{ item.quantity }}
                                            </td>
                                            <td class="text-end py-3 fw-bold text-dark">৳{{ item.total_price }}</td>
                                            <td class="text-end pe-3 py-3">
                                                <span
                                                    class="badge bg-info bg-opacity-10 text-info px-2.5 py-1 rounded-pill small text-uppercase fw-semibold">
                                                    {{ item.status || 'Pending' }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="bg-light bg-opacity-50 rounded-3 p-3 ms-auto" style="max-width: 320px;">
                                <div class="d-flex justify-content-between mb-2 small text-secondary">
                                    <span>Shipping Charge</span>
                                    <span class="text-success fw-bold">Free</span>
                                </div>
                                <hr class="my-2 opacity-25">
                                <div class="d-flex justify-content-between align-items-center text-dark">
                                    <span class="fw-bold">Total Amount:</span>
                                    <span class="fw-bold fs-5 text-primary">৳{{ totalAmount }}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="d-flex flex-column flex-sm-row justify-content-center gap-3 px-2 mt-4">
                        <router-link to="/dashboard"
                            class="btn btn-outline-secondary py-2.5 px-4 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 order-2 order-sm-1 flex-grow-1 flex-sm-grow-0">
                            <i class="bi bi-speedometer2"></i> Back to Dashboard
                        </router-link>

                        <button @click="downloadInvoicePDF" :disabled="downloading || !orderId"
                            class="btn btn-dark py-2.5 px-4 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm order-1 order-sm-2 flex-grow-1 flex-sm-grow-0">
                            <span v-if="downloading" class="spinner-border spinner-border-sm" role="status"></span>
                            <span v-else class="d-flex align-items-center gap-2">
                                <i class="bi bi-cloud-arrow-down-fill fs-5"></i> Download Receipt PDF
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import axiosClient from '../api/axios';

const authStore = useAuthStore();
const orderId = ref(null);
const invoiceNo = ref('');
const totalAmount = ref(0);
const orderItems = ref([]);
const downloading = ref(false);

// নতুন যুক্ত করা রিঅ্যাক্টিভ স্টেটসমূহ (ইউজার ইনফো ও পেমেন্ট ডিটেইলস)
const name = ref('');
const email = ref('');
const phone = ref('');
const address = ref('');
const paymentMethod = ref('COD');
const paymentStatus = ref('unpaid');

onMounted(() => {
    // Checkout.vue থেকে রিডাইরেক্ট হয়ে আসা মেমোরি স্টেট রিড করা
    if (window.history.state) {
        orderId.value = window.history.state.orderId || null;
        invoiceNo.value = window.history.state.invoiceNo || '';
        totalAmount.value = window.history.state.totalAmount || 0;
        orderItems.value = window.history.state.orderItems || [];

        // চেকআউট পেজ থেকে পুশ করা নতুন স্টেট ভ্যালুগুলো সিঙ্ক করা হচ্ছে
        name.value = window.history.state.name || '';
        email.value = window.history.state.email || '';
        phone.value = window.history.state.phone || '';
        address.value = window.history.state.address || '';
        paymentMethod.value = window.history.state.payment_method || 'COD';
        paymentStatus.value = window.history.state.payment_status || 'unpaid';
    }
});

// ব্যাকএন্ড এপিআই হিট করে ব্লেড জেনারেটেড পিডিএফ রিসিট ডাউনলোড করা
const downloadInvoicePDF = async () => {
    if (!orderId.value) {
        alert("Invoice source context missing. Download aborted!");
        return;
    }

    downloading.value = true;
    try {
        // আপনার api.php রুট অনুযায়ী সঠিক পাথ: /order/invoice/{id}
        const response = await axiosClient.get(`/order/invoice/${orderId.value}`, {
            responseType: 'blob' // বাইনারি ডাটা স্ট্রিম হ্যান্ডেল করার জন্য এটি মাস্ট
        });

        // জাভাস্ক্রিপ্ট ব্লব মেথডে ফাইল মেমরিতে জেনারেট করে ব্রাউজারে পুশ করা
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice-${invoiceNo.value || 'order'}.pdf`);
        document.body.appendChild(link);
        link.click();

        // মেমোরি লিক আটকাতে ক্লিনআপ করা
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Invoice PDF binary pull failed:", error);
        alert("Failed to compile invoice PDF from backend server. Please verify your dompdf packages!");
    } finally {
        downloading.value = false;
    }
};
</script>

<style scoped>
.order-success-page {
    font-family: 'Inter', sans-serif;
}

.x-small {
    font-size: 0.72rem;
}

/* সাকসেস বাবল অ্যানিমেশন */
.animate-scale {
    animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

/* প্রিমিয়াম বাটন থিম */
.btn-dark {
    background-color: #0f172a !important;
}

.btn-dark:hover:not(:disabled) {
    background-color: #1e293b !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12) !important;
}

@media (min-width: 576px) {
    .d-flex.flex-sm-row {
        gap: 16px !important;
        /* বাটন দুটোর মাঝে নিশ্চিত ১৬ পিক্সেল স্পেস রাখবে */
    }
}

.table th {
    font-weight: 600;
    letter-spacing: 0.3px;
}

@keyframes bounceIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }

    50% {
        transform: scale(1.05);
        opacity: 0.8;
    }

    70% {
        transform: scale(0.9);
        opacity: 0.9;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>