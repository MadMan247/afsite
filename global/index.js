// Add all global utils here, silly goose

export const SiteLinks = {
    events: '/pages/events',
    cast: '/pages/AFCast',
    trivia: '/pages/trivia/trivia.html',
    sotm: '/pages/sotm',

    articles: '/articles',

    contactUs: '/pages/contact-us',

    funkwhale: 'https://music.acidfog.com/channels/acid_fog',
    spotify: 'https://open.spotify.com/artist/3JXrxOSYCRqrwIBF5KFNqO',
    amazon: 'https://music.amazon.com/artists/B0BZ73TD6K/acid-fog',
    ytMusic: 'https://www.youtube.com/channel/UCEBjp8Ghj1HVw5sI9mZ73fg',
    bandcamp: 'https://acidfog87.bandcamp.com/',
    peertube: 'https://peer.acidfog.com/'
}

const toTopButton = document.getElementById('scroll-to-top-btn');

if (toTopButton) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            toTopButton.style.visibility = 'visible';
        } else {
            toTopButton.style.visibility = 'hidden';
        }
    });

    toTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}