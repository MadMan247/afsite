// Navigation
const pages = {
  'index': 'Home',
  'thefogiscoming': 'The Fog is Coming',
  'merch': 'Merch',
  'upcomingshows': 'Upcoming Shows',
  'images': 'Images',
  'members': 'Members'
};

const navigation = document.getElementById("navigation");
const current_page = window.location.pathname.split('/').pop().split('.')[0] || 'index';

let navHtml = '<nav><ul>';
for (const file in pages) {
  const activeClass = (current_page === file) ? 'active' : '';
  navHtml += `<li class="${activeClass}"><a href="${file}.html">${pages[file]}</a></li>`;
}
navHtml += '</ul></nav>';
navigation.innerHTML = navHtml;

// Parallax effect
const parallaxImage = document.getElementById("parallaxImage");
window.addEventListener("scroll", () => {
  const offset = window.pageYOffset;
  parallaxImage.style.backgroundPositionY = `${offset * 0.2}px`;
});

// Footer year
document.getElementById("currentYear").textContent = new Date().getFullYear();

