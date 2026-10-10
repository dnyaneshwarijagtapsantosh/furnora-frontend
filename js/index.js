let allProducts = [];
let selectedCategoryId = null;

// Pills cha kram ithun thartho
const CATEGORY_ORDER = ["Bed", "Chair", "Sofa", "Table", "Door", "Home Decor", "Kitchen and Dining", "Metal Legs"];

async function loadCategories() {
    const categories = await getCategories();
    const container = document.getElementById("categoryFilter");

    const rank = name => {
        const i = CATEGORY_ORDER.indexOf(name);
        return i === -1 ? 999 : i;
    };
    categories.sort((a, b) => rank(a.name) - rank(b.name));

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
    document.querySelectorAll("#categoryFilter button").forEach(b => b.classList.remove("active"));
    clickedBtn.classList.add("active");
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    const productsToShow = selectedCategoryId
        ? allProducts.filter(p => p.category && p.category.id === selectedCategoryId)
        : allProducts;

    if (productsToShow.length === 0) {
        grid.innerHTML = "<p>No products found.</p>";
        return;
    }

    productsToShow.forEach(product => {
        const catName = product.category ? product.category.name : "";
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.imageUrl || placeholderFor(catName)}" alt="${product.name}"
                 onerror="this.onerror=null;this.src=placeholderFor('${catName}')"
                 onclick="goToDetail(${product.id})" style="cursor:pointer;">
            <h3 onclick="goToDetail(${product.id})" style="cursor:pointer;">${product.name}</h3>
            <p>${product.material || ''}</p>
            <p class="price">₹${product.price}</p>
            <button onclick="goToDetail(${product.id})">View Details</button>
        `;

        grid.appendChild(card);
    });
}

function goToDetail(productId) {
    window.location.href = "product-detail.html?id=" + productId;
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