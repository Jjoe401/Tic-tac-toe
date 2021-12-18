const playButton = document.getElementById('play-button');

function vanishWelcomePage() {
    const welcomePage = document.querySelector('.welcome-page');
    welcomePage.classList.add('vanish');
    const mainGameApp = document.getElementById("main-App");
    mainGameApp.classList.remove("hidden-main-App");
}

function loadMainAppScript() {
    const script = document.createElement('script');
    script.src = 'script/app.js';
    script.setAttribute('defer', 'true');
    document.head.append(script);
}

playButton.addEventListener("click", ()=> {
    setTimeout(loadMainAppScript, 1000);
    vanishWelcomePage();
});