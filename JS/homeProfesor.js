//VARIABLES GLOBALES
var dataAsignatura = "", objectsAsignatura = [];
var dataAprendizaje = "", objectsAprendizaje = [];
var dataActividades = "", objectsActividades = [];
var dataNotasActvidades = "", objectsNotasActvidades = [];

//OBTENER CODIGO, SECCION, PERIODO DE ASIGNATURAS IMPARTIDAS
let codigosAsignaturasImpartidas = [];
let seccionesAsignaturasImpartidas = [];
let periodosAsignaturasImpartidas = [];
let userOtro = sessionStorage.getItem("userOtro").replaceAll('[', '');
userOtro = userOtro.replaceAll(']', '');
userOtro = userOtro.split(".");
for(let i = 0; i < userOtro.length; i++){
    let aux = userOtro[i].split(":");
    codigosAsignaturasImpartidas.push(aux[0]);
    seccionesAsignaturasImpartidas.push(aux[1]);
    periodosAsignaturasImpartidas.push(aux[2]);
}

//[ASIGNATURA, [ESTUDIANTEINFO, [ACTIVIDADINFO]]]
let informacionProfesor = []; 

//OTROS
function clickButton(buttonId){
    document.getElementById(buttonId).click();
}

function getData(form) {
    var formData = new FormData(form);
    return Object.fromEntries(formData);
}

function download(text, nameFile){
    let filename = nameFile + ".txt";
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

function replaceChars(object){
    object = JSON.stringify(Object.values(object)).replaceAll('"', '');
    object = object.replaceAll(',', ';');
    object = object.replaceAll('[', '');
    object = object.replaceAll(']', '');
    return object;
}


//CLASES
class Asignatura {
	constructor(nombre, codigo, uc){
		this.nombre = nombre;
		this.codigo = codigo;
		this.uc = uc;
        this.notaEstudiante = -1;
	}
}

class Aprendizaje {
	constructor(id_alumno, id_asignatura, estado, nota, tipo_examen, seccion, periodo){
		this.id_alumno = id_alumno;
		this.id_asignatura = id_asignatura;
		this.estado = estado;
		this.nota = nota;
		this.tipo_examen = tipo_examen;
        this.seccion = seccion;
		this.periodo = periodo;
	}
}

class Actividad {
	constructor(id_actividad, id_asignatura, nombre, realizada, horas, observaciones){
		this.id_actividad = id_actividad;
		this.id_asignatura = id_asignatura;
		this.nombre = nombre; 
		this.realizada = realizada;
		this.horas = horas;
		this.observaciones = observaciones;
        this.notaEstudiante = -1;
	}
}

class NotasActividades {
	constructor(id_actividad, id_asignatura, id_alumno, nota){
		this.id_actividad = id_actividad;
        this.id_asignatura = id_asignatura;
		this.id_alumno = id_alumno;
		this.nota = nota;
	}
}


//OBTENER INFORMACION DEL PROFESOR
function obtenerInformacionProfesor(){
    //ASIGNATURA RELACIONADAS
    for(let i = 0; i < objectsAsignatura.length; i++){
        if(codigosAsignaturasImpartidas.includes(objectsAsignatura[i]["codigo"])){

            //ESTUDIANTES E INFORMACION EN LA ASIGNATURA
            let infoEstudiantesAsignatura = [];

            for(let j = 0; j < objectsAprendizaje.length; j++){
                if(objectsAprendizaje[j]["id_asignatura"] == objectsAsignatura[i]["codigo"] && seccionesAsignaturasImpartidas.includes(objectsAprendizaje[j]["seccion"])){

                    //ACTIVIDADES DE LA ASIGNATURA
                    let actividadesAsignatura = [];
                    for(let k = 0; k < objectsActividades.length; k++){
                        if(objectsActividades[k]["id_asignatura"] == objectsAsignatura[i]["codigo"]){
                            
                            //INFORMACION DEL ESTUDIANTE EN LAS ACTIVIDADES
                            let notaActividad = objectsNotasActvidades.find(nota => (nota["id_actividad"] == objectsActividades[k]["id_actividad"]) && (nota["id_alumno"] == objectsAprendizaje[j]["id_alumno"]) && (nota["id_asignatura"] == objectsAsignatura[i]["codigo"]));
                            if(notaActividad){
                                objectsActividades[k]["notaEstudiante"] = notaActividad["nota"];

                                actividadesAsignatura.push(objectsActividades[k]);
                            }
                            
                            
                        }  
                    }
                    infoEstudiantesAsignatura.push([objectsAprendizaje[j], actividadesAsignatura]);
                }  
            }
            informacionProfesor.push([objectsAsignatura[i], infoEstudiantesAsignatura]);
        }  
    }
    return informacionProfesor;
}


//LEER ARCHIVOS
document.getElementById("asignatura").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAsignatura = fr.result;
        dataAsignatura = dataAsignatura.split(/[\r\n]+/g);
        let arrayAsignatura = [];
        for(let i = 0; i < dataAsignatura.length; i++){
            arrayAsignatura[i] = dataAsignatura[i].split(";");
            objectsAsignatura[i] = new Asignatura(arrayAsignatura[i][0], arrayAsignatura[i][1], arrayAsignatura[i][2]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("aprendizaje").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAprendizaje = fr.result;
        dataAprendizaje = dataAprendizaje.split(/[\r\n]+/g);
        let arrayAprendizaje = [];
        for(let i = 0; i < dataAprendizaje.length; i++){
            arrayAprendizaje[i] = dataAprendizaje[i].split(";");
            objectsAprendizaje[i] = new Aprendizaje(arrayAprendizaje[i][0], arrayAprendizaje[i][1], arrayAprendizaje[i][2], arrayAprendizaje[i][3], arrayAprendizaje[i][4], arrayAprendizaje[i][5], arrayAprendizaje[i][6]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("actividades").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataActividades = fr.result;
        dataActividades = dataActividades.split(/[\r\n]+/g);
        let arrayActividades = [];
        for(let i = 0; i < dataActividades.length; i++){
            arrayActividades[i] = dataActividades[i].split(";");
            objectsActividades[i] = new Actividad(arrayActividades[i][0], arrayActividades[i][1], arrayActividades[i][2], arrayActividades[i][3], arrayActividades[i][4], arrayActividades[i][5]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("notasxactividades").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataNotasActvidades = fr.result;
        dataNotasActvidades = dataNotasActvidades.split(/[\r\n]+/g);
        let arrayNotasActvidades = [];
        for(let i = 0; i < dataNotasActvidades.length; i++){
            arrayNotasActvidades[i] = dataNotasActvidades[i].split(";");
            objectsNotasActvidades[i] = new NotasActividades(arrayNotasActvidades[i][0], arrayNotasActvidades[i][1], arrayNotasActvidades[i][2], arrayNotasActvidades[i][3]);
        }
        if(dataNotasActvidades.length > 0)
            obtenerInformacionProfesor();
        
    }
    fr.readAsText(this.files[0]);
});


//LEER FORMULARIOS
var infoFormAsignatura;
let formAsignatura = document.getElementById("formAsignatura");
if(formAsignatura != null){
    formAsignatura.addEventListener("submit", function (e) {
        e.preventDefault();
        infoFormAsignatura = getData(e.target);
    });
}

var infoFormActividad;
let formActividad = document.getElementById("formActividad");
if(formActividad != null){
    formActividad.addEventListener("submit", function (e) {
        e.preventDefault();
        infoFormActividad = getData(e.target);
    });
}


//CAMBIAR NOTA Y TIPO DE EXAMEN
function saveInfoAsignatura(id_alumno, id_asignatura){
    clickButton("submitInfoAsignatura");
    
    //ENCONTRAR MODIFICADO EN ARRAY
    let newAprendizaje = objectsAprendizaje.find(aprendizaje => (aprendizaje['id_alumno'] === id_alumno) && (aprendizaje['id_asignatura'] === id_asignatura));
    
    //MODIFICAR VALORES EN OBJECT
    let i = objectsAprendizaje.indexOf(newAprendizaje);
    if(infoFormAsignatura["notaAsignatura"]){
        newAprendizaje["nota"] = infoFormAsignatura["notaAsignatura"];
    }
    if(infoFormAsignatura["tipoExamen"]){
        newAprendizaje["tipo_examen"] = infoFormAsignatura["tipoExamen"];
    }
    objectsAprendizaje[i] = newAprendizaje;
    
    //MODIFICAR TXT
    dataAprendizaje = "";
    let aux = "";
    for(let i = 0; i < objectsAprendizaje.length; i++){
        aux = replaceChars(objectsAprendizaje[i]);
        dataAprendizaje += aux;
        dataAprendizaje += "\n";
    }

    download(dataAprendizaje, 'Aprendizaje');
}

//CAMBIAR HORAS, OBSERVACIONES Y NOTA
function saveInfoActividad(id_actividad, id_asignatura, id_alumno){
    clickButton("submitInfoActividad");
    
    //ENCONTRAR MODIFICADO EN ARRAY
    let newActividad = objectsActividades.find(actividad => actividad['id_actividad'] === id_actividad);
    let newNotaActividad = objectsNotasActvidades.find(nota => (nota['id_actividad'] === id_actividad) && (nota['id_asignatura'] === id_asignatura) && (nota['id_alumno'] === id_alumno));
    
    //MODIFICAR VALORES EN OBJECT
    let i = objectsActividades.indexOf(newActividad);
    let j = objectsNotasActvidades.indexOf(newNotaActividad);

    if(infoFormActividad["horas"]){
        newActividad["horas"] = infoFormActividad["horas"];
    }
    if(infoFormActividad["observaciones"]){
        newActividad["observaciones"] = infoFormActividad["observaciones"];
    }
    if(infoFormActividad["notaEstudiante"]){
        newNotaActividad["nota"] = infoFormActividad["notaEstudiante"];
    }
    
    objectsActividades[i] = newActividad;
    objectsNotasActvidades[j] = newNotaActividad;
    
    //MODIFICAR TXT ACTIVIDAD
    dataActividades = "";
    let aux = "";
    for(let i = 0; i < objectsActividades.length; i++){
        delete objectsActividades[i]['notaEstudiante'];
        aux = replaceChars(objectsActividades[i]);
        dataActividades += aux;
        dataActividades += "\n";
    }

    download(dataActividades, 'Actividad');

    //MODIFICAR TXT NOTASACTIVIDADES
    dataNotasActvidades = "";
    aux = "";

    for(let i = 0; i < objectsNotasActvidades.length; i++){
        aux = replaceChars(objectsNotasActvidades[i]);
        dataNotasActvidades += aux;
        dataNotasActvidades += "\n";
    }

    download(dataNotasActvidades, 'NotasActividades');
}

/*EDWYN */

/******************************/

/****Extraer data de sesionStorge*/
function personStatus(){
    let cache = sessionStorage;
    let divCi= document.querySelectorAll("#ci_list");

    for(let i = 0;i < divCi.length;i++){
        divCi[i].innerHTML= "V" + cache.getItem("userId");
    }
}

/*************************/

 /*boton evento para cerrar ventana emergente */
 function cerrarCargaDeArchivo(){
    let temp =document.getElementById("contenedor_load-file");
    temp.style.display="none";
}

 document.getElementById("btn_result").addEventListener("click",cerrarCargaDeArchivo);

 /*-> alogritmo para nav responsive<--*/
//abrir nav resposive
document.querySelector(".header_menu-resposive").addEventListener("click", ()=>{
    document.querySelector(".nav_lista").classList.toggle("responsive-lista");
    document.querySelector(".container_main").classList.toggle("responsive-lista");
})

//cerrar nav en reposive
document.querySelector(".nav_reposive-icoClose").addEventListener("click",()=>{
    document.querySelector(".nav_lista").classList.toggle("responsive-lista");
    document.querySelector(".container_main").classList.toggle("responsive-lista");
})

/**************************************/


/*Regresar al Menu principal*/

document.querySelector("#userExit").addEventListener("click",()=>{
    document.querySelector(".container_list-exit").classList.toggle("list_user-exit");
})

document.getElementById("cerrarSesion").addEventListener("click",()=> {
    window.open("index.html","_self");
    window.close("homeAlumno.html");
})

/************************** */