const ART = {
    "Sofa": ["🛋️", "#e8e0d5"],
    "Table": ["🍽️", "#e6dccf"],
    "Bed": ["🛏️", "#dfe4ea"],
    "Chair": ["🪑", "#ebe3d6"],
    "Door": ["🚪", "#e4d9cc"],
    "Home Decor": ["🖼️", "#efe2e2"],
    "Kitchen and Dining": ["🍴", "#dde6dc"],
    "Metal Legs": ["🔩", "#e1e3e6"]
};

function categoryArt(name) {
    const a = ART[name] || ["🛋️", "#eeeeee"];
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>"
        + "<rect width='100%' height='100%' fill='" + a[1] + "'/>"
        + "<text x='50%' y='52%' font-size='96' text-anchor='middle' dominant-baseline='middle'>" + a[0] + "</text>"
        + "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function goToDetail(productId) {
    window.location.href = "product-detail.html?id=" + productId;
}

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
            const catName = product.category ? product.category.name : "";
            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <img alt="${product.name}" style="cursor:pointer;">
                <h3 style="cursor:pointer;">${product.name}</h3>
                <p>${product.color || ""} · ${product.material || ""}</p>
                <p class="price">₹${product.price}</p>
                <button>View Details</button>
            `;

            const img = card.querySelector("img");
            img.src = product.imageUrl || categoryArt(catName);
            img.onerror = () => { img.onerror = null; img.src = categoryArt(catName); };

            card.querySelectorAll("img, h3, button").forEach(el =>
                el.addEventListener("click", () => goToDetail(product.id))
            );

            grid.appendChild(card);
        });
    } catch (err) {
        grid.innerHTML = "<p>Error loading designs: " + err.message + "</p>";
    }
}

loadDesigns();