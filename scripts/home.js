document.addEventListener('DOMContentLoaded', () => {
    wave = document.getElementById("wave");
    wave.addEventListener( "mouseenter" , (event) => {event.target.innerHTML = "🖐️";});
    wave.addEventListener( "mouseleave" , (event) => {event.target.innerHTML = "👋";});
 }, false);