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

    let total = 0;

    cart.items.forEach(item => {
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