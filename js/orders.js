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

    // Navin orders varti disave (id ulte kramane)
    orders.slice().reverse().forEach(order => {
        const div = document.createElement("div");
        div.classList.add("order-card");
        div.style.flexDirection = "column";
        div.style.alignItems = "flex-start";

        const itemsHtml = order.items.map(item =>
            `<li>${item.product.name} x ${item.quantity} — ₹${item.price * item.quantity}</li>`
        ).join("");

        const orderDate = new Date(order.orderDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%;">
                <h3>Order #${order.id}</h3>
                <span class="status-badge">${order.status}</span>
            </div>
            <p style="color:#777; font-size:14px;">${orderDate}</p>
            <ul style="margin:10px 0; padding-left:20px;">${itemsHtml}</ul>
            <p class="price">Total: ₹${order.totalAmount}</p>
        `;

        container.appendChild(div);
    });
}

loadOrders();