
let BtnMenu = document.getElementById("nav_icon-resposive");
let btnMenuClose = document.getElementById("nav_reposive-close");
let btnLogin = document.querySelector(".main_button");
let btnSingIn=document.getElementById("sing_in");
function menu(){
    let lista = document.querySelector(".nav_lista");
    let asideResponsive = document.querySelector(".container_aside");
    let mainResposive =document.querySelector(".container_main");
    let iconMenu = document.querySelector(".resposive_Menu-icon");
    lista.classList.toggle("nav_list-resposive");
    asideResponsive.classList.toggle("responsive_aside");
    mainResposive.classList.toggle("responsive_aside");
    iconMenu.classList.toggle("responsive_aside");
}

function initLogin(name){
   window.open(`${name}.html`,"_self");
    
}

btnLogin.addEventListener("click",() =>  initLogin("login"))
btnSingIn.addEventListener("click",() =>  initLogin("SingIn"))
btnMenuClose.addEventListener("click",()=> menu())

BtnMenu.addEventListener("click", () => menu())