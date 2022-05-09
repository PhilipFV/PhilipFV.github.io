window.onload = () => {
    var images = document.getElementsByClassName("img-zoom");

    for (const img of images) {
        img.style.cursor = "zoom-in";
        img.onclick = () => zoomimg(img);
    }
}

function zoomimg(img) {
    if (!img.src) return;
    // spawn image and div
    var div = document.createElement("div");
    div.style = `   position: fixed;
        z-index: 10000;
        top: 0;
        left: 0;
        display: grid;
        width: 100%;
        height: 100vh;
        background-color: rgb(0, 0, 0, 0.75);
        cursor: zoom-out;
        `
    div.innerHTML = `<img class="img-zoom" style="width: 60%; justify-self: center; align-self: center;" src="${img.src}" alt="Fat seal.">`
    div.onclick = () => div.remove()
    document.body.appendChild(div);
}