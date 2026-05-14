<template>
    <footer class="bg-dark text-white pt-5 pb-4 mt-5">
        <div class="container text-center text-md-start">
            <div class="row text-center text-md-start">

                <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                    <h5 class="mb-4 fw-bold text-primary">
                        <i class="bi bi-shop me-2"></i>Commercia Pro
                    </h5>
                    <p>we provide the best quality products and fast delivery. Your trusted online shopping partner.</p>
                </div>

                <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                    <h5 class="mb-4 fw-bold text-primary">Links</h5>
                    <p><router-link to="/" class="text-white text-decoration-none">Home</router-link></p>
                    <p><router-link to="/products" class="text-white text-decoration-none">Products</router-link></p>
                    <p><router-link to="/cart" class="text-white text-decoration-none">Shopping Cart</router-link></p>
                </div>

                <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                    <h5 class="mb-4 fw-bold text-primary">Help</h5>
                    <p><a href="#" class="text-white text-decoration-none">My Profile</a></p>
                    <p><a href="#" class="text-white text-decoration-none">Shipping Policy</a></p>
                    <p><a href="#" class="text-white text-decoration-none">Contact</a></p>
                </div>

                <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                    <h5 class=" mb-4 fw-bold text-primary">Contact</h5>
                    <p><i class="bi bi-house-door me-2"></i>Rajbari, Dhaka</p>
                    <p><i class="bi bi-envelope me-2"></i> info@commercia.pro</p>
                    <p><i class="bi bi-phone me-2"></i> +8801853754763</p>
                </div>

            </div>

            <hr class="mb-4">

            <div class="row align-items-center">
                <div class="col-md-7 col-lg-8">
                    <p class="text-center text-md-start">
                        © {{ new Date().getFullYear() }} All Rights Reserved by:
                        <a href="#" class="text-decoration-none text-primary"><strong>Pial Mahmud</strong></a>
                    </p>
                </div>

                <div class="col-md-5 col-lg-4">
                    <div class="text-center text-md-end">
                        <ul class="list-unstyled list-inline">
                            <li class="list-inline-item">
                                <a href="#" class="btn-floating btn-sm text-white" style="font-size: 23px;"><i
                                        class="bi bi-facebook"></i></a>
                            </li>
                            <li class="list-inline-item">
                                <a href="#" class="btn-floating btn-sm text-white" style="font-size: 23px;"><i
                                        class="bi bi-twitter-x"></i></a>
                            </li>
                            <li class="list-inline-item">
                                <a href="#" class="btn-floating btn-sm text-white" style="font-size: 23px;"><i
                                        class="bi bi-linkedin"></i></a>
                            </li>
                            <li class="list-inline-item">
                                <a href="#" class="btn-floating btn-sm text-white" style="font-size: 23px;"><i
                                        class="bi bi-github"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
footer {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

footer a:hover {
    color: #0d6efd !important;
    transition: 0.3s ease;
}

.list-inline-item a i:hover {
    color: #0d6efd;
}
</style>