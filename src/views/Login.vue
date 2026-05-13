<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card shadow-lg border-0">
                    <div class="card-header bg-primary text-white text-center py-4">
                        <h3 class="mb-0">Commercia Pro</h3>
                        <small>Log in to your dashboard</small>
                    </div>
                    <div class="card-body p-4">
                        <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
                            {{ errorMessage }}
                            <button type="button" class="btn-close" @click="errorMessage = ''"></button>
                        </div>

                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email Address</label>
                                <input type="email" v-model="form.email" class="form-control" id="email"
                                    placeholder="example@mail.com" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" v-model="form.password" class="form-control" id="password"
                                    placeholder="******" required>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary py-2" :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                    {{ loading ? 'Processing...' : 'Log In' }}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer text-center py-3">
                        <p class="mb-0">Have An Account? <router-link to="/register" class="text-primary">Register
                                Here</router-link></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
    email: '',
    password: ''
});

const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
    loading.value = true;
    errorMessage.value = '';

    try {
        await authStore.login(form);
        // if login is successful, redirect to dashboard
        router.push({ name: 'Dashboard' });
    } catch (error) {
        // handle different error scenarios from the server response
        if (error.response && error.response.status === 401) {
            errorMessage.value = "Email or password is incorrect. Please try again.";
        } else {
            errorMessage.value = "There was an error connecting to the server. Please try again.";
        }
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.card {
    border-radius: 15px;
}

.card-header {
    border-radius: 15px 15px 0 0 !important;
}

.btn-primary {
    border-radius: 8px;
    font-weight: 600;
}
</style>