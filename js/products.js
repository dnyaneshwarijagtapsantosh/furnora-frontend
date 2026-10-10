const PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%25' height='100%25' fill='%23eeeeee'/><text x='50%25' y='50%25' text-anchor='middle' fill='%23999999' font-size='24'>Furnora</text></svg>";

async function loadDesigns() {
    const categoryId = new URLSearchParams(window.location.search).get("category");
    const grid = document.getElementById("productGrid");

    if (!categoryId) {
        grid.innerHTML = "<p>Category not found.</p>";
        return;
    }

    try {
        const [categories, products] = await Promise.all([getCategories(), getProductsByCategory(categoryId)]);
        const cat = categories.find(c => String(c.id) === String(categoryId));
        document.getElementById("pageTitle").textContent = (cat ? cat.name : "Furniture") + " Designs";

        if (products.length === 0) {
            grid.innerHTML = "<p>No designs found.</p>";
            return;
        }

        products.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <img src="${product.imageUrl || PLACEHOLDER}" alt="${product.name}"
                     onerror="this.onerror=null;this.src=PLACEHOLDER"
                     onclick="goToDetail(${product.id})" style="cursor:pointer;">
                <h3 onclick="goToDetail(${product.id})" style="cursor:pointer;">${product.name}</h3>
                <p>${product.color || ''} · ${product.material || ''}</p>
                <p class="price">₹${product.price}</p>
                <button class="secondary-btn" onclick="goToDetail(${product.id})">View Details</button>
                <button onclick="handleAddToCart(${product.id})">Add to Cart</button>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        grid.innerHTML = "<p>Error loading designs: " + err.message + "</p>";
    }
}

function goToDetail(productId) {
    window.location.href = "product-detail.html?id=" + productId;
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

loadDesigns();