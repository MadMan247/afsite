const adJsonPath = '/data/highlights/adlinks.json';
const imgPath = '/data/images/highlights';

let adData;

export async function getData() {
    if (adData) {
        return;
    }

    return fetch(adJsonPath)
        .then(res => res.json())
        .then(json => {
           return adData = json;
        })
        .catch(err => console.log(err));
}

export function pickAdLink() {
    const randInt = Math.floor(Math.random() * adData.length);

    return adData[randInt];
}

export async function loadAds() {

    getData().then((res) => {
        res = null
        //Not sure if I need this but I'm too lazy to verify PALE MOON

        const adContainers = document.querySelectorAll(".ad-container");
        for (let adContainer of adContainers) {
            const adObj = pickAdLink();

            adContainer.innerHTML = ""; // clear

            const adLink = document.createElement("a");
            adLink.href = adObj.adLink;
            adLink.title = adObj.adTitle;
            adLink.target = "_blank";

            const adImg = document.createElement("img");
            adImg.src = `${imgPath}/${adObj.adFile}`;
            adImg.alt = adObj.adTitle;

            adLink.appendChild(adImg);
            adContainer.appendChild(adLink);
        }
    });

}

export async function loadAdsInElement(element) {
    getData().then((res) => {
        res = null;

        const adContainers = element.querySelectorAll('.ad-container');
        for (let adContainer of adContainers) {
            const adObj = pickAdLink();

            adContainer.innerHTML = ""; // clear

            const adLink = document.createElement("a");
            adLink.href = adObj.adLink;
            adLink.title = adObj.adTitle;

            const adImg = document.createElement("img");
            adImg.src = `${imgPath}/${adObj.adFile}`;
            adImg.alt = adObj.adTitle;

            adLink.appendChild(adImg);
            adContainer.appendChild(adLink);
        }
    });
}


getData().then(() => {
    loadAds();
});
