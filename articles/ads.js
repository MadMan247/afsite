// JavaScript function to display random advertisements
function displayRandomAd() {
    const adContainer = document.querySelectorAll(".ad-container");

    if (adContainer.length > 0) {
        // Path to the "ads" folder
        const adsFolder = "ads/";

        // Array of advertisement filenames
        const adFilenames = ["ad1.jpg", "ad2.gif", "ad3.jpg"]; // Add more as needed

        // Randomly select an advertisement
        const randomAd = adFilenames[Math.floor(Math.random() * adFilenames.length)];

        // Create an image element for the advertisement
        const adImage = document.createElement("img");
        adImage.src = adsFolder + randomAd;
        adImage.alt = "Advertisement";

        // Append the advertisement image to the ad container
        adContainer.forEach(container => {
            container.appendChild(adImage.cloneNode(true));
        });
    }
}

// Call the function to display random advertisements
displayRandomAd();

