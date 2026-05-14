<template>
    <div class="checkout-page bg-light-subtle min-vh-100 py-5">
        <div class="container">
            <div class="d-flex align-items-center gap-3 mb-4">
                <div class="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center"
                    style="width: 45px; height: 45px;">
                    <i class="bi bi-shield-lock-fill fs-5"></i>
                </div>
                <h2 class="fw-bold text-dark mb-0">Secure Checkout</h2>
            </div>

            <div class="row g-4">
                <div class="col-lg-7">
                    <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 class="fw-bold mb-4"><i class="bi bi-geo-alt me-2 text-primary"></i>Shipping Information
                        </h5>
                        <form @submit.prevent="placeOrder">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Full Name</label>
                                    <input type="text"
                                        class="form-control rounded-3 py-2 shadow-none border-light-subtle"
                                        placeholder="Pial Mahmud" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Phone Number</label>
                                    <input type="tel"
                                        class="form-control rounded-3 py-2 shadow-none border-light-subtle"
                                        placeholder="017XXXXXXXX" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold">Email Address</label>
                                    <input type="email"
                                        class="form-control rounded-3 py-2 shadow-none border-light-subtle"
                                        placeholder="pial@example.com" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-bold">Shipping Address</label>
                                    <textarea class="form-control rounded-3 py-2 shadow-none border-light-subtle"
                                        rows="3" placeholder="House #, Road #, Area, City" required></textarea>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 p-4">
                        <h5 class="fw-bold mb-4"><i class="bi bi-credit-card me-2 text-primary"></i>Payment Method</h5>
                        <div class="payment-options">
                            <div class="form-check border rounded-3 p-3 mb-3 custom-radio">
                                <input class="form-check-input ms-0 me-3" type="radio" name="payment" id="cod" checked>
                                <label class="form-check-label fw-bold d-flex align-items-center gap-2" for="cod">
                                    <i class="bi bi-cash-stack text-success fs-5"></i> Cash on Delivery (COD)
                                </label>
                            </div>
                            <div class="form-check border rounded-3 p-3 opacity-75">
                                <input class="form-check-input ms-0 me-3" type="radio" name="payment" id="online"
                                    disabled>
                                <label class="form-check-label fw-bold d-flex align-items-center gap-2" for="online">
                                    <i class="bi bi-bank text-primary fs-5"></i> Online Payment (Coming Soon)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-5">
                    <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top" style="top: 100px;">
                        <h5 class="fw-bold mb-4">Order Review</h5>

                        <div class="checkout-items mb-4 overflow-auto" style="max-height: 300px;">
                            <div v-for="item in cartStore.items" :key="item.id"
                                class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                                <img :src="item.image ? `http://127.0.0.1:8000/storage/${item.image}` : 'https://placehold.jp/50x50.png'"
                                    class="rounded-2 border" style="width: 55px; height: 55px; object-fit: contain;">
                                <div class="flex-grow-1">
                                    <h6 class="small fw-bold mb-0 text-truncate" style="max-width: 180px;">{{ item.name
                                    }}</h6>
                                    <span class="x-small text-muted">Qty: {{ item.quantity }}</span>
                                </div>
                                <span class="small fw-bold text-dark">৳{{ item.price * item.quantity }}</span>
                            </div>
                        </div>

                        <div class="summary-details">
                            <div class="d-flex justify-content-between mb-2 text-muted small">
                                <span>Subtotal</span>
                                <span>৳{{ cartStore.totalPrice }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2 text-muted small">
                                <span>Shipping Fee</span>
                                <span class="text-success">Free</span>
                            </div>
                            <hr class="my-3 opacity-25">
                            <div class="d-flex justify-content-between mb-4">
                                <span class="fw-bold">Total Payable</span>
                                <span class="fw-bold fs-4 text-primary">৳{{ cartStore.totalPrice }}</span>
                            </div>
                        </div>

                        <button @click="placeOrder"
                            class="btn btn-primary w-100 py-3 rounded-3 fw-bold border-0 shadow-sm transition-all">
                            Complete Order
                            <i class="bi bi-check-circle-fill ms-2"></i>
                        </button>

                        <p class="text-center x-small text-muted mt-3">
                            By clicking "Complete Order", you agree to our Terms & Conditions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const placeOrder = () => {
    // এখানে পরবর্তীতে আপনার API কল হবে অর্ডার সেভ করার জন্য
    alert("Order Placed Successfully!");
    cartStore.items = []; // অর্ডার হয়ে গেলে কার্ট ক্লিয়ার
    cartStore.saveToLocalStorage();
    router.push('/order-success'); // অর্ডার সফল হলে অর্ডার সুকসেস পেজে পাঠানো
};
</script>

<style scoped>
.checkout-page {
    font-family: 'Inter', sans-serif;
}

.form-control:focus {
    border-color: #0d6efd !important;
}

.x-small {
    font-size: 0.75rem;
}

.custom-radio {
    transition: all 0.2s ease;
    cursor: pointer;
}

.custom-radio:hover {
    border-color: #0d6efd !important;
    background-color: #f8faff;
}

.transition-all {
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(13, 110, 253, 0.2);
}

/* স্করলবার স্টাইল */
.checkout-items::-webkit-scrollbar {
    width: 4px;
}

.checkout-items::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

/* ১. স্টিকি কন্টেইনারের z-index কমিয়ে নেভবারের নিচে নামানো */
.sticky-top {
    top: 90px !important;
    /* আপনার নেভবারের হাইট অনুযায়ী অ্যাডজাস্ট করুন */
    z-index: 10 !important;
    /* নেভবারের z-index সাধারণত ১০৩০ থাকে, তাই এটি কমিয়ে ১০ দিন */
}

/* ২. চেকআউট আইটেম লিস্টের হাইট এবং স্ক্রল ম্যানেজমেন্ট */
.checkout-items {
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 5px;
    /* স্ক্রলবারের জন্য সামান্য স্পেস */
}

/* ৩. কার্ডের লুক আরও ক্লিন করা */
.card {
    border: 1px solid #f0f0f0 !important;
}
</style>