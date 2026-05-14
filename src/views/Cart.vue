<template>
    <div class="cart-page bg-light-subtle min-vh-100 py-5">
        <div class="container">
            <div class="d-flex align-items-center gap-3 mb-4">
                <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                    style="width: 45px; height: 45px;">
                    <i class="bi bi-bag-check-fill fs-4"></i>
                </div>
                <h2 class="fw-bold text-dark mb-0">Your Shopping Cart</h2>
            </div>

            <div v-if="cartStore.items.length === 0"
                class="text-center py-5 bg-white rounded-4 border border-dashed border-2">
                <div class="mb-3">
                    <i class="bi bi-cart-x display-2 text-primary opacity-50"></i>
                </div>
                <h4 class="fw-bold text-dark">Your cart is empty!</h4>
                <p class="text-muted">Looks like you haven't added anything to your cart yet.</p>
                <router-link to="/" class="btn btn-dark px-4 py-2 rounded-3 mt-2">
                    Continue Shopping
                </router-link>
            </div>

            <div v-else class="row g-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="table-responsive">
                            <table class="table table-borderless align-middle mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="ps-4 py-3 text-uppercase small fw-bold text-secondary">Product</th>
                                        <th class="py-3 text-uppercase small fw-bold text-secondary text-center">
                                            Quantity</th>
                                        <th class="py-3 text-uppercase small fw-bold text-secondary text-end">Price</th>
                                        <th class="py-3 text-end pe-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in cartStore.items" :key="item.id" class="border-bottom">
                                        <td class="ps-4 py-4">
                                            <div class="d-flex align-items-center gap-3">
                                                <img :src="item.image ? `http://127.0.0.1:8000/storage/${item.image}` : 'https://placehold.jp/80x80.png'"
                                                    class="rounded-3 border object-fit-contain bg-light"
                                                    style="width: 80px; height: 80px;">
                                                <div>
                                                    <h6 class="fw-bold mb-1 text-dark">{{ item.name }}</h6>
                                                    <p class="small text-muted mb-0">Unit Price: ৳{{ item.price }}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-4">
                                            <div class="d-flex justify-content-center">
                                                <div class="input-group input-group-sm shadow-xs" style="width: 110px;">
                                                    <button class="btn btn-white border px-2"
                                                        @click="cartStore.updateQuantity(item.id, -1)">-</button>
                                                    <input type="text"
                                                        class="form-control text-center border-top border-bottom bg-white fw-bold shadow-none"
                                                        :value="item.quantity" readonly>
                                                    <button class="btn btn-white border px-2"
                                                        @click="cartStore.updateQuantity(item.id, 1)">+</button>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-4 text-end fw-bold text-dark">
                                            ৳{{ item.price * item.quantity }}
                                        </td>
                                        <td class="py-4 text-end pe-4">
                                            <button class="btn btn-link text-danger p-0 shadow-none"
                                                @click="cartStore.removeFromCart(item.id)">
                                                <i class="bi bi-trash3 fs-5"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="mt-4">
                        <router-link to="/" class="text-decoration-none text-primary fw-bold small">
                            <i class="bi bi-arrow-left me-1"></i> Continue Shopping
                        </router-link>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top" style="top: 100px;">
                        <h5 class="fw-bold mb-4">Order Summary</h5>

                        <div class="d-flex justify-content-between mb-3 text-muted">
                            <span>Subtotal ({{ cartStore.cartCount }} items)</span>
                            <span>৳{{ cartStore.totalPrice }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3 text-muted">
                            <span>Shipping Fee</span>
                            <span class="text-success">Free</span>
                        </div>
                        <div class="d-flex justify-content-between mb-4 text-muted">
                            <span>Tax (Estimated)</span>
                            <span>৳0</span>
                        </div>

                        <hr class="my-4 opacity-50">

                        <div class="d-flex justify-content-between mb-4">
                            <span class="fw-bold fs-5">Total Amount</span>
                            <span class="fw-bold fs-5 text-primary">৳{{ cartStore.totalPrice }}</span>
                        </div>

                        <router-link to="/checkout"
                            class="btn btn-dark w-100 py-3 rounded-3 fw-bold mb-3 shadow-sm border-0 text-decoration-none d-block text-center checkout-btn">
                            Proceed to Checkout
                            <i class="bi bi-arrow-right ms-2"></i>
                        </router-link>

                        <div class="text-center">
                            <img src="https://img.icons8.com/color/48/000000/visa.png" width="30"
                                class="me-2 opacity-75">
                            <img src="https://img.icons8.com/color/48/000000/mastercard.png" width="30"
                                class="me-2 opacity-75">
                            <img src="https://img.icons8.com/color/48/000000/ssl.png" width="30" class="opacity-75">
                            <p class="x-small text-muted mt-3 mb-0">Secure SSL Encrypted Payment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart';
const cartStore = useCartStore();
</script>

<style scoped>
.cart-page {
    font-family: 'Inter', sans-serif;
}

.table thead th {
    border: none;
    letter-spacing: 0.5px;
}

.shadow-xs {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.checkout-btn:hover {
    background-color: #0d6efd !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(13, 110, 253, 0.2) !important;
}

.x-small {
    font-size: 0.7rem;
}

.transition-all {
    transition: all 0.3s ease;
}

/* শপ নেভ স্টাইল */
.btn-white {
    background: #fff;
    color: #333;
}
</style>