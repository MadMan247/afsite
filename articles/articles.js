import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { loadAdsInElement } from "/global/adlink.js";

const JSON_PATH = "/data/articles/index.json";
const LIST_PATH = "/articles/list";

const articleStore = new Map();

export async function fetchAllArticles() {
  const main = document.getElementById("article-list");

  fetch(JSON_PATH)
    .then((res) => res.json())
    .then((data) => {
      data.map((articleCategory) => {
        const category = document.createElement("div");
        category.className = "category";

        const categoryName = document.createElement("h1");
        categoryName.textContent = articleCategory.name;

        category.appendChild(categoryName);

        for (const article of articleCategory.articles) {
          const container = document.createElement("div");
          container.id = article.id;
          container.className = "article-preview";

          const title = document.createElement("h2");
          title.textContent = article.title;

          const publishDate = document.createElement("small");
          publishDate.textContent = `Published on: ${article.timestamp}`;

          const summary = document.createElement("p");
          summary.textContent = article.summary;

          const clickable = document.createElement("a");
          clickable.href = `?article=${encodeURIComponent(article.id)}`;
          clickable.className = "article-link";

          clickable.onclick = (e) => {
            e.preventDefault();
            history.replaceState(null, "", clickable.href);
            loadArticle(article.title, article.id);
          };

          container.append(title, publishDate, summary, clickable);
          category.appendChild(container);

          articleStore.set(`${article.id}`, {
            title: article.title,
            parentId: article.id,
            articleId: `${article.id}-article`,
            parentEl: container,
            articleEl: null,
            open: false,
            rendered: false,
          });
        }

        main.appendChild(category);
      });
    });
}

export async function loadArticle(title, id) {
  document.title = title;

  const current = articleStore.get(id);

  if (!current) {
    return;
  }

  if (!current.rendered) {
    const articleContainer = document.createElement("div");
    articleContainer.id = current.articleId;
    articleContainer.className = "article-container";

    const articleRender = document.createElement("div");
    articleRender.id = "current-article";
    articleRender.className = "current-article";

    fetch(`${LIST_PATH}/${id}.md`)
      .then((res) => res.text())
      .then((text) => {
        articleRender.innerHTML = marked.parse(text);
      });

    const images = articleRender.querySelectorAll("img");
    for (const img of images) {
      img.stye.cursor = "zoom-in";

      img.addEventListener("click", () => {
        if (img.requestFullscreen || webkit.requestFullscreen) {
          img.requestFullscreen();
        }
      });
    }

    const adContainer = document.createElement("div");
    adContainer.classname = "ad-container";
    articleRender.appendChild(adContainer);

    loadAdsInElement(articleRender);

    current.articleEl = articleContainer;

    articleContainer.appendChild(articleRender);
    current.parentEl.after(articleContainer);

    current.rendered = true;
    current.open = true;

    current.articleEl.classList.add("active");
    current.parentEl.classList.add("active");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        current.articleEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  } else {
    if (current.open) {
      current.parentEl.classList.remove("active");
      current.articleEl.classList.remove("active");
      current.open = false;
    } else {
      current.parentEl.classList.add("active");
      current.articleEl.classList.add("active");
      current.open = true;
      requestAnimationFrame(() => {
        current.articleEl.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }
}

export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);

  return params.get("article");
}

fetchAllArticles().then(() => {
  const article = articleStore.get(getQueryParams);

  if (article) {
    loadArticle(article.title, article.parentId);
  }

  document.getElementById("loader").remove();
});
