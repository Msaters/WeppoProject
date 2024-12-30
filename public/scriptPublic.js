import serverLogicPublic from "./serverLogicPublic.js";

const imagesDiv = document.getElementById("imagesDiv");
var isLoading = false;

imagesDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === 'img') {
        window.location.href = `./?id=${event.target.id}`;
    }
});

function addImage(animation) {
    const img = document.createElement('img');
    img.src = animation.previewImage;
    img.alt = "Canvas Image"
    img.id = animation.id;
    imagesDiv.appendChild(img);
}

async function addImages(limit) {
    isLoading = true;
    const animations = await serverLogicPublic.getSomePublicAnimations(limit);
    if(animations == null) {
        return;
    }

    for (const animation of animations) {
        addImage(animation);
    }
}

document.addEventListener("scroll", async function() {
    if(isLoading || serverLogicPublic.getIsLoaded()) {
        return;
    }

    var scrollPosition = window.scrollY;  // Current scroll position
    var documentHeight = document.documentElement.scrollHeight;  // Total height of the document
    var windowHeight = window.innerHeight;  // Height of the viewport

    // Check if the user is near the bottom of the page
    if (documentHeight - windowHeight - scrollPosition < 500) {
        await addImages(6);
    }
    isLoading = false;
});

const initialize = async function() {
    await addImages(6);
    isLoading = false;
}
initialize();
