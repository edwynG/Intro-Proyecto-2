let btnMenu = document.getElementById("nav_icon-resposive");
let btnMenuClose = document.getElementById("nav_reposive-close");
let btnSignUp = document.querySelector(".main_button");
let btnSignIn=document.getElementById("sign_in");

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

function openPage(name){
   window.open(`${name}.html`,"_self");
}

btnSignUp.addEventListener("click",() => openPage("SignUp"))
btnSignIn.addEventListener("click",() => openPage("SignIn"))
btnMenuClose.addEventListener("click",()=> menu())

btnMenu.addEventListener("click", () => menu())