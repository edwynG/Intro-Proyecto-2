var data = "";
var objects = [];
var attr = [];
var infoForm = null;
let newData = "";

//OTROS
function clickButton(buttonId){
    document.getElementById(buttonId).click();
}
function initLogin(name){
    window.open(`${name}.html`,"_self");   
}

//SESSION USER
function sessionUser(id){
    sessionStorage.setItem("userId", id.toString());
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
        if(infoForm["emailIn"] === attr[i][2]){
            sessionUser(attr[i][1]);
            initLogin("homeAlumno")
            return
        }
    }
    initLogin("SignIn")
    alert("Datos incorrectos");
    return
}
  
let signInForm = document.getElementById("signInForm");
if(signInForm != null){
    signInForm.addEventListener("submit", function (e) {
        e.preventDefault();
        infoForm = getData(e.target);
    });
}

let signUpForm = document.getElementById("signUpForm");
if(signUpForm != null){
    signUpForm.addEventListener("submit", function (e) {
        e.preventDefault();
        infoForm = getData(e.target);
    });
}

//ESCRIBIR ARCHIVO
function mergeData(){
    newData = data + "\n";
    for (let i in infoForm){
        newData += infoForm[i].toString() + ";";
    }
}

function download(nombre){
    let filename = nombre + ".txt";
    let text = newData;
    let blob = new Blob([text], {type:'text/plain'});
    let link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    }, 100);
    initLogin("index")
}

//LEER ARCHIVO 
document.getElementById("readFile").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        data = fr.result;
        objects = data.split(/[\r\n]+/g);
        for(let i = 0; i < objects.length; i++){
            attr[i] = objects[i].split(";");
        }

        //DISCRIMINAR POR SIGN IN O SIGN UP
        let type = document.getElementById("readFile").name;
        if (type === "readFileIn"){
            clickButton("submitIn");
            if(data != "" && infoForm != null)
                validateUser(infoForm, attr)

        }else if(type === "readFileUp"){
            clickButton("submitUp");
            if(data != "" && infoForm != null){
                mergeData();
                clickButton("writeFile");
            }
        }
        
    }
    fr.readAsText(this.files[0]);
});