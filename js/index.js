let allProducts = [];
let selectedCategoryId = null;

async function loadCategories() {
    const categories = await getCategories();
    const container = document.getElementById("categoryFilter");

    // "All" button
    const allBtn = document.createElement("button");
    allBtn.textContent = "All";
    allBtn.classList.add("active");
    allBtn.addEventListener("click", () => filterByCategory(null, allBtn));
    container.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat.name;
        btn.addEventListener("click", () => filterByCategory(cat.id, btn));
        container.appendChild(btn);
    });
}

function filterByCategory(categoryId, clickedBtn) {
    selectedCategoryId = categoryId;

    // Sagle buttons che 'active' class kadh, fakt clicked la laav
    document.querySelectorAll("#categoryFilter button").forEach(b => b.classList.remove("active"));
    clickedBtn.classList.add("active");

    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    const productsToShow = selectedCategoryId
        ? allProducts.filter(p => p.category.id === selectedCategoryId)
        : allProducts;

    if (productsToShow.length === 0) {
        grid.innerHTML = "<p>No products found.</p>";
        return;
    }

    productsToShow.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.imageUrl || 'https://via.placeholder.com/200x150?text=Furniture'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.material || ''}</p>
            <p class="price">₹${product.price}</p>
            <button onclick="handleAddToCart(${product.id})">Add to Cart</button>
        `;

        grid.appendChild(card);
    });
}

async function handleAddToCart(productId) {
    if (!isLoggedIn()) {
        alert("Please login first to add items to cart.");
        window.location.href = "login.html";
        return;
    }

    try {
        await addToCart(productId, 1);
        alert("Added to cart!");
    } catch (err) {
        alert("Error: " + err.message);
    }
}

async function init() {
    try {
        allProducts = await getProducts();
        renderProducts();
        await loadCategories();
    } catch (err) {
        document.getElementById("productGrid").innerHTML = "<p>Error loading products: " + err.message + "</p>";
    }
}

init();