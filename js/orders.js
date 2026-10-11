// Junya orders sathi (jyanchi delivery date save nahi) fallback: order date + 1 divas
const FALLBACK_DELIVERY_DAYS = 1;

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
}

function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDate(date) {
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Backend chi "2026-10-12" date local date mhanun vaach
function parseLocalDate(text) {
    const [y, m, d] = text.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function getDeliveryDate(order) {
    if (order.expectedDeliveryDate) return parseLocalDate(order.expectedDeliveryDate);
    const d = startOfDay(new Date(order.orderDate));
    d.setDate(d.getDate() + FALLBACK_DELIVERY_DAYS);
    return d;
}

// Delivery date ali ki "Order Placed Successfully", tya aadhi "Order Confirmed"
function getStatus(order, deliveryDate) {
    if (order.status === "CANCELLED") return { text: "Cancelled", css: "cancelled" };
    if (startOfDay(new Date()) >= deliveryDate) return { text: "Order Placed Successfully ✅", css: "placed" };
    return { text: "Order Confirmed 🕒", css: "confirmed" };
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

        const deliveryDate = getDeliveryDate(order);
        const status = getStatus(order, deliveryDate);
        const arrived = startOfDay(new Date()) >= deliveryDate;

        let detailsHtml = "";
        if (order.status !== "CANCELLED") {
            detailsHtml += `<p class="order-meta"><strong>${arrived ? "Delivery date" : "Expected delivery"}:</strong> ${formatDate(deliveryDate)}</p>`;
        }

        // Junya orders madhe address nasto, tyamule check
        if (order.address) {
            const paymentText = order.paymentMethod === "ONLINE"
                ? "Online Payment (Paid - Demo)"
                : "Cash on Delivery";
            detailsHtml += `
                <p class="order-meta"><strong>Deliver to:</strong> ${escapeHtml(order.customerName)}, ${escapeHtml(order.address)}</p>
                <p class="order-meta"><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
                <p class="order-meta"><strong>Payment:</strong> ${paymentText}</p>
            `;
        }

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                <h3>Order #${order.id}</h3>
                <span class="status-badge ${status.css}">${status.text}</span>
            </div>
            <p style="color:#777; font-size:14px;">Ordered on ${formatDate(new Date(order.orderDate))}</p>
            <ul style="margin:10px 0; padding-left:20px;">${itemsHtml}</ul>
            ${detailsHtml}
            <p class="price">Total: ₹${order.totalAmount}</p>
        `;

        container.appendChild(div);
    });
}

loadOrders();