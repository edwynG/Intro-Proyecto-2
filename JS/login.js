//OTROS
function clickButton(buttonName){
    document.getElementById(buttonName).click();
}


//SALIR DEL POPUP
let exit = document.querySelector(".nav_container-close");

exit.addEventListener("click",()=>{
    window.open("index.html","_self")
    
})

//OBTENER DATOS FORMULARIO
function getData(form) {
    var formData = new FormData(form);
    return Object.fromEntries(formData);
}
  
document.getElementById("signInForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let infoForm = getData(e.target);
    clickButton("validateUser");
});

//LEER ARCHIVO 
var data = "";
var objetos = "";
var atributos = "";

document.getElementById('validateUser')
    .addEventListener('change', function() {
        var fr = new FileReader();
        fr.onload = function(){
            
            data = fr.result;

            objetos = data.split(/[\r\n]+/g);
            for(let i = 0; i < objetos.length; i++){
                atributos = objetos[i].split(";");
            }  
        }
        fr.readAsText(this.files[0]);
});