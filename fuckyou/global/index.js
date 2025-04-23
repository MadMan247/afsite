// Add all global utils here, silly goose

//FUCK I HATE JAVASCRIPT

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("path").textContent = window.location.pathname;
});

function copyPath() {
    navigator.clipboard.writeText(window.location.href)
    document.getElementById("path").textContent = "copied!";
    setTimeout(() => {
        document.getElementById("path").textContent = window.location.pathname;
    }, 2000);
}

