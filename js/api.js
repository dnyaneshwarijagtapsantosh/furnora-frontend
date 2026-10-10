const BASE_URL = "http://localhost:8080/api";

// ===== Token: expire zala asel tar aapoaap kadhun takto =====
function isTokenExpired(token) {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;
    }
}

function getToken() {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        return null;
    }
    return token;
}

function isLoggedIn() {
    return getToken() !== null;
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ===== Image nasel tar category cha chitra dakhavto =====
const CATEGORY_ART = {
    "Sofa": ["🛋️", "#e8e0d5"],
    "Table": ["🍽️", "#e6dccf"],
    "Bed": ["🛏️", "#dfe4ea"],
    "Chair": ["🪑", "#ebe3d6"],
    "Door": ["🚪", "#e4d9cc"],
    "Home Decor": ["🖼️", "#efe2e2"],
    "Kitchen and Dining": ["🍴", "#dde6dc"],
    "Metal Legs": ["🔩", "#e1e3e6"]
};

function placeholderFor(categoryName) {
    const art = CATEGORY_ART[categoryName] || ["🛋️", "#eeeeee"];
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>"
        + "<rect width='100%' height='100%' fill='" + art[1] + "'/>"
        + "<text x='50%' y='52%' font-size='96' text-anchor='middle' dominant-baseline='middle'>" + art[0] + "</text>"
        + "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// ===== Generic fetch wrapper - Authorization header automatically jodto =====
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

// ===== Navbar update (sagle pages var vaparla jaail) =====
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