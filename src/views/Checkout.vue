<template>
    <div class="checkout-page bg-light min-vh-100 py-4 py-md-5">
        <div class="container">
            <div class="d-flex align-items-center gap-3 mb-4">
                <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style="width: 45px; height: 45px;">
                    <i class="bi bi-shield-lock-fill fs-5"></i>
                </div>
                <div>
                    <h2 class="fw-bold text-dark mb-0 fs-3fs-md-2">Secure Checkout</h2>
                    <p class="text-muted small mb-0 d-none d-sm-block">Review your items and enter shipping details to
                        complete your order.</p>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-lg-7">
                    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                        <h5 class="fw-bold mb-4 text-dark d-flex align-items-center">
                            <i class="bi bi-geo-alt-fill me-2 text-primary"></i> Shipping Information
                        </h5>

                        <form @submit.prevent="handlePlaceOrder">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold text-secondary">Full Name</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-light-subtle text-muted"><i
                                                class="bi bi-person"></i></span>
                                        <input type="text" v-model="form.name"
                                            class="form-control rounded-end-3 py-2 shadow-none border-light-subtle"
                                            placeholder="Pial Mahmud" required>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label small fw-semibold text-secondary">Phone Number</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-light-subtle text-muted"><i
                                                class="bi bi-telephone"></i></span>
                                        <input type="tel" v-model="form.phone"
                                            class="form-control rounded-end-3 py-2 shadow-none border-light-subtle"
                                            placeholder="017XXXXXXXX" required>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <label class="form-label small fw-semibold text-secondary">Full Delivery
                                        Address</label>
                                    <textarea v-model="form.address"
                                        class="form-control rounded-3 py-2 shadow-none border-light-subtle" rows="4"
                                        placeholder="Village/Holding#, Road, Area, City, Postal Code"
                                        required></textarea>
                                    <div class="form-text text-muted small">Please provide detailed address for accurate
                                        and faster delivery.</div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
                        <h5 class="fw-bold mb-4 text-dark d-flex align-items-center">
                            <i class="bi bi-credit-card-fill me-2 text-primary"></i> Payment Method
                        </h5>
                        <div class="payment-options">
                            <div class="form-check border rounded-4 p-3 mb-3 custom-radio-box"
                                :class="{ 'active-border bg-primary-subtle bg-opacity-10': form.payment_method === 'COD' }"
                                @click="form.payment_method = 'COD'">
                                <div class="d-flex align-items-center w-100">
                                    <input class="form-check-input ms-1 me-3 shadow-none" type="radio"
                                        v-model="form.payment_method" value="COD" id="cod" name="payment_method">
                                    <label
                                        class="form-check-label fw-bold d-flex align-items-center gap-2 text-dark fs-6"
                                        for="cod">
                                        <i class="bi bi-cash-stack text-success fs-4"></i> Cash on Delivery (COD)
                                    </label>
                                </div>
                            </div>

                            <div class="form-check border rounded-4 p-3 opacity-60 bg-light cursor-not-allowed">
                                <div class="d-flex align-items-center w-100">
                                    <input class="form-check-input ms-1 me-3" type="radio" id="online"
                                        name="payment_method" disabled>
                                    <label
                                        class="form-check-label fw-bold d-flex align-items-center gap-2 text-muted fs-6"
                                        for="online">
                                        <i class="bi bi-bank text-primary fs-4"></i> Online Payment / bKash (Coming
                                        Soon)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-5">
                    <div class="card border-0 shadow-sm rounded-4 p-4 sticky-sidebar bg-white">
                        <h5 class="fw-bold mb-4 text-dark d-flex align-items-center justify-content-between">
                            <span>Order Review</span>
                            <span class="badge bg-secondary rounded-pill fs-6 fw-normal px-2.5 py-1">{{
                                cartStore.items.length }} Items</span>
                        </h5>

                        <div class="checkout-items mb-4 overflow-auto pe-1" style="max-height: 280px;">
                            <div v-for="item in cartStore.items" :key="item.id"
                                class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-light">
                                <img :src="item.product?.image ? `http://127.0.0.1:8000/storage/${item.product.image}` : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'"
                                    class="rounded-3 border border-light object-fit-cover flex-shrink-0"
                                    style="width: 60px; height: 60px;">
                                <div class="flex-grow-1 min-w-0">
                                    <h6 class="small fw-bold mb-0 text-dark text-truncate">{{ item.product?.name ||
                                        'Loading Product...' }}</h6>
                                    <span class="x-small text-muted d-block mt-0.5">Unit Price: ৳{{ item.product?.price
                                    }}</span>
                                    <span
                                        class="badge bg-light text-dark border rounded-pill x-small px-2 py-0.5 mt-1">Qty:
                                        {{ item.quantity }}</span>
                                </div>
                                <span class="small fw-bold text-dark flex-shrink-0">৳{{ ((item.product?.price || 0) *
                                    item.quantity) }}</span>
                            </div>
                        </div>

                        <div class="summary-details bg-light bg-opacity-50 rounded-4 p-3 mb-4">
                            <div class="d-flex justify-content-between mb-2.5 text-secondary small">
                                <span>Subtotal</span>
                                <span class="fw-semibold text-dark">৳{{ cartStore.totalPrice }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2.5 text-secondary small">
                                <span>Shipping Fee</span>
                                <span class="text-success fw-semibold">Free Shipping</span>
                            </div>
                            <hr class="my-3 opacity-25 border-secondary">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold text-dark">Total Payable</span>
                                <span class="fw-bold fs-4 text-primary">৳{{ cartStore.totalPrice }}</span>
                            </div>
                        </div>

                        <button @click="handlePlaceOrder" :disabled="loading || cartStore.items.length === 0"
                            class="btn btn-primary w-100 py-3 rounded-3 fw-bold border-0 shadow-sm transition-all d-flex align-items-center justify-content-center gap-2 uppercase tracking-wide fs-6">
                            <span v-if="loading" class="spinner-border spinner-border-sm" role="status"
                                aria-hidden="true"></span>
                            <span v-else class="d-flex align-items-center gap-2">
                                Place Order Now <i class="bi bi-arrow-right-circle-fill fs-5"></i>
                            </span>
                        </button>

                        <div
                            class="text-center mt-3 d-flex align-items-center justify-content-center gap-1.5 text-muted x-small">
                            <i class="bi bi-shield-check text-success fs-5"></i>
                            <span>SSL Encrypted Transaction Security Guaranteed.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import axiosClient from '../api/axios';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);

// আপনার CheckoutController ভ্যালিডেশন অনুযায়ী হুবহু ৪টি প্যারামিটার বাইন্ডিং ফিল্ড
const form = ref({
    name: authStore.user?.name || '',
    phone: '',
    address: '',
    payment_method: 'COD' // ডিফল্ট ক্যাশ অন ডেলিভারি
});

// ডাইনামিক অর্ডার প্লেসমেন্ট হ্যান্ডলার
const handlePlaceOrder = async () => {
    // ফর্ম ইনপুট ভ্যালিডেশন গার্ড
    if (!form.value.name || !form.value.phone || !form.value.address) {
        alert("Please complete all shipping information fields before submitting!");
        return;
    }

    if (cartStore.items.length === 0) {
        alert("Your cart is empty. Cannot process order!");
        return;
    }

    loading.value = true;
    try {
        // আপনার এপিআই ডাইরেক্ট হিট করবে CheckoutController-এর placeOrder মেথডে
        const response = await axiosClient.post('/checkout', form.value);

        if (response.status === 201) {
            // ১. ব্যাকএন্ডের ট্রানজেকশন থেকে রিটার্ন করা ডেটা রিসিভ করা
            const orderId = response.data.order_id; // আমরা CheckoutController-এ যা যুক্ত করেছি
            const invoiceNo = response.data.invoice_no;
            const totalAmount = response.data.total;

            // ২. কার্ট খালি হওয়ার ঠিক আগ মুহূর্তে কার্টের আইটেমগুলোর একটা কপি বা স্ন্যাপশট নেওয়া
            const currentCartItems = [...cartStore.items];

            // ৩. পিনিয়া (Pinia) ফ্রন্টএন্ড কার্ট স্টেট ক্লিয়ার করা
            await cartStore.clearCart();

            // ৪. সবচেয়ে গুরুত্বপূর্ণ পার্ট: সব ডেটা রাউটার স্টেটের মাধ্যমে OrderSuccess পেজে পুশ করা
            router.push({
                name: 'OrderSuccess',
                state: {
                    orderId: orderId,
                    invoiceNo: invoiceNo,
                    totalAmount: totalAmount,

                    // আপনার চেকআউট ফর্মের লাইভ ভ্যালুগুলো পাঠানো হচ্ছে
                    name: form.value.name,
                    email: form.value.email || authStore.user?.email, // ফর্ম বা অথ স্টোর থেকে ইমেইল
                    phone: form.value.phone,
                    address: form.value.address,
                    payment_method: form.value.payment_method,
                    payment_status: 'unpaid', // লারাভেল কন্ট্রোলারের ডিফল্ট ভ্যালু অনুযায়ী

                    // কার্ট আইটেমগুলোকে OrderSuccess টেবিলের ফরম্যাটে ম্যাপ করা
                    orderItems: currentCartItems.map(item => ({
                        id: item.id,
                        product_name: item.product?.name || 'Product',
                        unit_price: item.product?.price || 0,
                        quantity: item.quantity,
                        total_price: (item.product?.price || 0) * item.quantity,
                        status: 'Pending' // ডিফল্ট আইটেম স্ট্যাটাস
                    }))
                }
            });
        }
    } catch (error) {
        console.error("Order process execution failed:", error.response?.data);
        // কন্ট্রোলারের রিলিজ করা এরর মেসেজ অ্যালার্ট বক্সে শো করা
        alert(error.response?.data?.message || "Order placement failed. Please verify fields or stock!");
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    cartStore.fetchCart();
    // যদি রিলোডে ডাটা হারায়, তবে সেফার সাইড হিসেবে অথ থেকে নাম অ্যাসাইন করা
    if (!form.value.name && authStore.user?.name) {
        form.value.name = authStore.user.name;
    }
});
</script>

<style scoped>
.checkout-page {
    font-family: 'Inter', sans-serif;
}

/* আধুনিক ইনপুট ফিল্ড ফোকাস স্টাইল */
.form-control:focus,
.input-group-text:focus {
    border-color: #0d6efd !important;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.08) !important;
}

.x-small {
    font-size: 0.75rem;
}

.opacity-60 {
    opacity: 0.6;
}

.cursor-not-allowed {
    cursor: not-allowed;
}

/* কাস্টম পেমেন্ট রেডিও বক্স ইন্টারঅ্যাকশন */
.custom-radio-box {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.custom-radio-box:hover {
    border-color: #0d6efd !important;
    background-color: #f8fafc;
}

.active-border {
    border-color: #0d6efd !important;
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.05) !important;
}

.transition-all {
    transition: all 0.3s ease;
}

/* প্রিমিয়াম ব্ল্যাক/ডার্ক বাটন থিম */
.btn-primary {
    background-color: #0f172a !important;
    color: #ffffff;
    letter-spacing: 0.5px;
}

.btn-primary:hover:not(:disabled) {
    background-color: #1e293b !important;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15) !important;
}

/* কাস্টম স্ক্রলবার কনফিগারেশন */
.checkout-items::-webkit-scrollbar {
    width: 5px;
}

.checkout-items::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.checkout-items::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.checkout-items::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* ডেস্কটপের জন্য স্টিকি সাইডবার পজিশন রেসপনসিভনেস */
@media (min-width: 992px) {
    .sticky-sidebar {
        position: sticky;
        top: 100px !important;
        z-index: 10 !important;
    }
}

.card {
    border: 1px solid #f1f5f9 !important;
}
</style>