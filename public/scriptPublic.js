import serverLogicPublic from "./serverLogicPublic.js";

document.addEventListener('scroll', function() {
    console.log("scrolling");
    
    // check if user came to the end of the website
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight-200) {
        console.log('Dotarłeś do końca strony!');
    }
});

function addImage(animation) {
    const imagesDiv = document.getElementById('imagesDiv');
    const img = document.createElement('img');
    img.src = animation.previewImage;
    //id animacji img.alt = 'Dynamic Image';
    imagesDiv.appendChild(img);
}


async function addanim() {
    const animations = await serverLogicPublic.getSomePublicAnimations(3);
    console.log("animacje",animations);
    
    for (const animation of animations) {
        addImage(animation);
    }
}
document.getElementById("addanim").addEventListener("click", addanim);

addImage({"previewImage" :'https://placehold.co/450x400'});
addImage({"previewImage" :'https://placehold.co/450x400'});
addImage({"previewImage" :'https://placehold.co/450x400'});