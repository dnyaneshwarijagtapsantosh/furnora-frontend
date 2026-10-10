function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

async function initCheckout() {
    if (!isLoggedIn()) {
        alert("Please login to continue.");
        window.location.href = "login.html";
        return;
    }

    let cart;
    try {
        cart = await getCart();
    } catch (err) {
        document.getElementById("orderSummary").innerHTML = "<p>Could not load your cart. Please login again.</p>";
        return;
    }

    if (!cart.items || cart.items.length === 0) {
        document.querySelector(".checkout-layout").style.display = "none";
        document.getElementById("emptyMsg").style.display = "block";
        return;
    }

    renderSummary(cart);
}

function renderSummary(cart) {
    let total = 0;
    let rows = "";

    cart.items.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        rows += `
            <div class="summary-row">
                <span>${escapeHtml(item.product.name)} × ${item.quantity}</span>
                <span>₹${itemTotal}</span>
            </div>`;
    });

    document.getElementById("orderSummary").innerHTML = `
        <h2>Order Summary</h2>
        ${rows}
        <div class="summary-total"><span>Total</span><span>₹${total}</span></div>
    `;
}

// Online payment nivadla tar demo chi suchana dakhav
document.querySelectorAll("input[name='payment']").forEach(radio => {
    radio.addEventListener("change", () => {
        const selected = document.querySelector("input[name='payment']:checked").value;
        document.getElementById("onlineNote").style.display = selected === "ONLINE" ? "block" : "none";
    });
});

document.getElementById("checkoutForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const customerName = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const address = document.getElementById("custAddress").value.trim();
    const paymentMethod = document.querySelector("input[name='payment']:checked").value;

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }
    if (address.length < 10) {
        alert("Please enter your full delivery address.");
        return;
    }

    const btn = document.getElementById("placeOrderBtn");
    btn.disabled = true;
    btn.textContent = "Placing order...";

    try {
        const order = await apiFetch("/orders/checkout", {
            method: "POST",
            body: JSON.stringify({ customerName, phone, address, paymentMethod })
        });
        showConfirmation(order);
    } catch (err) {
        alert("Could not place the order. Please check your cart and try again.");
        btn.disabled = false;
        btn.textContent = "Place Order";
    }
});

function showConfirmation(order) {
    document.querySelector(".checkout-layout").style.display = "none";

    const paymentText = order.paymentMethod === "ONLINE"
        ? "Online Payment: Paid (Demo, no real money charged)"
        : "Cash on Delivery: pay when your order arrives";

    const box = document.getElementById("confirmation");
    box.innerHTML = `
        <div class="confirm-card">
            <div class="confirm-icon">✅</div>
            <h2>Your order is confirmed!</h2>
            <p>Thank you, ${escapeHtml(order.customerName)}. Your order <strong>#${order.id}</strong> has been placed.</p>
            <table class="detail-specs">
                <tr><td>Deliver to</td><td>${escapeHtml(order.address)}</td></tr>
                <tr><td>Phone</td><td>${escapeHtml(order.phone)}</td></tr>
                <tr><td>Payment</td><td>${paymentText}</td></tr>
                <tr><td>Total</td><td>₹${order.totalAmount}</td></tr>
            </table>
            <a href="orders.html" class="btn-link primary">View My Orders</a>
            <a href="index.html" class="btn-link">Continue Shopping</a>
        </div>
    `;
    box.style.display = "block";
    window.scrollTo(0, 0);
}

initCheckout();