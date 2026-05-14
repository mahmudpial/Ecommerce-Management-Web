<template>
    <div class="category-brand-container text-start">

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
                <h4 class="fw-bold text-dark mb-1">Commercia Pro Brandegory Hub</h4>
                <p class="text-muted small mb-0">Manage product categories and brand connections dynamically.</p>
            </div>
            <div>
                <button @click="openAddModal"
                    class="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm">
                    <i class="bi bi-plus-circle-fill"></i> Add {{ activeTab === 'categories' ? 'Category' : 'Brand' }}
                </button>
            </div>
        </div>

        <ul class="nav nav-tabs border-bottom mb-4">
            <li class="nav-item cursor-pointer">
                <button class="nav-link fw-bold px-4 py-2.5"
                    :class="{ 'active text-primary': activeTab === 'categories' }" @click="switchTab('categories')">
                    <i class="bi bi-tags-fill me-2"></i>Product Categories
                </button>
            </li>
            <li class="nav-item cursor-pointer">
                <button class="nav-link fw-bold px-4 py-2.5" :class="{ 'active text-primary': activeTab === 'brands' }"
                    @click="switchTab('brands')">
                    <i class="bi bi-patch-check-fill me-2"></i>Brand Portfolio
                </button>
            </li>
        </ul>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Syncing Cluster...</span>
            </div>
            <p class="text-muted mt-2 small">Loading Brandegory nodes...</p>
        </div>

        <div v-else class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div class="table-responsive">
                <table class="table align-middle table-hover border-0 mb-0">
                    <thead class="bg-light text-secondary small text-uppercase border-bottom">
                        <tr>
                            <th class="border-0 px-3" style="width: 150px;">System ID</th>
                            <th class="border-0">Name / Title</th>
                            <th class="border-0">Slug / Reference</th>
                            <th class="border-0 text-end px-3">Action Controls</th>
                        </tr>
                    </thead>
                    <tbody class="small border-0">
                        <tr v-for="(item, index) in activeData" :key="item?.id || index"
                            class="border-bottom border-light">
                            <td class="px-3 font-monospace fw-bold text-secondary">#{{ item?.id }}</td>
                            <td class="fw-semibold text-dark fs-6">{{ item?.name }}</td>
                            <td class="text-muted">{{ item?.slug || 'N/A' }}</td>

                            <td class="text-end px-3">
                                <button v-if="authStore.user?.role_id === 1" @click="terminateItem(item?.id)"
                                    class="btn btn-light btn-sm border border-danger-subtle shadow-sm px-2.5"
                                    title="Purge Record">
                                    <i class="bi bi-trash3-fill text-danger"></i> Delete
                                </button>
                                <span v-else class="text-muted x-small">No Controls</span>
                            </td>
                        </tr>

                        <tr v-if="activeData.length === 0">
                            <td colspan="4" class="text-center py-5 text-muted">
                                <i class="bi bi-folder-x display-4 d-block mb-2 opacity-50"></i>
                                No records registered under this dataset.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content border-0 shadow rounded-4 p-2">
                    <div class="modal-header border-0">
                        <h5 class="modal-title fw-bold text-dark">Onboard New {{ activeTab === 'categories' ? 'Category'
                            : 'Brand' }}</h5>
                        <button type="button" @click="closeModal" class="btn-close"></button>
                    </div>
                    <form @submit.prevent="submitForm">
                        <div class="modal-body text-start">
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-secondary">Name *</label>
                                <input v-model="form.name" type="text" class="form-control rounded-3 text-start"
                                    placeholder="e.g., Electronics or Samsung" required>
                            </div>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" @click="closeModal"
                                class="btn btn-light border small px-4 rounded-3 fw-semibold">Abort</button>
                            <button type="submit" class="btn btn-primary small px-4 rounded-3 fw-semibold">Save
                                Structure</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import axiosClient from '../../api/axios';

const authStore = useAuthStore();
const activeTab = ref('categories'); // 'categories' অথবা 'brands'
const loading = ref(true);

const categories = ref([]);
const brands = ref([]);

const showModal = ref(false);
const form = ref({ name: '' });

// ডাইনামিক ডেটা সুইচিং কমপুটেড প্রোপার্টি
const activeData = computed(() => {
    return activeTab.value === 'categories' ? categories.value : brands.value;
});

// 🚀 সার্ভার কালেকশন পুল
const fetchTaxonomyData = async () => {
    loading.value = true;
    try {
        const [catResponse, brandResponse] = await Promise.all([
            axiosClient.get('/categories'),
            axiosClient.get('/brands')
        ]);

        // 🎯 আপনার কন্ট্রোলার রেসপন্স ফরম্যাট ('success' => true, 'data' => $data) অনুযায়ী ফিক্স
        categories.value = catResponse.data?.data || [];
        brands.value = brandResponse.data?.data || [];
    } catch (error) {
        console.error("Taxonomy Stream Sync Error:", error);
    } finally {
        loading.value = false;
    }
};

const switchTab = (tab) => {
    activeTab.value = tab;
};

// ⚙️ মডাল হ্যান্ডলিং
const openAddModal = () => {
    form.value = { name: '' };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

// 💾 ডাটাবেজ স্টোর সাবমিট
const submitForm = async () => {
    try {
        // ডাইনামিক এন্ডপয়েন্ট নির্ধারণ (/admin/categories বা /admin/brands) আপনার api.php প্রেক্সিক্স অনুযায়ী
        const endpoint = `/admin/${activeTab.value}`;

        await axiosClient.post(endpoint, form.value);

        alert(`New ${activeTab.value === 'categories' ? 'Category' : 'Brand'} created safely.`);
        closeModal();
        fetchTaxonomyData(); // রিফ্রেশ ডাটা
    } catch (error) {
        alert(error.response?.data?.message || "Failed to sync structural input.");
    }
};

// 🔒 ডিলিট অ্যাকশন (Strict Admin Check)
const terminateItem = async (id) => {
    if (!id) return;
    if (confirm(`🚨 WARNING: Are you sure you want to delete this item from ${activeTab.value}?`)) {
        try {
            // আপনার api.php অ্যাডমিন প্রিফিক্স অনুযায়ী ডিলিট রুট ফিক্স
            await axiosClient.delete(`/admin/${activeTab.value}/${id}`);
            fetchTaxonomyData();
            alert("Record purged successfully.");
        } catch (error) {
            alert(error.response?.data?.message || "Purge execution denied by server core.");
        }
    }
};

onMounted(() => {
    fetchTaxonomyData();
});
</script>

<style scoped>
.x-small {
    font-size: 11px;
}

.cursor-pointer {
    cursor: pointer;
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1040;
}

.modal {
    z-index: 1050;
}

.nav-tabs .nav-link {
    border: none;
    color: #6c757d;
}

.nav-tabs .nav-link.active {
    border-bottom: 3px solid #0d6efd;
    background: transparent;
}
</style>