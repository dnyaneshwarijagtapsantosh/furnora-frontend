// Cards cha kram (ani fakt hech 8 cards disatil)
const CATEGORY_ORDER = ["Bed", "Chair", "Sofa", "Table", "Door", "Home Decor", "Kitchen and Dining", "Metal Legs"];

// Card sathi swatachi photo havi asel tar ithe URL taak (rikama = aapoaap)
const CATEGORY_IMAGES = {
    "Bed": "",
    "Chair": "",
    "Sofa": "",
    "Table": "",
    "Door": "",
    "Home Decor": "",
    "Kitchen and Dining": "",
    "Metal Legs": ""
};

// Photo nasel tar category cha chitra
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

async function init() {
    const grid = document.getElementById("categoryGrid");

    try {
        const [categories, products] = await Promise.all([getCategories(), getProducts()]);

        const shown = categories
            .filter(c => CATEGORY_ORDER.includes(c.name))
            .sort((a, b) => CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name));

        grid.innerHTML = "";

        shown.forEach(cat => {
            const items = products.filter(p => p.category && p.category.id === cat.id);
            const withPhoto = items.find(p => p.imageUrl);
            const image = CATEGORY_IMAGES[cat.name] || (withPhoto ? withPhoto.imageUrl : categoryArt(cat.name));

            const card = document.createElement("div");
            card.className = "category-card";
            card.innerHTML = `
                <img alt="${cat.name}">
                <h3>${cat.name}</h3>
                <p>${items.length} designs</p>
                <button>View More</button>
            `;

            const img = card.querySelector("img");
            img.src = image;
            img.onerror = () => { img.onerror = null; img.src = categoryArt(cat.name); };

            card.addEventListener("click", () => {
                window.location.href = "products.html?category=" + cat.id;
            });

            grid.appendChild(card);
        });

        if (shown.length === 0) {
            grid.innerHTML = "<p>No categories available yet.</p>";
        }
    } catch (err) {
        grid.innerHTML = "<p>Error loading categories: " + err.message + "</p>";
    }
}

init();