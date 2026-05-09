window.addEventListener('DOMContentLoaded', function () {
    var yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
