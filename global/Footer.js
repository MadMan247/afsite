const date = new Date().getFullYear();

const footerHTML = `
    <ul>
         <li><a
                href="mailto:gloomofficial87@gmail.com"
                title="Please contact us here for gigs"
               >Contact Us!</a></li>
            <li><a href="about.html" title="Who did this?! 🤣🤣🤣">About This Site</a></li>
            <li><a href="#" title="To make some fuckin doom metal, what do you think?">Our Mission</a></li>
            <li><a href="/pages/AFCast/" title="There's some zany people here">The Cast</a></li>
            <li><a
                    href="#"
                    title="Yes, this is ours, and not yours."
            >All Rights Reserved ©${date}</a></li>
         <li><a href="/sitemap_4432965.html" title="Who the actual fuck uses sitemaps anymore? Seriously. I'm putting this here half as a fucking joke. I mean, why not just navigate? It's really not that complicated. And this site map only includes uninteresting shit that's on this subdomain. Nothing from anything interesting, like the peer.acidfog.com site.">Sitemap?</a></li>
    </ul>
`

document.getElementById('footer').insertAdjacentHTML('afterbegin', footerHTML);