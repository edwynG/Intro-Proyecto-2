//VARIABLES GLOBALES
var dataAsignatura = "", objectsAsignatura = [];
var dataAprendizaje = "", objectsAprendizaje = [];
var dataActividades = "", objectsActividades = [];
var dataNotasActvidades = "", objectsNotasActvidades = [];
let codigosAsignaturasImpartidas = sessionStorage.getItem("userOtro").replaceAll('[', '');
codigosAsignaturasImpartidas = codigosAsignaturasImpartidas.replaceAll(']', '');
codigosAsignaturasImpartidas = codigosAsignaturasImpartidas.split(",");

let informacionProfesor = []; //[curso, [estudianteinfo, [actividadinfo]]]

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
	constructor(id_alumno, id_asignatura, estado, nota, tipo_examen){
		this.id_alumno = id_alumno;
		this.id_asignatura = id_asignatura;
		this.estado = estado;
		this.nota = nota;
		this.tipo_examen = tipo_examen;
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
	constructor(id_asignatura, id_actividad, id_alumno, nota){
		this.id_asignatura = id_asignatura;
		this.id_actividad = id_actividad;
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
                if(objectsAprendizaje[j]["id_asignatura"] == objectsAsignatura[i]["codigo"]){

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
            objectsAprendizaje[i] = new Aprendizaje(arrayAprendizaje[i][0], arrayAprendizaje[i][1], arrayAprendizaje[i][2], arrayAprendizaje[i][3], arrayAprendizaje[i][4]);
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

//CAMBIAR NOTA Y TIPO DE EXAMEN
function saveInfoAsignatura(id_alumno, id_asignatura){
    clickButton("submitInfoAsignatura");
    
    //ENCONTRAR APRENDIZAJE MODIFICADO EN ARRAY
    let newAprendizaje = objectsAprendizaje.find(aprendizaje => (aprendizaje['id_alumno'] === id_alumno) && (aprendizaje['id_asignatura'] === id_asignatura));
    
    //MODIFICAR VALORES EN OBJECTSAPRENDIZAJE
    let i = objectsAprendizaje.indexOf(newAprendizaje);
    if(infoFormAsignatura["notaAsignatura"]){
        newAprendizaje["nota"] = infoFormAsignatura["notaAsignatura"];
    }
    if(infoFormAsignatura["tipoExamen"]){
        newAprendizaje["tipo_examen"] = infoFormAsignatura["tipoExamen"];
    }
    objectsAprendizaje[i] = newAprendizaje;
    
    //MODIFICAR DATAAPRENDIZAJE, ARRAYAPRENDIZAJE
    dataAprendizaje = "";
    let aux = "";
    for(let i = 0; i < objectsAprendizaje.length; i++){
        aux = JSON.stringify(Object.values(objectsAprendizaje[i])).replaceAll('"', '');
        aux = aux.replaceAll(',', ';');
        aux = aux.replaceAll('[', '');
        aux = aux.replaceAll(']', '');
        
        dataAprendizaje += aux;
        dataAprendizaje += "\n";
    }

    download(dataAprendizaje, 'Aprendizaje');
}