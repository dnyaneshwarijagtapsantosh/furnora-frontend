function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

async function loadOrders() {
    if (!isLoggedIn()) {
        alert("Please login to view your orders.");
        window.location.href = "login.html";
        return;
    }

    try {
        const orders = await getMyOrders();
        renderOrders(orders);
    } catch (err) {
        document.getElementById("ordersList").innerHTML = "<p>Error loading orders: " + err.message + "</p>";
    }
}

function renderOrders(orders) {
    const container = document.getElementById("ordersList");
    container.innerHTML = "";

    if (!orders || orders.length === 0) {
        container.innerHTML = "<p>You haven't placed any orders yet.</p>";
        return;
    }

    // Navin orders varti
    orders.slice().reverse().forEach(order => {
        const div = document.createElement("div");
        div.classList.add("order-card");
        div.style.flexDirection = "column";
        div.style.alignItems = "flex-start";

        const itemsHtml = order.items.map(item =>
            `<li>${escapeHtml(item.product.name)} x ${item.quantity} — ₹${item.price * item.quantity}</li>`
        ).join("");

        const orderDate = new Date(order.orderDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });

        // Junya orders madhe address nasto, tyamule check
        let deliveryHtml = "";
        if (order.address) {
            const paymentText = order.paymentMethod === "ONLINE"
                ? "Online Payment (Paid - Demo)"
                : "Cash on Delivery";
            deliveryHtml = `
                <p class="order-meta"><strong>Deliver to:</strong> ${escapeHtml(order.customerName)}, ${escapeHtml(order.address)}</p>
                <p class="order-meta"><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
                <p class="order-meta"><strong>Payment:</strong> ${paymentText}</p>
            `;
        }

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%;">
                <h3>Order #${order.id}</h3>
                <span class="status-badge">${order.status}</span>
            </div>
            <p style="color:#777; font-size:14px;">${orderDate}</p>
            <ul style="margin:10px 0; padding-left:20px;">${itemsHtml}</ul>
            ${deliveryHtml}
            <p class="price">Total: ₹${order.totalAmount}</p>
        `;

        container.appendChild(div);
    });
}

loadOrders();