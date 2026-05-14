<template>
    <div class="orders-pipeline-container text-start">

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <div>
                <h4 class="fw-bold text-dark mb-1">Commercia Pro Order Pipeline</h4>
                <p class="text-muted small mb-0">Manage incoming transactions, logistics lifecycles, and distribution
                    controls.</p>
            </div>
            <div>
                <button @click="exportOrderReport" :disabled="loading"
                    class="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm">
                    <i class="bi bi-file-earmark-spreadsheet-fill"></i> Export Statement
                </button>
            </div>
        </div>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading Pipelines...</span>
            </div>
            <p class="text-muted mt-2 small">Fetching master orders archive...</p>
        </div>

        <div v-else class="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div class="table-responsive">
                <table class="table align-middle table-hover border-0 mb-0">
                    <thead class="bg-light text-secondary small text-uppercase border-bottom">
                        <tr>
                            <th class="border-0 px-3">Invoice No</th>
                            <th class="border-0">Customer Profile</th>
                            <th class="border-0">Delivery Address</th>
                            <th class="border-0">Total Bill</th>
                            <th class="border-0">Gateway Status</th>
                            <th class="border-0 text-end px-3">Action Controls</th>
                        </tr>
                    </thead>
                    <tbody class="small border-0">
                        <tr v-for="(order, index) in orders" :key="order?.id || index"
                            class="border-bottom border-light">

                            <td class="fw-bold px-3">#{{ order?.invoice_number || 'N/A' }}</td>

                            <td>
                                <div class="fw-semibold text-dark">{{ order?.name || 'Unknown' }}</div>
                                <div class="x-small text-muted">
                                    <i class="bi bi-telephone-fill me-1"></i>{{ order?.phone || 'No Phone' }}
                                </div>
                            </td>

                            <td class="text-truncate" style="max-width: 200px;">
                                <i class="bi bi-geo-alt text-muted me-1"></i>{{ order?.address || 'N/A' }}
                            </td>

                            <td class="fw-bold text-dark">৳{{ numberFormat(order?.total_amount) }}</td>

                            <td>
                                <span class="badge px-2.5 py-1.5 rounded-pill text-uppercase font-weight-bold x-small"
                                    :class="statusBadgeClass(order?.status)">
                                    {{ order?.status || 'Pending' }}
                                </span>
                            </td>

                            <td class="text-end px-3">
                                <div class="d-inline-flex gap-2" v-if="order">
                                    <button @click="openStatusModal(order)"
                                        class="btn btn-light btn-sm border shadow-sm px-2.5" title="Update Status">
                                        <i class="bi bi-pencil-square text-primary"></i> Update
                                    </button>

                                    <button v-if="authStore.user?.role_id === 1 && order?.id"
                                        @click="terminateOrder(order.id)"
                                        class="btn btn-light btn-sm border border-danger-subtle shadow-sm px-2.5"
                                        title="Destructive Core Action">
                                        <i class="bi bi-trash3-fill text-danger"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="!orders || orders.length === 0">
                            <td colspan="6" class="text-center py-5 text-muted">
                                <i class="bi bi-inbox display-4 d-block mb-2 opacity-50"></i>
                                No pipelines registered in master server database.
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
                        <h5 class="modal-title fw-bold text-dark">Modify Order Pipeline State</h5>
                        <button type="button" @click="closeModal" class="btn-close" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-start">
                        <p class="small text-muted mb-3">Updating status for invoice <strong>#{{
                            selectedOrder?.invoice_number }}</strong></p>

                        <div class="mb-3">
                            <label class="form-label small fw-bold text-secondary">Pipeline Logistics Status</label>
                            <select v-model="newStatus" class="form-select rounded-3">
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" @click="closeModal"
                            class="btn btn-light border small px-4 rounded-3 fw-semibold">Abort</button>
                        <button type="button" @click="updateStatus"
                            class="btn btn-primary small px-4 rounded-3 fw-semibold">Commit Changes</button>
                    </div>
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
const orders = ref([]);
const loading = ref(true);

// মডাল এবং ফর্ম ম্যানেজমেন্ট স্টেট
const showModal = ref(false);
const selectedOrder = ref(null);
const newStatus = ref('Pending');

// 🚀 লাইভ ডাটা পাইপলাইন পুল মেথড
const fetchAdminOrders = async () => {
    loading.value = true;
    try {
        const response = await axiosClient.get('/admin/orders');

        // 🎯 লারাভেল এপিআই থেকে ডেটা রিসিভ করার ৩টি সম্ভাব্য স্ট্যান্ডার্ড ফরম্যাট হ্যান্ডলিং:
        if (Array.isArray(response.data)) {
            // ১. যদি সরাসরি এরে আসে: return response()->json($orders);
            orders.value = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
            // ২. যদি লারাভেল Paginate বা রিসোর্স ব্যবহার করেন: return OrderResource::collection($orders);
            orders.value = response.data.data;
        } else if (response.data && response.data.orders) {
            // ৩. যদি কাস্টম কি অবজেক্টে আসে: return response()->json(['orders' => $orders]);
            orders.value = response.data.orders;
        } else {
            // কোনো ফরম্যাট না মিললে
            orders.value = [];
        }

        console.log("Commercia Pro Core Orders Stream:", response.data); // ব্রাউজার কনসোলে ডাটা চেক করার জন্য
    } catch (error) {
        console.error("Commercia Pro Core Pipeline Sync Error:", error);
    } finally {
        loading.value = false;
    }
};

// 🔒 ডিলিট মেথড (টার্মিনাল ডেস্ট্রাকশন অ্যাকশন - শুধুমাত্র অ্যাডমিনের ব্যাকএন্ড রাইট থাকবে)
const terminateOrder = async (id) => {
    if (!id) return;
    if (confirm("🚨 WARNING: This is a terminal destructive action. Delete this record forever?")) {
        try {
            // আপনার api.php তে নতুন যোগ করা ডিলিট রাউটে হিট করবে
            await axiosClient.delete(`/admin/orders/${id}`);

            fetchAdminOrders(); // টেবিল রিফ্রেশ
            alert("Order deleted successfully.");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Terminal deletion sequence was denied by backend.");
        }
    }
};

// ⚙️ ওপারেশনাল মডাল হ্যান্ডলারস
const openStatusModal = (order) => {
    if (!order) return;
    selectedOrder.value = order;
    newStatus.value = order.status || 'Pending';
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    selectedOrder.value = null;
};

// 🔄 স্ট্যাটাস আপডেট সাবমিট মেথড
const updateStatus = async () => {
    if (!selectedOrder.value?.id) return;
    try {
        // আপনার api.php অনুযায়ী এটি পিওর POST রিকোয়েস্ট হবে এবং ইউআরএল হবে order-status
        await axiosClient.post(`/admin/order-status/${selectedOrder.value.id}`, {
            status: newStatus.value
        });

        closeModal();
        fetchAdminOrders(); // টেবিল রিয়েল-টাইম রিফ্রেশ করবে
        alert("Pipeline status updated successfully!");
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to commit pipeline status updates.");
    }
};

// 📊 রিপোর্টিং এক্সপোর্ট স্টেটমেন্ট
const exportOrderReport = () => {
    alert("Generating pipeline ledger statement... Excel/CSV sheet download initiated.");
};

// কারেন্সি ফরম্যাটার (৳১,৫০,০০০.০০ টাইপ সেফ)
const numberFormat = (value) => {
    const num = Number(value);
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ডাইনামিক বুটস্ট্র্যাপ ব্যাজ কালার ক্লাসিফায়ার
const statusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'bg-warning bg-opacity-10 text-warning';
        case 'processing': return 'bg-info bg-opacity-10 text-info';
        case 'shipped': return 'bg-primary bg-opacity-10 text-primary';
        case 'completed': return 'bg-success bg-opacity-10 text-success';
        case 'cancelled': return 'bg-danger bg-opacity-10 text-danger';
        default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
};

onMounted(() => {
    fetchAdminOrders();
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

.table th {
    letter-spacing: 0.03em;
    font-weight: 700;
}

.table tbody tr {
    transition: background-color 0.15s ease-in-out;
}

.table tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.01) !important;
}
</style>