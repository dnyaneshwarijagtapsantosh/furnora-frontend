function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function loadProductDetail() {
    const productId = getProductIdFromUrl();

    if (!productId) {
        document.getElementById("productDetail").innerHTML = "<p>Product not found.</p>";
        return;
    }

    try {
        const product = await apiFetch("/products/" + productId);
        renderProductDetail(product);
    } catch (err) {
        document.getElementById("productDetail").innerHTML = "<p>Error loading product: " + err.message + "</p>";
    }
}

function renderProductDetail(product) {
    const container = document.getElementById("productDetail");

    container.innerHTML = `
        <div class="detail-container">
            <div class="detail-image">
               <img src="${product.imageUrl || placeholderFor(product.category ? product.category.name : '')}" alt="${product.name}" onerror="this.onerror=null;this.src=placeholderFor('${product.category ? product.category.name : ''}')">
            </div>
            <div class="detail-info">
                <h1>${product.name}</h1>
                <p class="detail-price">₹${product.price}</p>
                <p class="detail-desc">${product.description || ''}</p>

                <table class="detail-specs">
                    <tr><td>Category</td><td>${product.category ? product.category.name : '-'}</td></tr>
                    <tr><td>Material</td><td>${product.material || '-'}</td></tr>
                    <tr><td>Dimensions</td><td>${product.dimensions || '-'}</td></tr>
                    <tr><td>Color</td><td>${product.color || '-'}</td></tr>
                    <tr><td>Warranty</td><td>${product.warranty || '-'}</td></tr>
                    <tr><td>Return Policy</td><td>${product.returnPolicy || '-'}</td></tr>
                    <tr><td>Availability</td><td>${product.stock > 0 ? product.stock + ' in stock' : 'Out of stock'}</td></tr>
                </table>

                <div class="detail-qty">
                    <label>Quantity:</label>
                    <button onclick="changeQty(-1)">-</button>
                    <span id="qtyValue">1</span>
                    <button onclick="changeQty(1)">+</button>
                </div>

                <button class="detail-add-btn" onclick="handleDetailAddToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
}

let currentQty = 1;

function changeQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    document.getElementById("qtyValue").textContent = currentQty;
}

async function handleDetailAddToCart(productId) {
    if (!isLoggedIn()) {
        alert("Please login first to add items to cart.");
        window.location.href = "login.html";
        return;
    }

    try {
        await addToCart(productId, currentQty);
        alert("Added " + currentQty + " item(s) to cart!");
    } catch (err) {
        alert("Error: " + err.message);
    }
}

loadProductDetail();