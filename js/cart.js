function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function groupHeading(dayTime) {
    if (dayTime === 0) return "Added earlier";

    const day = new Date(dayTime);
    const diff = Math.round((startOfDay(new Date()) - day) / 86400000);
    const dateText = day.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

    if (diff === 0) return "Today · " + dateText;
    if (diff === 1) return "Yesterday · " + dateText;
    return "Added on " + dateText;
}

async function loadCart() {
    if (!isLoggedIn()) {
        alert("Please login to view your cart.");
        window.location.href = "login.html";
        return;
    }

    try {
        const cart = await getCart();
        renderCart(cart);
    } catch (err) {
        document.getElementById("cartItems").innerHTML = "<p>Error loading cart: " + err.message + "</p>";
    }
}

function renderCart(cart) {
    const container = document.getElementById("cartItems");
    const summary = document.getElementById("cartSummary");
    container.innerHTML = "";

    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        summary.innerHTML = "";
        return;
    }

    // Divsa pramane gat kar (0 = junya items, jyanchi date nahi)
    const groups = {};
    cart.items.forEach(item => {
        const key = item.addedAt ? startOfDay(new Date(item.addedAt)).getTime() : 0;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    });

    let total = 0;

    // Junya divsa pasun navin divsa kade
    Object.keys(groups).map(Number).sort((a, b) => a - b).forEach(dayTime => {
        const line = document.createElement("div");
        line.classList.add("date-line");
        line.innerHTML = `<span>${groupHeading(dayTime)}</span>`;
        container.appendChild(line);

        groups[dayTime].forEach(item => {
            const itemTotal = item.product.price * item.quantity;
            total += itemTotal;

            const div = document.createElement("div");
            div.classList.add("cart-item");

            div.innerHTML = `
                <div>
                    <h3>${item.product.name}</h3>
                    <p>₹${item.product.price} x ${item.quantity} = ₹${itemTotal}</p>
                </div>
                <div>
                    <button onclick="changeQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span style="margin: 0 10px;">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button onclick="handleRemove(${item.id})" style="margin-left: 15px; background: #c0392b;">Remove</button>
                </div>
            `;
            container.appendChild(div);
        });
    });

    summary.innerHTML = `
        <h2>Total: ₹${total}</h2>
        <button onclick="handleCheckout()" style="padding: 12px 30px; background: #5c4433; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Proceed to Checkout</button>
    `;
}

async function changeQuantity(cartItemId, newQuantity) {
    if (newQuantity < 1) {
        handleRemove(cartItemId);
        return;
    }

    try {
        const updatedCart = await updateCartItem(cartItemId, newQuantity);
        renderCart(updatedCart);
    } catch (err) {
        alert("Error: " + err.message);
    }
}

async function handleRemove(cartItemId) {
    try {
        const updatedCart = await removeCartItem(cartItemId);
        renderCart(updatedCart);
    } catch (err) {
        alert("Error: " + err.message);
    }
}

function handleCheckout() {
    window.location.href = "checkout.html";
}

loadCart();