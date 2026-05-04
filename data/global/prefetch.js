document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            prefetch(link.href);
        });
    });
});

function prefetch(url) {
    if (!url) return;

    // Check if the link is already prefetched
    const existingPrefetch = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
    if (existingPrefetch) return;

    // Create a prefetch link
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);

    //Yabba Dabba Do, check if that link is directed toward a local resource. If foreign, preconnect?

    console.log(`Prefetched: ${url}`);
} //Bless Up! On my momma! ChatGPT 4 tha win!