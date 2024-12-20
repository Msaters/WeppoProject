var points = [];

const canvas = document.getElementById('canvas');
canvas.addEventListener('click', async (event) => {
    console.log(event);
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log({x, y});
    console.log("clientX: ", event.clientX);
    console.log("clientY: ", event.clientX);
    console.log("rectleft: ", rect.left);
    console.log("rectright: ", rect.right);
    points.push({"xcord": x, "ycord": y});


    // Wyświetl kliknięcie
    const point = document.createElement('div');
    point.style.position = 'absolute';
    point.style.width = '10px';
    point.style.height = '10px';
    point.style.backgroundColor = 'red';
    point.style.borderRadius = '50%';
    point.style.left = `${x - 5}px`;
    point.style.top = `${y - 5}px`;
    canvas.appendChild(point);

});

async function saveCordinates() {
     // Wyślij współrzędne do serwera
     const response = await fetch('/save-coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(points)
    });

    if (response.ok) {
        console.log('Współrzędne zapisane:', points);
    } else {
        console.error('Błąd podczas zapisu współrzędnych');
    }
    console.log(response)
}