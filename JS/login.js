var data = "";
var objects = [];
var attr = [];
var infoForm = null;
let newData = "";
let typeOfUser; 

//OTROS
function clickButton(buttonId){
    document.getElementById(buttonId).click();
}
function openPage(name){
    window.open(`${name}.html`,"_self");   
}

//SESSION USER
function sessionUser(name, id, email, otro){
    sessionStorage.setItem("userName", name.toString());
    sessionStorage.setItem("userId", id.toString());
    sessionStorage.setItem("userEmail", email.toString());
    sessionStorage.setItem("userOtro", otro.toString());
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
        if(infoForm["emailIn"] === attr[i][2] && infoForm["passwordIn"] === attr[i][3]){
            sessionUser(attr[i][0], attr[i][1], attr[i][2], attr[i][4]);
            if(infoForm["profeIn"] == "false"){
                openPage("homeAlumno")
            }else if(infoForm["profeIn"] == "true"){
                openPage("homeProfesor")
            }
            
            return
        }
    }
    openPage("SignIn")
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
        if(i == 'prepaUp' && infoForm["profeUp"] == "true")
            newData += " ";
        else if(i == 'prepaUp' && infoForm["profeUp"] == "false")
            newData += infoForm[i].toString();  
        else if(i !== 'profeUp')
            newData += infoForm[i].toString() + ";";
        
        
    }
    if(infoForm["profeUp"] == "false"){
        typeOfUser = 'Alumno';
    }else if(infoForm["profeUp"] == "true"){
        typeOfUser = 'Profesor';
    }
}

function download(){
    let filename = typeOfUser + ".txt";
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
            if(data != "" && infoForm != null){
                if(infoForm["emailIn"] != "" && infoForm["passwordIn"] != ""){
                    validateUser(infoForm, attr)
                }else{
                    openPage("SignIn");
                    alert("Debes llenar el formulario completo");
                }
            }  

        }else if(type === "readFileUp"){
            clickButton("submitUp");
            if(data != "" && infoForm != null){
                if(infoForm["nameUp"] != "" && infoForm["ciUp"] != "" && infoForm["emailUp"] != "" && infoForm["passwordUp"] != ""){
                    mergeData();
                    clickButton("writeFile");
                }else{
                    openPage("SignUp");
                    alert("Debes llenar el formulario completo");
                }
            }
        }
        
    }
    fr.readAsText(this.files[0]);
});