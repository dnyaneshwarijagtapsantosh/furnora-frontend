let isRegisterMode = false;

const form = document.getElementById("authForm");
const nameField = document.getElementById("nameField");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const toggleText = document.getElementById("toggleText");
const toggleLink = document.getElementById("toggleLink");

toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isRegisterMode = !isRegisterMode;

    if (isRegisterMode) {
        formTitle.textContent = "Register";
        submitBtn.textContent = "Register";
        nameField.style.display = "block";
        nameField.required = true;
        toggleText.textContent = "Already have an account?";
        toggleLink.textContent = "Login";
    } else {
        formTitle.textContent = "Login";
        submitBtn.textContent = "Login";
        nameField.style.display = "none";
        nameField.required = false;
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = "Register";
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        if (isRegisterMode) {
            const name = document.getElementById("nameField").value;
            await registerUser({ name, email, password });
            alert("Registration successful! Please login now.");
            toggleLink.click(); // Login mode kade switch kar
        } else {
            await loginUser({ email, password });
            alert("Login successful!");
            window.location.href = "index.html";
        }
    } catch (err) {
        alert("Error: " + err.message);
    }
});