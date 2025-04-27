class Layout extends HTMLElement {
    headUrl = "/template/head.html";
    htmlUrl = "/template/layout.html";
    cssUrl = "/template/layout.css";

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async loadLayout() {
        try {

            // Load and inject head content
            const head = await fetch(this.headUrl);
            if (!head.ok) throw new Error(`Failed to load metadata!`);
            document.querySelector('head').innerHTML = await head.text();

            // Load layout template
            const layout = await fetch(this.htmlUrl);
            if (!layout.ok) throw new Error(`Failed to load layout from URL: ${this.htmlUrl}`);
            // document.querySelector('body').innerHTML = await layout.text();
            this.shadowRoot.innerHTML = await layout.text();
            this.addCss();


            const slot = this.shadowRoot.querySelector('slot');

            // If there's no explicit slot in the layout, create one
            if (!slot) {
                const defaultSlot = document.createElement('slot');
                this.shadowRoot.appendChild(defaultSlot);
            }

        } catch (err) {
            console.error('Error loading layout:', err);
            // Create a fallback slot if loading fails
            const fallbackSlot = document.createElement('slot');
            this.shadowRoot.appendChild(fallbackSlot);
        }
    }

    addCss() {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = this.cssUrl;

        this.shadowRoot.prepend(link);
    }

    connectedCallback() {
        this.loadLayout();
    }
}

customElements.define('default-layout', Layout);