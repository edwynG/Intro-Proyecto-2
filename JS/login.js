var data = "";
var objects = [];
var attr = [];
var infoForm = null;

//OTROS
function clickButton(buttonId){
    document.getElementById(buttonId).click();
}
function initLogin(name){
    window.open(`${name}.html`,"_self");   
}

//SALIR DEL POPUP
let exit = document.querySelector(".nav_container-close");

exit.addEventListener("click",()=>{
    window.open("index.html","_self")
})

//OBTENER DATOS FORMULARIO Y VALIDAR
function getData(form) {
    var formData = new FormData(form);
    return Object.fromEntries(formData);
}

function validateUser(infoForm, attr){
    for(let i = 0; i < attr.length; i++){
        if(infoForm["email"] === attr[i][1]){
            initLogin("index")
            return
        }
    }
    initLogin("SignIn")
    alert("No estas registrado");
    return
}
  
document.getElementById("signInForm").addEventListener("submit", function (e) {
    e.preventDefault();
    infoForm = getData(e.target);
});

//LEER ARCHIVO 
document.getElementById("validateUser").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        data = fr.result;
        objects = data.split(/[\r\n]+/g);
        for(let i = 0; i < objects.length; i++){
            attr[i] = objects[i].split(";");
        }
        clickButton("submit");
        if(data != "" && infoForm != null)
            validateUser(infoForm, attr)
    }
    fr.readAsText(this.files[0]);
});
