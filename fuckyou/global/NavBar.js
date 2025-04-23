
function pathString() {
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split('/').filter(Boolean); // Removes empty segments
    const initialHome = 'http://localhost:3000';
    let s = '<ul class="dropdown">';
    let runningPath = '/';

    pathSegments.forEach((segment, index) => {
        runningPath += `${segment}/`;
        s += `<li><a href="${initialHome}${runningPath}">${decodeURIComponent(segment)}</a></li>`;
        if (index < pathSegments.length - 1) s += ' / ';
    });

    s += '</ul>';

    return s;
}

const nav = document.querySelector('nav');

const html = `
    <ul class="nav">
                <li style=""><a href="/">Home</a>
                ${pathString()}
                </li>
                <li><a href="#">Hear It</a>
                    <ul class="dropdown">
                        <li><a href="/pages/sotm/sotm.html" title="Maybe not so monthly, and a little more quarterly">Song of the Month</a></li>
                        <li><a href="https://music.acidfog.com" title="Acid Fog Related Music instance. I promise it isn't the name of a bad NFT series">Funkwhale</a></li>
                        <li><a href="https://open.spotify.com/artist/3JXrxOSYCRqrwIBF5KFNqO" title="At this point paying for spotify feels like an investment">Spotify</a></li>
                        <li><a href="https://music.amazon.com/artists/B0BZ73TD6K/acid-fog" title="More used than Pandora">Amazon Music</a></li>
                        <li><a href="https://www.youtube.com/channel/UCEBjp8Ghj1HVw5sI9mZ73fg" title="classic">YouTube Music</a></li>
                    </ul></li>
                <li><a href="#">Buy It</a>
                    <ul class="dropdown">
                        <li><a href="https://acidfog87.bandcamp.com/" title="Thank you in advance">Band Camp</a></li>
                        <li><a href="#" title="Still needs set up">Merch Store</a></li>
                    </ul></li>
                <li><a href="#">Watch It</a>
                    <ul class="dropdown">
                        <li><a href="https://peer.acidfog.com/videos/trending/" title="&quot;What is this xvideos knockoff looking-ass site&quot;">AF Tube</a></li>
                        <li><a href="https://www.youtube.com/@acidfogtapesofficial" title="Behind the scenes of the lives of Acid Fog">The Tapes</a></li>
                        <li><a href="https://www.youtube.com/@AcidFogOfficial87" title="The Official Acid Fog Youtube Channel">Acid Fog Official</a></li>
                    </ul></li>
                <li><a href="#">Check It</a>
                    <ul class="dropdown">
                        <li><a href="/articles" title="Acid-Fog-based article submissions welcome. Proper credit guaranteed.">Articles</a></li>
                        <li><a href="https://dumbrecs.com/bands/current-bands-2/acid-fog/" title="Check it, on the official Dumb Recs site???">Featured In</a></li>
                        <li><a href="./articles/Mellow.html" title="Article on the most recent Acid Fog release">Out NOW!</a></li>
                        <li><a href="/trivia.html" title="Some silly wacky zany trivia to pass the time">Trivia</a></li>
                        <li><a href="/calendar/pastevents.html" title="What Acid Fog events have you missed?">Past Events</a></li>
                        <li><a href="https://host.acidfog.com/wiki" title="A Wiki? That seems a little excessive, eh?">AFWiki</a></li>
                    </ul></li>
                <li><a href="#">Follow It</a>
                    <ul class="dropdown">
                        <li><a href="https://www.instagram.com/acid_fog_official_87/" title="Acid Fog is most active here">Instagram</a></li>
                        <li><a href="https://x.com/dumb_records/status/1768826427464384798" title="There is no Acid Fog Twitter, so this counts for that">Twitter</a></li>
                        <li><a href="https://www.facebook.com/p/Acid-Fog-100092044354492/" title="For your mom + please forward her to Mr. YMST">Facebook</a></li>
                    </ul></li>
    </ul>
`;

nav.insertAdjacentHTML('afterbegin', html);
document.body.offsetHeight;