const $toggle = document.getElementById('theme-toggle');

$toggle.addEventListener("click", (e) =>{
    $toggle.classList.toggle("theme-toggle--toggled")
})

const $panelBtn = document.querySelector('.panel-btn');
const $aside = document.querySelector('.panel')

document.addEventListener("click", (e) =>{
    if(e.target.matches('.panel-btn') || e.target.matches('.panel-btn *')){
        $panelBtn.classList.toggle("is-active")
        $aside.classList.toggle("is-active")
    }

    if(e.target.matches('#linkBtn')){
        $panelBtn.classList.remove("is-active")
        $aside.classList.remove("is-active")
    }
})

