export function submitArticle(e) {
    e.preventDefault();
    console.log("This works?");
}

export function scheduleEvent(e) {
    e.preventDefault();
}

document.getElementById('article-submit').addEventListener('click', submitArticle);