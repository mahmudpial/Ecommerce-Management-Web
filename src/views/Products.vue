<template>
    <div class="product-wrapper bg-white min-vh-100">
        <div class="page-title-area py-5 border-bottom bg-light-subtle">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h1 class="fw-bold text-dark display-6 mb-1">
                            <i class="bi bi-box-seam text-primary me-2"></i>Our Collections
                        </h1>
                        <p class="text-muted mb-0 small">Discover high-quality products curated for your needs.</p>
                    </div>
                    <div class="col-md-6 text-md-end mt-3 mt-md-0">
                        <div class="d-inline-flex align-items-center px-3 py-2 bg-white border rounded-pill shadow-sm">
                            <span class="status-dot bg-success me-2"></span>
                            <span class="small fw-bold text-dark">{{ productStore.products.length }} Products
                                Available</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-5 pb-5">
            <div class="row">
                <aside class="col-lg-3 mb-4">
                    <div class="filter-sidebar p-4 border rounded-4 shadow-sm sticky-sidebar bg-white">
                        <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
                            <i class="bi bi-filter-left fs-4 text-primary me-2"></i>
                            <h5 class="fw-bold mb-0">Filters</h5>
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold text-secondary text-uppercase mb-2">Search</label>
                            <div class="input-group">
                                <span class="input-group-text bg-light border-0"><i
                                        class="bi bi-search text-muted"></i></span>
                                <input type="text" v-model="filters.search" @input="applyFilters"
                                    class="form-control bg-light border-0 shadow-none py-2"
                                    placeholder="Product name...">
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold text-secondary text-uppercase mb-2">Category</label>
                            <div class="position-relative">
                                <i
                                    class="bi bi-tag position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                <select v-model="filters.category_id" @change="applyFilters"
                                    class="form-select ps-5 border shadow-none bg-white py-2 rounded-3">
                                    <option value="">All Categories</option>
                                    <option v-for="cat in productStore.categories" :key="cat.id" :value="cat.id">{{
                                        cat.name }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold text-secondary text-uppercase mb-2">Brand</label>
                            <div class="position-relative">
                                <i
                                    class="bi bi-patch-check position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                                <select v-model="filters.brand_id" @change="applyFilters"
                                    class="form-select ps-5 border shadow-none bg-white py-2 rounded-3">
                                    <option value="">All Brands</option>
                                    <option v-for="brand in productStore.brands" :key="brand.id" :value="brand.id">{{
                                        brand.name }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold text-secondary text-uppercase mb-2">Price
                                Range</label>
                            <div class="d-flex gap-2">
                                <input type="number" v-model="filters.min_price" @input="applyFilters"
                                    class="form-control form-control-sm border shadow-none text-center py-2"
                                    placeholder="Min">
                                <input type="number" v-model="filters.max_price" @input="applyFilters"
                                    class="form-control form-control-sm border shadow-none text-center py-2"
                                    placeholder="Max">
                            </div>
                        </div>

                        <button @click="resetFilters"
                            class="btn btn-outline-danger btn-sm w-100 rounded-pill mt-2 fw-bold">
                            <i class="bi bi-arrow-counterclockwise me-1"></i> Reset All
                        </button>
                    </div>
                </aside>

                <main class="col-lg-9 ps-lg-4">
                    <div v-if="productStore.loading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="mt-2 text-muted">Refreshing catalog...</p>
                    </div>

                    <div v-else class="row g-4">
                        <div v-for="product in productStore.products" :key="product.id" class="col-md-6 col-xl-4">
                            <div class="card h-100 border rounded-4 overflow-hidden product-hover-card shadow-xs">
                                <div class="position-relative bg-light d-flex align-items-center justify-content-center p-3"
                                    style="height: 220px;">
                                    <img :src="product.image ? `http://127.0.0.1:8000/storage/${product.image}` : 'https://placehold.jp/300x300.png'"
                                        class="img-fluid h-100 object-fit-contain transition-img">

                                    <div v-if="product.stock <= 0"
                                        class="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-50 d-flex align-items-center justify-content-center">
                                        <span
                                            class="badge bg-white text-danger border border-danger fw-bold shadow-sm px-3 py-2">Out
                                            of Stock</span>
                                    </div>

                                    <div
                                        class="hover-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0 transition-300">
                                        <router-link :to="`/product/${product.id}`"
                                            class="btn btn-white btn-sm rounded-circle shadow-sm">
                                            <i class="bi bi-eye text-dark fs-5"></i>
                                        </router-link>
                                    </div>

                                    <div class="position-absolute top-0 start-0 m-2">
                                        <span v-if="product.stock <= 5 && product.stock > 0"
                                            class="badge bg-warning text-dark border-0 shadow-sm">Low Stock</span>
                                    </div>
                                </div>

                                <div class="card-body p-3 bg-white">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="text-primary x-small fw-bold text-uppercase ls-1">{{
                                            product.brand?.name || 'Commercia' }}</span>
                                        <span class="x-small text-muted fw-medium" v-if="product.stock > 0">Stock: {{
                                            product.stock }}</span>
                                    </div>

                                    <h6 class="fw-bold text-dark mb-2 text-truncate-2" style="height: 42px;">{{
                                        product.name }}</h6>

                                    <div class="price-container mb-3 d-flex align-items-center gap-2">
                                        <span class="fs-5 fw-bold text-dark">৳{{ product.price }}</span>

                                        <span class="text-muted small text-decoration-line-through">
                                            ৳{{ Math.round(product.price * 1.15) }}
                                        </span>

                                        <span class="badge rounded-1 fw-medium px-2 py-1"
                                            style="font-size: 0.65rem; background-color: #fce8e8; color: #d93025;">
                                            15% OFF
                                        </span>
                                    </div>

                                    <button
                                        class="btn btn-dark w-100 py-2 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 transition-300 btn-cart"
                                        :disabled="product.stock <= 0" @click="addToCart(product)">
                                        <i class="bi bi-cart3"></i> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="productStore.products.length === 0" class="col-12 text-center py-5">
                            <div class="py-5 border rounded-5 bg-light-subtle">
                                <i class="bi bi-search display-1 text-muted opacity-25"></i>
                                <h5 class="text-muted mt-3">No products match your search.</h5>
                                <button @click="resetFilters" class="btn btn-link text-primary mt-2">Clear all
                                    filters</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useProductStore } from '../stores/product';
import { useCartStore } from '../stores/cart';
const cartStore = useCartStore();
const productStore = useProductStore();

const filters = reactive({
    search: '',
    category_id: '',
    brand_id: '',
    min_price: '',
    max_price: ''
});

const applyFilters = () => {
    productStore.fetchProducts(filters);
};

const resetFilters = () => {
    Object.keys(filters).forEach(key => filters[key] = '');
    applyFilters();
};

const addToCart = (product) => {
    if (product.stock > 0) {
        cartStore.addToCart(product, 1);
        alert(`${product.name} added to cart!`);
    } else {
        alert("Sorry, out of stock!");
    }
};

onMounted(() => {
    productStore.fetchProducts();
    productStore.fetchCategories();
    productStore.fetchBrands();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.product-wrapper {
    font-family: 'Inter', sans-serif;
}

.x-small {
    font-size: 0.7rem;
}

.ls-1 {
    letter-spacing: 0.5px;
}

.sticky-sidebar {
    position: sticky;
    top: 100px;
    z-index: 10;
    max-height: calc(100vh - 140px);
    overflow-y: auto;
}


.product-hover-card {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.product-hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08) !important;
}

.transition-img {
    transition: transform 0.4s ease;
}

.product-hover-card:hover .transition-img {
    transform: scale(1.05);
}

/* Overlay View Button */
.hover-overlay {
    background: rgba(0, 0, 0, 0.03);
}

.product-hover-card:hover .hover-overlay {
    opacity: 1 !important;
}


.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}


.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}


.transition-300 {
    transition: all 0.3s ease;
}


.btn-white {
    background: #fff;
    border: 1px solid #eee;
}

.btn-white:hover {
    background: #0d6efd;
    color: #fff !important;
}

.btn-cart:hover:not(:disabled) {
    background: #0d6efd;
    transform: scale(1.02);
}


.sticky-sidebar::-webkit-scrollbar {
    width: 3px;
}

.sticky-sidebar::-webkit-scrollbar-thumb {
    background: #eee;
    border-radius: 10px;
}

.filter-sidebar {
    background-color: #d7cbcb;
    border: 1px solid #a29ff0 !important;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(62, 52, 52, 0.05);

}

.card {
    border: 1px solid #f0f0f0 !important;
    border-radius: 16px !important;
    transition: all 0.3s ease-in-out;
    background-color: #ffffff;
}

.card:hover {
    border-color: #0d6efd !important;
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04) !important;
}


.bg-light {
    background-color: #f8f9fa !important;
    border-bottom: 1px solid #f0f0f0;
}

.form-control,
.form-select {
    border: 1px solid #e2e8f0 !important;
    border-radius: 8px !important;
}

.form-control:focus,
.form-select:focus {
    border-color: #0d6efd !important;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1) !important;
}

.btn-dark {
    border: 1px solid #111;
    border-radius: 8px;
}

.btn-dark:hover:not(:disabled) {
    border-color: #0d6efd;
    color: #fff !important;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(13, 110, 253, 0.2) !important;
}

.text-decoration-line-through {
    color: #94a3b8 !important;
    font-size: 0.85rem;
}

.bg-soft-danger {
    background-color: #fee2e2;
}

.product-hover-card:hover {

    color: #ffffff !important;
    transition: color 0.3s ease;
}
</style>