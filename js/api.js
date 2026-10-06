const BASE_URL = "http://localhost:8080/api";

// Token localStorage madhun ghenyasathi
function getToken() {
    return localStorage.getItem("token");
}

// Login status check karnyasathi
function isLoggedIn() {
    return getToken() !== null;
}

// Logout - token kadhun tak
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Generic fetch wrapper - Authorization header automatically jodto
async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(BASE_URL + endpoint, {
        ...options,
        headers
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Something went wrong");
    }

    // DELETE requests kahi vela rikama body deतात
    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

// ===== Category/Product APIs =====
function getCategories() {
    return apiFetch("/categories");
}

function getProducts() {
    return apiFetch("/products");
}

function getProductsByCategory(categoryId) {
    return apiFetch("/products/category/" + categoryId);
}

// ===== Auth APIs =====
function registerUser(data) {
    return apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

async function loginUser(data) {
    const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
    });
    localStorage.setItem("token", result.token);
    return result;
}

// ===== Cart APIs =====
function getCart() {
    return apiFetch("/cart");
}

function addToCart(productId, quantity) {
    return apiFetch("/cart/add", {
        method: "POST",
        body: JSON.stringify({ productId, quantity })
    });
}

function updateCartItem(cartItemId, quantity) {
    return apiFetch("/cart/item/" + cartItemId, {
        method: "PUT",
        body: JSON.stringify({ quantity })
    });
}

function removeCartItem(cartItemId) {
    return apiFetch("/cart/item/" + cartItemId, {
        method: "DELETE"
    });
}

// ===== Order APIs =====
function checkout() {
    return apiFetch("/orders/checkout", {
        method: "POST"
    });
}

function getMyOrders() {
    return apiFetch("/orders");
}

// ===== Navbar update (sagle pages var vaparla jaईल) =====
function updateNavbar() {
    const authLink = document.getElementById("authLink");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!authLink || !logoutBtn) return;

    if (isLoggedIn()) {
        authLink.style.display = "none";
        logoutBtn.style.display = "inline-block";
        logoutBtn.addEventListener("click", logout);
    } else {
        authLink.style.display = "inline-block";
        logoutBtn.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", updateNavbar);