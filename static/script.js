const openSection = document.getElementById("open-section");
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const protectedSection = document.getElementById("protected-section");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const welcomeMessage = document.getElementById("welcome-message");

let token = null;

// Показать открытую часть
function showOpen() {
    openSection.classList.remove("hidden");
    loginSection.classList.add("hidden");
    registerSection.classList.add("hidden");
    protectedSection.classList.add("hidden");
}

// Показать форму авторизации
function showLogin() {
    openSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    registerSection.classList.add("hidden");
    protectedSection.classList.add("hidden");
}

// Показать форму регистрации
function showRegister() {
    openSection.classList.add("hidden");
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
    protectedSection.classList.add("hidden");
}

// Войти
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok) {
            token = data.access_token;
            showProtected();
        } else {
            alert(data.error || "Ошибка авторизации");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

// Зарегистрироваться
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok) {
            alert("Регистрация прошла успешно. Теперь войдите в систему.");
            showLogin();
        } else {
            alert(data.error || "Ошибка регистрации");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});

// Показать закрытую часть
async function showProtected() {
    try {
        const response = await fetch("/protected", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();

        if (response.ok) {
            welcomeMessage.textContent = data.message;
            openSection.classList.add("hidden");
            loginSection.classList.add("hidden");
            registerSection.classList.add("hidden");
            protectedSection.classList.remove("hidden");
        } else {
            alert(data.error || "Ошибка доступа");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

// Выйти
function logout() {
    token = null;
    showOpen();
}
