<template>
    <div class="unauthorized-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div class="text-center p-5 bg-white rounded-4 shadow-sm max-width-500">
            <div class="icon-box mb-4 text-danger">
                <i class="bi bi-shield-lock-fill display-1"></i>
            </div>

            <h2 class="fw-bold text-dark mb-2">Access Denied (403)</h2>
            <p class="text-muted mb-4">
                Sorry, you do not have the required clearance level to access the Commercia Pro control pipeline
                workspace.
            </p>

            <div class="d-flex gap-3 justify-content-center">
                <router-link to="/dashboard" class="btn btn-dark px-4 py-2 rounded-3 fw-bold small">
                    <i class="bi bi-speedometer2 me-1"></i> Back to Dashboard
                </router-link>
                <router-link to="/" class="btn btn-outline-secondary px-4 py-2 rounded-3 fw-bold small">
                    <i class="bi bi-house-door me-1"></i> Market Home
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
// এখানে কোনো অতিরিক্ত লজিকের প্রয়োজন নেই, এটি একটি পিওর স্ট্যাটিক অ্যালার্ট ভিউ
</script>

<style scoped>
.max-width-500 {
    max-width: 500px;
    width: 100%;
}

.icon-box i {
    filter: drop-shadow(0px 4px 10px rgba(220, 53, 69, 0.2));
}
</style>