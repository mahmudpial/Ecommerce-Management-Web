<template>
    <div class="products-inventory-container text-start">

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
                <h4 class="fw-bold text-dark mb-1">Commercia Pro Products Inventory Hub</h4>
                <p class="text-muted small mb-0">Master catalog control, stock pipeline logistics, and media-rich asset
                    management.</p>
            </div>
            <div>
                <button @click="openAddModal"
                    class="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm">
                    <i class="bi bi-plus-circle-fill"></i> Add New Product
                </button>
            </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading Inventory...</span>
            </div>
            <p class="text-muted mt-2 small">Connecting to Commercia SKU cluster...</p>
        </div>

        <div v-else class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div class="table-responsive">
                <table class="table align-middle table-hover border-0 mb-0">
                    <thead class="bg-light text-secondary small text-uppercase border-bottom">
                        <tr>
                            <th class="border-0 px-3">Product Details</th>
                            <th class="border-0">Category / Brand ID</th>
                            <th class="border-0">Price</th>
                            <th class="border-0">Stock Level</th>
                            <th class="border-0 text-end px-3">Action Controls</th>
                        </tr>
                    </thead>
                    <tbody class="small border-0">
                        <tr v-for="(product, index) in products" :key="product?.id || index"
                            class="border-bottom border-light">

                            <td class="px-3">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="bg-light rounded-3 d-flex align-items-center justify-content-center border"
                                        style="width: 52px; height: 52px; overflow: hidden;">
                                        <img v-if="product?.image" :src="getImageUrl(product.image)"
                                            class="img-fluid object-fit-cover w-100 h-100" alt="Product Image">
                                        <i v-else class="bi bi-box-seam text-secondary fs-4"></i>
                                    </div>
                                    <div>
                                        <div class="fw-semibold text-dark fs-6">{{ product?.name || 'Untitled SKU' }}
                                        </div>
                                        <span class="text-muted x-small">System Ref #{{ product?.id }}</span>
                                    </div>
                                </div>
                            </td>

                            <td>
                                <div class="d-flex flex-column gap-1">
                                    <span class="badge bg-light text-dark border x-small text-start align-self-start">
                                        Category ID: {{ product?.category_id || 'Unassigned' }}
                                    </span>
                                    <span
                                        class="badge bg-light text-primary border border-primary-subtle x-small text-start align-self-start">
                                        Brand ID: {{ product?.brand_id || 'Unassigned' }}
                                    </span>
                                </div>
                            </td>

                            <td class="fw-bold text-dark fs-6">৳{{ numberFormat(product?.price) }}</td>

                            <td>
                                <span class="badge px-2.5 py-1.5 rounded fw-bold text-uppercase x-small"
                                    :class="stockBadgeClass(product?.stock)">
                                    {{ product?.stock > 0 ? `${product.stock} Units` : 'Out Of Stock' }}
                                </span>
                            </td>

                            <td class="text-end px-3">
                                <div class="d-inline-flex gap-2">
                                    <button @click="openEditModal(product)"
                                        class="btn btn-light btn-sm border shadow-sm px-2.5" title="Modify Record">
                                        <i class="bi bi-pencil-square text-primary"></i> Edit
                                    </button>

                                    <button v-if="authStore.user?.role_id === 1 && product"
                                        @click="terminateProduct(product?.id)"
                                        class="btn btn-light btn-sm border border-danger-subtle shadow-sm px-2.5"
                                        title="Purge SKU">
                                        <i class="bi bi-trash3-fill text-danger"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="!products || products.length === 0">
                            <td colspan="5" class="text-center py-5 text-muted">
                                <i class="bi bi-boxes display-4 d-block mb-2 opacity-50"></i>
                                No products registered in master database catalog.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content border-0 shadow rounded-4 p-2">
                    <div class="modal-header border-0">
                        <h5 class="modal-title fw-bold text-dark">
                            {{ isEditMode ? 'Modify Product Specifications' : 'Onboard New Product SKU' }}
                        </h5>
                        <button type="button" @click="closeModal" class="btn-close" aria-label="Close"></button>
                    </div>
                    <form @submit.prevent="submitForm" enctype="multipart/form-data">
                        <div class="modal-body text-start">
                            <div class="row g-3">

                                <div class="col-12">
                                    <label class="form-label small fw-bold text-secondary">Product Display Name
                                        *</label>
                                    <input v-model="form.name" type="text" class="form-control rounded-3"
                                        placeholder="e.g., Premium Leather Wallet" required>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-secondary">Category Connection ID
                                        *</label>
                                    <input v-model.number="form.category_id" type="number"
                                        class="form-control rounded-3" placeholder="Category ID" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-secondary">Brand Connection ID *</label>
                                    <input v-model.number="form.brand_id" type="number" class="form-control rounded-3"
                                        placeholder="Brand ID" required>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-secondary">Unit Price (BDT) *</label>
                                    <input v-model.number="form.price" type="number" step="0.01"
                                        class="form-control rounded-3" placeholder="0.00" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-secondary">Initial Stock Count *</label>
                                    <input v-model.number="form.stock" type="number" class="form-control rounded-3"
                                        placeholder="0" required>
                                </div>

                                <div class="col-12">
                                    <label class="form-label small fw-bold text-secondary">Product Visual Image</label>
                                    <input type="file" @change="handleImageUpload" class="form-control rounded-3"
                                        accept="image/*">
                                    <p class="text-muted x-small mt-1 mb-0">Supported formats: JPEG, PNG, JPG, WEBP (Max
                                        2MB).</p>
                                </div>

                            </div>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" @click="closeModal"
                                class="btn btn-light border small px-4 rounded-3 fw-semibold">Abort</button>
                            <button type="submit" class="btn btn-primary small px-4 rounded-3 fw-semibold">
                                {{ isEditMode ? 'Update Inventory' : 'Publish to Catalog' }}
                            </button>
                        </div>
                    </form>
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
const products = ref([]);
const loading = ref(true);

const showModal = ref(false);
const isEditMode = ref(false);
const currentProductId = ref(null);

// ডেটাবেজ ম্যাচিং ফ্রেন্ডলি রিডিউসড ফর্ম স্টেট
const defaultForm = {
    name: '',
    category_id: '',
    brand_id: '',
    price: '',
    stock: '',
    image: null // ইমেজের বাইনারি ফাইল অবজেক্ট হোল্ড করার জন্য
};
const form = ref({ ...defaultForm });

// 🚀 লাইভ ডাটা ক্যাটালগ পুল
const fetchInventory = async () => {
    loading.value = true;
    try {
        const response = await axiosClient.get('/products');
        products.value = Array.isArray(response.data) ? response.data : (response.data.data || []);
    } catch (error) {
        console.error("Commercia Pro Inventory Stream Breakdown:", error);
    } chunks: {
        loading.value = false;
    }
};

// ফাইল ইনপুট হ্যান্ডলার (মিডিয়া বাফারিং এপিআই)
const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.image = file;
    }
};

// ⚙️ মডাল হ্যান্ডলারস
const openAddModal = () => {
    isEditMode.value = false;
    form.value = { ...defaultForm };
    showModal.value = true;
};

const openEditModal = (product) => {
    if (!product) return;
    isEditMode.value = true;
    currentProductId.value = product.id;
    form.value = {
        name: product.name || '',
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        price: product.price || '',
        stock: product.stock || '',
        image: null // এডিটের সময় নতুন ইমেজ সিলেক্ট না করলে আগেরটাই ব্যাকএন্ডে থাকবে
    };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    form.value = { ...defaultForm };
    currentProductId.value = null;
};

// 💾 সিঙ্ক রিকোয়েস্ট সাবমিট (FormData Engine used for File Transmission)
const submitForm = async () => {
    try {
        // ইমেজ আপলোডের সুবিধার্থে রিকোয়েস্টকে FormData তে কনভার্ট করা হচ্ছে
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('category_id', form.value.category_id);
        formData.append('brand_id', form.value.brand_id);
        formData.append('price', form.value.price);
        formData.append('stock', form.value.stock);

        if (form.value.image) {
            formData.append('image', form.value.image);
        }

        if (isEditMode.value) {
            // লারাভেল PUT/POST মেথড স্পুফিং হ্যান্ডলার জেনারেটর
            formData.append('_method', 'POST');
            await axiosClient.post(`/products/${currentProductId.value}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Product SKU updated successfully.");
        } else {
            await axiosClient.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("New Product published to core store successfully.");
        }
        closeModal();
        fetchInventory();
    } catch (error) {
        alert(error.response?.data?.message || "Failed to commit inventory data structure.");
    }
};

// 🔒 ডিলিট মেথড
const terminateProduct = async (id) => {
    if (!id) return;
    if (confirm("🚨 WARNING: This action will permanently delete this product SKU from store. Proceed?")) {
        try {
            await axiosClient.delete(`/products/${id}`);
            fetchInventory();
            alert("Product removed from live database system.");
        } catch (error) {
            alert(error.response?.data?.message || "Terminal deletion sequence denied by server.");
        }
    }
};

// স্টোরেজ ইমেজ ইউআরএল জেনারেটর মেথড
const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000/storage/${imagePath}`; // আপনার লারাভেল লোকালহোস্ট স্টোরেজ লিঙ্ক ম্যাপিং
};

// কারেন্সি ফরম্যাটার
const numberFormat = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// স্টক এলার্ট ব্যাজ
const stockBadgeClass = (stock) => {
    const count = Number(stock);
    if (count <= 0) return 'bg-danger bg-opacity-10 text-danger';
    if (count <= 10) return 'bg-warning bg-opacity-10 text-warning';
    return 'bg-success bg-opacity-10 text-success';
};

onMounted(() => {
    fetchInventory();
});
</script>

<style scoped>
.x-small {
    font-size: 11px;
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1040;
}

.modal {
    z-index: 1050;
}

.table tbody tr {
    transition: background-color 0.15s ease-in-out;
}

.table tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.01) !important;
}
</style>