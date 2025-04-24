import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { loadAdsInElement } from "/global/adlink.js";

const jsonPath = '/data/articles/index.json';
const listPath = '/articles/list';

//No DOMContentLoaded event listener because this script should ALWAYS be deferred
//<script src="some-src" type="module" defer></script>

export async function loadArticle(title, id) {
    document.title = title;

    const current = document.querySelector(`[data-website-id="${id}-article"]`);

    if (!current) {
        const articleContainer = document.createElement('div');
        articleContainer.id = 'article-container';
        articleContainer.className = 'article-container';
        articleContainer.dataset.websiteId = `${id}-article`;

        const articleRender = document.createElement('div');
        articleRender.id = 'current-article';
        articleRender.className = 'current-article';

        const res = await fetch(`${listPath}/${id}`);
        const text = await res.text();
        articleRender.innerHTML = marked.parse(text);

        const images = articleRender.querySelectorAll('img');
        images.forEach(img => {
            img.style.cursor = "zoom-in"; // Optional: gives a visual cue

            img.addEventListener("click", () => {
                if (img.requestFullscreen) {
                    img.requestFullscreen();
                }
            });
        });
        // TODO: Make work on archaic browsers. OOGA BOOGA CAVEMAN "OOh, I'll use IE6 on my rockputer"
        const allArticles = document.querySelectorAll('.article-preview');
        allArticles.forEach(article => {
            article.style.border = "0.1rem solid lightgray";
            article.style.backgroundColor = "#1a1a1a";
        });

        const selectedArticle = document.querySelector(`[data-website-id="${id}"]`)
        selectedArticle.style.border = "0.1rem solid #29bc25";
        selectedArticle.style.backgroundColor = "#1f1f1f";

        const adContainer = document.createElement('div');
        adContainer.className = 'ad-container';
        articleRender.appendChild(adContainer);

        loadAdsInElement(articleRender);

        articleContainer.appendChild(articleRender);
        selectedArticle.after(articleContainer);

        // Wait for DOM update/render
        requestAnimationFrame(() => {
            //Do it twice because of the initial update, then the marked update
            requestAnimationFrame(() => {
                articleRender.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            });
        });
    } else {
        if (!current.classList.contains('inactive')) {
            current.classList.add('inactive');
            current.firstElementChild.classList.add('inactive');
        } else {
            current.classList.remove('inactive');
            current.firstElementChild.classList.remove('inactive');
            current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }

}

export async function showArticles() {
    const main = document.getElementById("article-list");

    const res = await fetch(jsonPath);
    const list = await res.json();

    /*
    * Edward,
    * Although I don't return the await promises, this works because of javascript implicity wrapping the promise in a return no matter what
    * I don't know how to fix this, nor do I want to because it works reliably.
    * You may ask why this race condition is no longer a race condition even if the for loop runs after all the other promises are resolved
    * This is because js doesn't return a resolved promise until after the loop runs (according to chipeetie)
    */

    for (let item of list) {
        const category = document.createElement("div");
        category.className = 'category';

        const categoryName = document.createElement("h1");
        categoryName.textContent = item.name;

        category.appendChild(categoryName);

        for (let article of item.articles) {
            const container = document.createElement("div");
            container.dataset.websiteId = article.id;
            container.className = 'article-preview';

            const title = document.createElement("h2");
            title.textContent = article.title;

            const publishDate = document.createElement("small");
            publishDate.textContent = `Published on: ${article.timestamp}`;

            const summary = document.createElement("p");
            summary.textContent = article.summary;

            const clickable = document.createElement("a");
            clickable.href = `?id=${encodeURIComponent(article.id)}&title=${encodeURIComponent(article.title)}`;
            clickable.className = "article-link";

            clickable.onclick = (e) => {
                e.preventDefault();
                history.pushState({}, "", clickable.href);
                loadArticle(article.title, article.id);
            }

            container.append(title, publishDate, summary, clickable);
            category.appendChild(container);
        }

        main.appendChild(category);
    }
}


export function getQueryParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        id: params.get("id"),
        title: params.get("title"),
    }
}

await showArticles().then(() => {
    const legacyScript = document.getElementById('legacy-script');
    if (legacyScript) {
        legacyScript.remove();
    }
    const { id, title } = getQueryParams();
    if (id && title) {
        loadArticle(title, id);
    }
});

document.getElementById('scroll-to-top-btn').addEventListener('click', (e) => {
    document.querySelector('html').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
});