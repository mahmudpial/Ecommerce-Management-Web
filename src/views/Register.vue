<template>
    <div class="register-page bg-light-subtle min-vh-100 d-flex align-items-center py-5">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
                        <div class="card-header bg-dark text-white text-center py-4 border-0">
                            <h3 class="fw-bold mb-1">Create Account</h3>
                            <p class="text-light opacity-75 small mb-0">Join Commercia Pro today</p>
                        </div>

                        <div class="card-body p-4 p-xl-5">
                            <div v-if="Object.keys(errors).length > 0" class="alert alert-danger small rounded-3">
                                <ul class="mb-0 ps-3">
                                    <li v-for="(error, index) in errors" :key="index">{{ error[0] }}</li>
                                </ul>
                            </div>

                            <form @submit.prevent="handleRegister">
                                <div class="mb-3">
                                    <label class="form-label small fw-bold">Full Name</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i
                                                class="bi bi-person text-muted"></i></span>
                                        <input type="text" v-model="form.name"
                                            class="form-control bg-light border-start-0 shadow-none"
                                            placeholder="Pial Mahmud" required>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label small fw-bold">Email Address</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i
                                                class="bi bi-envelope text-muted"></i></span>
                                        <input type="email" v-model="form.email"
                                            class="form-control bg-light border-start-0 shadow-none"
                                            placeholder="pial@example.com" required>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label small fw-bold">Password</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i
                                                class="bi bi-lock text-muted"></i></span>
                                        <input type="password" v-model="form.password"
                                            class="form-control bg-light border-start-0 shadow-none"
                                            placeholder="********" required>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label small fw-bold">Confirm Password</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i
                                                class="bi bi-shield-lock text-muted"></i></span>
                                        <input type="password" v-model="form.password_confirmation"
                                            class="form-control bg-light border-start-0 shadow-none"
                                            placeholder="********" required>
                                    </div>
                                </div>

                                <button type="submit"
                                    class="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm border-0 transition-all"
                                    :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                    {{ loading ? 'Creating Account...' : 'Sign Up Now' }}
                                </button>
                            </form>
                        </div>

                        <div class="card-footer bg-white border-0 text-center pb-4">
                            <p class="text-muted small">Already have an account?
                                <router-link to="/login" class="text-primary fw-bold text-decoration-none">Login
                                    Here</router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const loading = ref(false);
const errors = ref({});

const handleRegister = async () => {
    loading.value = true;
    errors.value = {};

    try {
        await authStore.register(form);
        // রেজিস্ট্রেশন সফল হলে সরাসরি ড্যাশবোর্ড বা হোম পেজে
        router.push({ name: 'Dashboard' });
    } catch (error) {
        if (error.response && error.response.data.errors) {
            errors.value = error.response.data.errors;
        } else {
            alert("Something went wrong. Please try again.");
        }
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.register-page {
    font-family: 'Inter', sans-serif;
}

.input-group-text {
    border: 1px solid #dee2e6;
}

.form-control {
    border: 1px solid #dee2e6;
    padding: 10px 15px;
}

.form-control:focus {
    border-color: #0d6efd;
}

.btn-primary {
    background-color: #0d6efd;
    transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
    background-color: #0b5ed7;
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(13, 110, 253, 0.2);
}

.transition-all {
    transition: all 0.3s ease;
}
</style>