document.addEventListener('DOMContentLoaded', function() {
    const toTopButton = document.querySelector('.to-top-icon');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            toTopButton.classList.add('active');
        } else {
            toTopButton.classList.remove('active');
        }
    });

    toTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
