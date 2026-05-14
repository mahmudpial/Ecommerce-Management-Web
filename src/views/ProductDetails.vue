<template>
    <div class="product-details-wrapper bg-white min-vh-100 pb-5">
        <div class="container py-5">
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                        <router-link to="/products" class="text-decoration-none text-muted">Products</router-link>
                    </li>
                    <li class="breadcrumb-item active text-dark fw-bold" aria-current="page">Product Details</li>
                </ol>
            </nav>

            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Loading details...</p>
            </div>

            <div v-else-if="product" class="row g-5">
                <div class="col-lg-6">
                    <div class="sticky-top" style="top: 100px;">
                        <div
                            class="main-image-container border rounded-4 p-4 bg-light-subtle d-flex align-items-center justify-content-center overflow-hidden position-relative shadow-xs">
                            <img :src="product.image ? `http://127.0.0.1:8000/storage/${product.image}` : 'https://placehold.jp/600x600.png'"
                                class="img-fluid product-main-img" :alt="product.name">

                            <div v-if="product.stock <= 0"
                                class="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-50 d-flex align-items-center justify-content-center">
                                <span class="badge bg-danger px-4 py-2 fs-6 shadow">Stock Out</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="product-info-ps-lg-4">
                        <span
                            class="badge bg-primary-subtle text-primary mb-2 px-3 py-2 rounded-pill fw-bold text-uppercase ls-1">
                            {{ product.brand?.name || 'Commercia Official' }}
                        </span>

                        <h1 class="fw-bold text-dark mb-2 display-6">{{ product.name }}</h1>

                        <div class="d-flex align-items-center gap-3 mb-4">
                            <div class="text-warning small fw-bold">
                                <i class="bi bi-star-fill"></i> 4.8 <span class="text-muted fw-normal ms-1">(120
                                    Reviews)</span>
                            </div>
                            <div class="vr text-muted"></div>
                            <span :class="product.stock > 0 ? 'text-success' : 'text-danger'" class="fw-bold small">
                                <i class="bi"
                                    :class="product.stock > 0 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                                {{ product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock' }}
                            </span>
                        </div>

                        <div class="price-box p-4 border rounded-4 bg-light-subtle mb-4">
                            <div class="d-flex align-items-center gap-3">
                                <h2 class="fw-bold text-dark mb-0">৳{{ product.price }}</h2>
                                <span class="text-muted text-decoration-line-through fs-5">৳{{ Math.round(product.price
                                    * 1.15) }}</span>
                                <span class="badge bg-danger rounded-pill px-3">15% OFF</span>
                            </div>
                            <p class="text-danger small fw-bold mt-2 mb-0 italic">*Limited time offer</p>
                        </div>

                        <div class="mb-4">
                            <h6 class="fw-bold text-dark text-uppercase small ls-1 mb-2">Description</h6>
                            <p class="text-secondary lh-lg mb-0">
                                {{ product.description || `Experience the premium quality and exceptional performance of
                                this product. Designed with modern aesthetics and built for durability with high-quality
                                materials.` }}
                            </p>
                        </div>

                        <div class="mb-4" v-if="product.stock > 0">
                            <label class="form-label small fw-bold text-secondary text-uppercase mb-2">Select
                                Quantity</label>
                            <div class="d-flex align-items-center gap-3">
                                <div class="input-group" style="width: 130px;">
                                    <button class="btn btn-outline-secondary border-end-0 px-3"
                                        @click="quantity > 1 ? quantity-- : null">-</button>
                                    <input type="text"
                                        class="form-control text-center border-start-0 border-end-0 fw-bold shadow-none"
                                        v-model="quantity" readonly>
                                    <button class="btn btn-outline-secondary border-start-0 px-3"
                                        @click="quantity < product.stock ? quantity++ : null">+</button>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 mb-5">
                            <div class="col-md-9">
                                <button
                                    class="btn btn-dark btn-lg w-100 rounded-3 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm border-0 transition-all"
                                    :disabled="product.stock <= 0" @click="handleAddToCart">
                                    <i class="bi bi-bag-plus fs-4"></i>
                                    Add to Shopping Cart
                                </button>
                            </div>
                            <div class="col-md-3">
                                <button class="btn btn-outline-dark btn-lg w-100 rounded-3 py-3 shadow-none">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>
                        </div>

                        <div class="border-top pt-4">
                            <div class="row g-4">
                                <div class="col-6 col-md-4">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="icon-circle bg-light text-primary">
                                            <i class="bi bi-truck fs-5"></i>
                                        </div>
                                        <div>
                                            <div class="small fw-bold">Fast Delivery</div>
                                            <div class="x-small text-muted">2-3 Business Days</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 col-md-4">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="icon-circle bg-light text-primary">
                                            <i class="bi bi-shield-check fs-5"></i>
                                        </div>
                                        <div>
                                            <div class="small fw-bold">Original</div>
                                            <div class="x-small text-muted">100% Guaranteed</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-4">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="icon-circle bg-light text-primary">
                                            <i class="bi bi-arrow-repeat fs-5"></i>
                                        </div>
                                        <div>
                                            <div class="small fw-bold">7 Days Return</div>
                                            <div class="x-small text-muted">Easy exchange</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import axios from 'axios';

const cartStore = useCartStore();
const route = useRoute();
const product = ref(null);
const loading = ref(true);
const quantity = ref(1);

const fetchProductDetails = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${route.params.id}`);
        product.value = response.data;
    } catch (error) {
        console.error("Error fetching product details:", error);
    } finally {
        loading.value = false;
    }
};

const handleAddToCart = () => {
    if (product.value.stock > 0) {
        cartStore.addToCart(product.value, quantity.value);
        alert(`${product.value.name} added to cart!`);
    }
};

onMounted(fetchProductDetails);
</script>

<style scoped>
.product-details-wrapper {
    font-family: 'Inter', sans-serif;
}

/* ইমেজ এবং কন্টেইনার ফিক্স */
.main-image-container {
    height: 550px;
    background-color: #f8f9fa;
    border: 1.5px solid #ececec !important;
    transition: all 0.3s ease;
}

.product-main-img {
    max-height: 100%;
    width: auto;
    object-fit: contain;
    /* ছবি চ্যাপ্টা হবে না */
    transition: transform 0.5s ease;
}

.main-image-container:hover .product-main-img {
    transform: scale(1.05);
}

/* ইউটিলিটি ক্লাস */
.x-small {
    font-size: 0.65rem;
}

.ls-1 {
    letter-spacing: 1px;
}

.shadow-xs {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

/* বাটন ডিজাইন */
.btn-dark:hover:not(:disabled) {
    background-color: #0d6efd !important;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(13, 110, 253, 0.2) !important;
}

/* আইকন সার্কেল */
.icon-circle {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

/* কোয়ান্টিটি ইনপুট */
.input-group .btn {
    background: #fff;
    border-color: #dee2e6;
}

.input-group .btn:hover {
    background: #f8f9fa;
}

/* ব্রেডক্রাম্ব এনিমেশন */
.breadcrumb-item+.breadcrumb-item::before {
    content: "→";
    font-size: 0.8rem;
    color: #ccc;
}

/* ১. স্টিকি কন্টেইনারের z-index কমিয়ে দিন */
.sticky-top {
    top: 100px !important;
    /* নেভবার থেকে নিরাপদ দূরত্ব */
    z-index: 5 !important;
    /* নেভবারের চেয়ে কম (নেভবার সাধারণত ১০ বা ১০০ থাকে) */
}

/* ২. ইমেজ কন্টেইনারের জন্য আরও ক্লিন ফিক্স */
.main-image-container {
    height: 550px;
    background-color: #f8f9fa;
    border: 1.5px solid #ececec !important;
    position: relative;
    /* overflow: hidden; এটি নিশ্চিত করুন */
}
</style>