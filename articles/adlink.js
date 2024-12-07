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

async function loadAds() {
    await fetch("/articles/adlinks.json").then(res => res.json())
        .then(json => {

            const adContainers = document.querySelectorAll(".ad-container");
            adContainers.forEach(container => {
                const randInt = Math.floor(Math.random() * json.length);

                let randomAd = json.splice(randInt, 1);
                randomAd = randomAd[0];

                container.innerHTML = ""; //prep with nothing

                //create and add properties to anchor and image
                const adLink = document.createElement("a");
                adLink.href = randomAd.adLink;
                adLink.title = randomAd.adTitle;

                const adImage = document.createElement("img");

                adImage.src = `/articles/ads/${randomAd.adFile}`;
                adImage.alt = randomAd.adTitle;

                //append those bitches
                adLink.appendChild(adImage);
                container.appendChild(adLink);

            });


        }).catch(err => console.log(err));

}



// loadAdLinks();
loadAds();