class SlotComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async setContent(htmlUrl, cssUrl) {
        try {
            const html = await fetch(htmlUrl);
            if (!html.ok) throw new Error(`Failed to load HTML from URL : ${htmlUrl}`);
            const htmlContent = await html.text();

            if (cssUrl) {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = cssUrl;
                this.shadowRoot.appendChild(cssLink);
            }

            this.shadowRoot.innerHTML = htmlContent;
        } catch (err) {
            console.error(err);
        }
    }
}

customElements.define('slot-content', SlotComponent);