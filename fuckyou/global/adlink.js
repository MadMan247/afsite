// function loadAdLinks() {
//     const adContainers = document.querySelectorAll(".ad-container");
//
//     if (adContainers.length > 0) {
//         fetch("/articles/adlinks.txt")
//             .then(response => response.text())
//             .then(text => {
//                 const lines = text.split("\n").filter(line => line.trim() !== ''); // Filter out empty lines
//
//                 // Shuffle the ad links using Fisher-Yates algorithm
//                 for (let i = lines.length - 1; i > 0; i--) {
//                     const j = Math.floor(Math.random() * (i + 1));
//                     [lines[i], lines[j]] = [lines[j], lines[i]];
//                 }
//
//                 // Process each ad container
//                 adContainers.forEach((container, index) => {
//                     const adLine = lines[index % lines.length]; // Cycle through shuffled ads
//                     const [adFilename, url, hoverText] = adLine.split(" ");
//                     const formattedHoverText = hoverText.replace(/_/g, ' ');
//
//                     // Clear existing content in the container
//                     container.innerHTML = "";
//
//                     // Create an ad link
//                     const adLink = document.createElement("a");
//                     adLink.href = url;
//                     adLink.title = formattedHoverText;
//
//                     // Create an image element for the advertisement
//                     const adImage = document.createElement("img");
//                     adImage.src = "/articles/ads/" + adFilename;
//                     adImage.alt = formattedHoverText;
//
//                     // Append the ad image to the ad link
//                     adLink.appendChild(adImage);
//
//                     // Append the ad link to the ad container
//                     container.appendChild(adLink);
//                 });
//             })
//             .catch(error => {
//                 console.error("Failed to load ad links: " + error);
//             });
//     }
// }

// async function convertToJson() {
//
//     let json = await fetch("https://acidfog.com/articles/adlinks.txt").then(res => res.text())
//         .then(text => {
//            const lines = text.split("\n");
//            let jsonObj = [];
//
//            lines.forEach((line) => {
//                const adString = line.split(' ');
//                const adObj = {
//                    adFile: adString[0],
//                    adLink: adString[1],
//                    adTitle: adString[2].replaceAll('_', ' ')
//                }
//                jsonObj.push(adObj);
//            });
//           return jsonObj;
//         })
//         .catch((err) => {
//             console.error(err);
//         });
//
//     console.log(JSON.stringify(json));
// }

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
