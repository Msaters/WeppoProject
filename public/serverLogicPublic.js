var lastDate = null;

async function getSomePublicAnimations(limit) {
    try {
        const url = lastDate ? `/getPublicAnimations?limit=${limit}&lastDate=${lastDate}` : `/getPublicAnimations?limit=${limit}&lastDate=0`;
        const response = await fetch(url);

        if(response.ok) {
            if(response.status === 204) {
                console.log("no more public animations to read");
                return;
            }

            const animations = await response.json();
            lastDate = animations[animations.length - 1].createdAt;
            console.log("done ok", animations);
            return animations;
        }

        switch (response.status) {
            case 404:
                console.log("there is no animations left")
                break;
            default:
                console.error("not suppoerted response status in reading public animations");
                break;
        }
    } catch(err) {
        console.error(err);
    }

    return null;
}

export default {
    getSomePublicAnimations
}