import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { loadAds } from "/global/adlink.js";

const jsonPath = '/data/articles/index.json';
const listPath = '/articles/list';

console.log("ya browser old, doggiebone.");
// TODO: Refresh browser after changing navigation; dom becomes stale after render

export function loadArticle(title, id) {
    document.title = title;
    const articleRender = document.getElementById('current-article');

    return fetch(`${listPath}/${id}`)
        .then(res => res.text())
        .then(text => {
            articleRender.innerHTML = marked.parse(text);

            const images = articleRender.querySelectorAll('img');
            images.forEach(img => {
                img.style.cursor = "zoom-in";
                img.addEventListener("click", function () {
                    if (img.requestFullscreen) {
                        img.requestFullscreen();
                    }
                });
            });

            const selectedArticle = document.querySelector('[data-website-id="' + id + '"]');
            if (selectedArticle) {
                selectedArticle.style.border = "0.1rem solid #29bc25";
                selectedArticle.style.backgroundColor = "#1f1f1f";
            }

            const adContainer = document.createElement('div');
            adContainer.className = 'ad-container';
            articleRender.appendChild(adContainer);

            // return loadAds() to maintain the chain
            return loadAds();
        })
        .then(() => {
            const articleContainer = document.getElementById('article-container');
            const currentArticle = document.getElementById('current-article');

            articleContainer.style.visibility = 'visible';
            currentArticle.style.visibility = 'visible';

            // Scroll into view on next animation frame
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    currentArticle.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                });
            });
        })
        .catch(err => {
            console.error("Failed to load article:", err);
        });
}

export function showArticles() {
    const main = document.getElementById("article-list");

    return fetch(jsonPath)
        .then(res => res.json())
        .then(list => {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var container = document.createElement("div");
                container.dataset.websiteId = item.id;
                container.className = 'article-preview';

                var title = document.createElement("h2");
                title.textContent = item.title;

                var publishDate = document.createElement("small");
                publishDate.textContent = "Published on: " + item.timestamp;

                var summary = document.createElement("p");
                summary.textContent = item.summary;

                var clickable = document.createElement("a");
                clickable.href = "?id=" + encodeURIComponent(item.id) + "&title=" + encodeURIComponent(item.title);
                clickable.className = "article-link";

                clickable.onclick = function (e) {
                    e.preventDefault();
                    history.pushState({}, "", this.href);
                    loadArticle(item.title, item.id);
                    window.location.reload();
                }.bind({ href: clickable.href, title: item.title, id: item.id });

                container.appendChild(title);
                container.appendChild(publishDate);
                container.appendChild(summary);
                container.appendChild(clickable);
                main.appendChild(container);
            }

            const params = getQueryParams();
            if (params.id && params.title) {
                return loadArticle(params.title, params.id);
            }
        })
        .catch(err => {
            console.error("Failed to load article list:", err);
        });
}

export function getQueryParams() {
    var params = new URLSearchParams(window.location.search);
    return {
        id: params.get("id"),
        title: params.get("title"),
    };
}

// Run showArticles first, then maybe load an article
showArticles();

// Scroll-to-top button
var scrollBtn = document.getElementById('scroll-to-top-btn');
if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
        document.querySelector('html').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    });
}
