//VARIABLES GLOBALES
var dataAsignatura = "", objectsAsignatura = [];
var dataAprendizaje = "", objectsAprendizaje = [];
var dataActividades = "", objectsActividades = [];
var dataNotasActvidades = "", objectsNotasActvidades = [];
var dataProfesor = "", objectsProfesor = [];

//[ASIGNATURA, [ESTUDIANTEINFO, [ACTIVIDADINFO]]]
let informacionProfesor = []; 
let asignaturasLibres = [];

//OBTENER CODIGO, SECCION, PERIODO DE ASIGNATURAS IMPARTIDAS
let codigosAsignaturasImpartidas = [];
let seccionesAsignaturasImpartidas = [];
let periodosAsignaturasImpartidas = [];
debugger
obtenerCodigoSeccionPeriodo(sessionStorage.getItem("userOtro"), codigosAsignaturasImpartidas, seccionesAsignaturasImpartidas, periodosAsignaturasImpartidas); 


//CLASES
class Asignatura {
	constructor(nombre, codigo, uc){
		this.nombre = nombre;
		this.codigo = codigo;
		this.uc = uc;
        this.notaEstudiante = 0;
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
        this.notaEstudiante = 0;
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

class Persona {
	constructor(nombre, cedula, email, password){
		this.nombre = nombre;
		this.cedula = cedula; 
		this.email = email;
		this.password = password;
	}
}

class Alumno extends Persona{
	constructor(nombre, cedula, email, password, prepa){
		super(nombre, cedula, email, password);
		this.prepa = prepa;
	}
}

class Profesor extends Persona{
	constructor(nombre, cedula, email, password, asignaturas){
		super(nombre, cedula, email, password);
		this.asignaturas = asignaturas;
	}
}


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

function textToObject(data, object, type){
    data = data.split(/[\r\n]+/g);
    let array = [];
    for(let i = 0; i < data.length; i++){
        array[i] = data[i].split(";");
        if(type == "Asignatura")
            object[i] = new Asignatura(array[i][0], array[i][1], array[i][2]);
        else if(type == "Aprendizaje")
            object[i] = new Aprendizaje(array[i][0], array[i][1], array[i][2], array[i][3], array[i][4], array[i][5], array[i][6]);
        else if(type == "Actividad")
            object[i] = new Actividad(array[i][0], array[i][1], array[i][2], array[i][3], array[i][4], array[i][5]);
        else if(type == "NotasActividades")
            object[i] = new NotasActividades(array[i][0], array[i][1], array[i][2], array[i][3], array[i][4], array[i][5]);
        else if(type == "Profesor")
            object[i] = new Profesor(array[i][0], array[i][1], array[i][2], array[i][3], array[i][4]);
    }
}

function obtenerCodigoSeccionPeriodo(toChange, codigos, secciones, periodos){
    toChange = toChange.split(".");
    for(let i = 0; i < toChange.length; i++){
        let aux = toChange[i].split(":");
        codigos.push(aux[0]);
        secciones.push(aux[1]);
        periodos.push(aux[2]);
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
                if(objectsAprendizaje[j]["id_asignatura"] == objectsAsignatura[i]["codigo"] && seccionesAsignaturasImpartidas.includes(objectsAprendizaje[j]["seccion"]) && periodosAsignaturasImpartidas.includes(objectsAprendizaje[j]["periodo"])){

                    //ACTIVIDADES DE LA ASIGNATURA
                    let actividadesAsignatura = [];
                    for(let k = 0; k < objectsActividades.length; k++){
                        if(objectsActividades[k]["id_asignatura"] == objectsAsignatura[i]["codigo"]){
                            
                            //INFORMACION DEL ESTUDIANTE EN LAS ACTIVIDADES
                            let notaActividad = objectsNotasActvidades.find(nota => (nota["id_actividad"] == objectsActividades[k]["id_actividad"]) && (nota["id_alumno"] == objectsAprendizaje[j]["id_alumno"]) && (nota["id_asignatura"] == objectsAsignatura[i]["codigo"]));
                            if(notaActividad){
                                let actividadConNota = new Actividad(objectsActividades[k]["id_actividad"], objectsActividades[k]["id_asignatura"], objectsActividades[k]["nombre"], objectsActividades[k]["realizada"], objectsActividades[k]["horas"], objectsActividades[k]["observaciones"]);
                                actividadConNota["notaEstudiante"] = notaActividad["nota"];

                                actividadesAsignatura.push(actividadConNota);
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
        textToObject(dataAsignatura, objectsAsignatura, "Asignatura")
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("aprendizaje").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAprendizaje = fr.result;
        textToObject(dataAprendizaje, objectsAprendizaje, "Aprendizaje");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("actividades").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataActividades = fr.result;
        textToObject(dataActividades, objectsActividades, "Actividad");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("notasxactividades").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataNotasActvidades = fr.result;
        textToObject(dataNotasActvidades, objectsNotasActvidades, "NotasActividades");

        if(dataNotasActvidades.length > 0)
            obtenerInformacionProfesor();
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("profesor").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataProfesor = fr.result;
        textToObject(dataProfesor, objectsProfesor, "Profesor");
        if(dataProfesor.length > 0)
            obtenerAsignaturasLibres();
        
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


//INSCRIBIR ASIGNATURA A IMPARTIR
function inscribirAsignatura(id_asignatura){
    dataProfesor = "";
    let aux = "";
    for(let i = 0; i < objectsProfesor.length; i++){
        
        if(objectsProfesor[i]["cedula"] == sessionStorage.getItem("userId")){
            objectsProfesor[i]["asignaturas"] += '.' + id_asignatura + ':C1:01-2023]';
            
        }
        aux = replaceChars(objectsProfesor[i]);
        dataProfesor += aux;
        dataProfesor += "\n";
    }
    download(dataProfesor, 'Profesor');
}

function obtenerAsignaturasLibres(){
    let codigosOcupados = [];
    let seccionesOcupados = [];
    let periodosOcupados = [];
    let asignaturasLibres = [];
    
    for(let i = 1; i < objectsProfesor.length; i++){
        obtenerCodigoSeccionPeriodo(objectsProfesor[i]["asignaturas"], codigosOcupados, seccionesOcupados, periodosOcupados);
    }
    for(let i = 1; i < objectsAsignatura.length; i++){
        if(!(codigosOcupados.includes(objectsAsignatura[i]["codigo"]))){
            asignaturasLibres.push(objectsAsignatura[i]);
        }
    }
    return asignaturasLibres;
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