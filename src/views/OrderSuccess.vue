<template>
    <div class="order-success-page bg-white min-vh-100 d-flex align-items-center">
        <div class="container text-center">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="success-icon-wrapper mb-4">
                        <div class="success-circle shadow-lg mx-auto d-flex align-items-center justify-content-center">
                            <i class="bi bi-check-lg text-white display-1"></i>
                        </div>
                    </div>

                    <h1 class="fw-bold text-dark mb-3">Order Placed Successfully!</h1>
                    <p class="text-muted fs-5 mb-5 px-md-5">
                        Thank you for your purchase, <span class="text-dark fw-bold">Pial</span>!
                        Your order has been received and is being processed.
                        A confirmation email has been sent to your inbox.
                    </p>

                    <div class="card border-0 bg-light-subtle rounded-4 p-4 mb-5 shadow-sm">
                        <div class="row text-start g-3">
                            <div class="col-6">
                                <span class="text-muted small text-uppercase fw-bold">Order Number</span>
                                <p class="mb-0 fw-bold text-primary">#COM-{{ Math.floor(Math.random() * 100000) }}</p>
                            </div>
                            <div class="col-6 text-end">
                                <span class="text-muted small text-uppercase fw-bold">Date</span>
                                <p class="mb-0 fw-bold">{{ new Date().toLocaleDateString() }}</p>
                            </div>
                            <div class="col-6">
                                <span class="text-muted small text-uppercase fw-bold">Payment Method</span>
                                <p class="mb-0 fw-bold">Cash on Delivery</p>
                            </div>
                            <div class="col-6 text-end">
                                <span class="text-muted small text-uppercase fw-bold">Estimated Delivery</span>
                                <p class="mb-0 fw-bold text-success">3-5 Business Days</p>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex flex-column flex-md-row gap-3 justify-content-center">
                        <router-link to="/"
                            class="btn btn-dark btn-lg px-5 rounded-pill fw-bold shadow-sm py-3 transition-all">
                            <i class="bi bi-house-door me-2"></i> Back to Home
                        </router-link>
                        <button @click="printReceipt"
                            class="btn btn-outline-dark btn-lg px-5 rounded-pill fw-bold py-3 transition-all">
                            <i class="bi bi-printer me-2"></i> Print Receipt
                        </button>
                    </div>

                    <p class="mt-5 text-muted small">
                        Need help? <a href="#" class="text-primary text-decoration-none">Contact our support team</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const printReceipt = () => {
    window.print();
};
</script>

<style scoped>
.order-success-page {
    font-family: 'Inter', sans-serif;
}

/* সাকসেস আইকন এনিমেশন */
.success-circle {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #0d6efd, #0dcaf0);
    border-radius: 50%;
    animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleUp {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.transition-all {
    transition: all 0.3s ease;
}

.btn-dark:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

@media print {

    .btn,
    nav,
    .success-icon-wrapper {
        display: none !important;
    }

    .card {
        border: 1px solid #ddd !important;
    }
}
</style>