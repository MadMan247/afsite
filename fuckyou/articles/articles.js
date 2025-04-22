import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

export async function loadArticle(title, id) {
    document.title = title;
    const articleRender = document.getElementById('current-article');

    document.getElementById('article-list').style.height = "fit-content";

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

            const clickable = document.createElement("button");
            clickable.id = "goto-article"
            clickable.ariaLabel = "Go to Article";
            clickable.onclick = () => loadArticle(item.title, item.id);

            container.append(preview);
            container.append(clickable);
            main.appendChild(container);
        }
    });
}

showArticles();