import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

export async function loadArticle(title, id) {
    document.title = title;
    const articleRender = document.getElementById('current-article');

    fetch(`/fuckyou/articles/list/${id}`).then((res) => {
       return res.text();
    }).then((md) => {
        articleRender.innerHTML = marked.parse(md);
    });
}

export async function showArticles() {
    const main = document.getElementById("article-list");

    fetch("/fuckyou/data/articles/index.json").then((res) => {
        return res.json();
    }).then((list) => {
        for (let item of list) {
            const container = document.createElement("div");
            container.id = 'article-preview';
            container.className = 'article-preview';

            const preview = document.createElement("h3");
            preview.textContent = item.title;

            const clickable = document.createElement("a");
            clickable.href = `?id=${encodeURIComponent(item.id)}&title=${encodeURIComponent(item.title)}`;
            clickable.className = "article-link";

            clickable.onclick = (e) => {
                e.preventDefault();
                history.pushState({}, "", clickable.href);
                loadArticle(item.title, item.id);
            }

            container.append(preview);
            container.append(clickable);
            main.appendChild(container);
        }
    });
}

export function getQueryParams() {
    const params = new URLSearchParams(window.location.search);

    return {
        id: params.get("id"),
        title: params.get("title"),
    }
}

showArticles();

const { id, title } = getQueryParams();
if (id && title) {
    loadArticle(title, id);
}