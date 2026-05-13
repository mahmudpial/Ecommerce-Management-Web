<template>
    <div class="container mt-4">
        <h2 class="mb-4 text-center">Our Products</h2>

        <div v-if="productStore.loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p>Loading products...</p>
        </div>

        <div v-else class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
            <div v-for="product in productStore.products" :key="product.id" class="col">
                <div class="card h-100 shadow-sm border-0 product-card">
                    <img :src="product.image ? `http://127.0.0.1:8000/storage/${product.image}` : 'https://via.placeholder.com/300'"
                        class="card-img-top p-3" alt="product image" style="height: 200px; object-fit: contain;">
                    <div class="card-body text-center">
                        <h5 class="card-title text-truncate">{{ product.name }}</h5>
                        <p class="card-text text-primary fw-bold">{{ product.price }} TK</p>
                        <p class="text-muted small">Stock: {{ product.stock }}</p>
                    </div>
                    <div class="card-footer bg-white border-0 d-grid pb-3">
                        <button class="btn btn-outline-primary btn-sm mb-2">View Details</button>
                        <button class="btn btn-primary btn-sm" @click="addToCart(product)">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '../stores/product';

const productStore = useProductStore();

onMounted(() => {
    productStore.fetchProducts();
});

const addToCart = (product) => {
    alert(`${product.name} has been added to the cart! (Cart logic will be implemented in the next step)`);
};
</script>

<style scoped>
.product-card {
    transition: transform 0.3s ease;
    border-radius: 12px;
}

.product-card:hover {
    transform: translateY(-5px);
}
</style>