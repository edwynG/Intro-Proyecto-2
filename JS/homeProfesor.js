//VARIABLES GLOBALES
var dataAsignatura = "", arrayAsignatura = [], objectsAsignatura = [];
var dataAprendizaje = "", arrayAprendizaje = [], objectsAprendizaje = [];
var dataActividades = "", arrayActividades = [], objectsActividades = [];
var dataNotasActvidades = "", arrayNotasActvidades = [], objectsNotasActvidades = [];
var asignaturasImpartidas = [], actividadesRelacionadas = [];
let codigosAsignaturasImpartidas = sessionStorage.getItem("userOtro").replaceAll('[', '');
codigosAsignaturasImpartidas = codigosAsignaturasImpartidas.replaceAll(']', '');
codigosAsignaturasImpartidas = codigosAsignaturasImpartidas.split(",")

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
	constructor(id_alumno, id_asignatura, estado, nota){
		this.id_alumno = id_alumno;
		this.id_asignatura = id_asignatura;
		this.estado = estado;
		this.nota = nota;
	}
}

class Actividad {
	constructor(id_asignatura, nombre, realizada, horas, observaciones){
		this.id_asignatura = id_asignatura;
		this.nombre = nombre; 
		this.realizada = realizada;
		this.horas = horas;
		this.observaciones = observaciones;
	}
}

class NotaActividades {
	constructor(id_asignatura, id_actividad, id_alumno, nota){
		this.id_asignatura = id_asignatura;
		this.id_actividad = id_actividad;
        this.id_alumno = id_alumno;
		this.nota = nota;
	}
}

//ASIGNATURAS IMPARTIDAS
function obtenerAsignaturasImpartidas(){
    for(let i = 0; i < objectsAsignatura.length; i++){
        if(codigosAsignaturasImpartidas.includes(objectsAsignatura[i]["codigo"])){
            asignaturasImpartidas.push(objectsAsignatura[i]);
        }  
    }
}

//ACTIVIDADES RELACIONADAS
function obtenerActividadesRelacionadas(){
    for(let i = 0; i < objectsActividades.length; i++){
        if(codigosAsignaturasImpartidas.includes(objectsActividades[i]["id_asignatura"])){
            actividadesRelacionadas.push(objectsActividades[i]);
        }  
    }
}

//LEER ARCHIVOS
document.getElementById("asignatura").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAsignatura = fr.result;
        dataAsignatura = dataAsignatura.split(/[\r\n]+/g);
        for(let i = 0; i < dataAsignatura.length; i++){
            arrayAsignatura[i] = dataAsignatura[i].split(";");
            objectsAsignatura[i] = new Asignatura(arrayAsignatura[i][0], arrayAsignatura[i][1], arrayAsignatura[i][2]);
        }
        if(dataAsignatura.length > 0)
            obtenerAsignaturasImpartidas();
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("aprendizaje").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAprendizaje = fr.result;
        dataAprendizaje = dataAprendizaje.split(/[\r\n]+/g);
        for(let i = 0; i < dataAprendizaje.length; i++){
            arrayAprendizaje[i] = dataAprendizaje[i].split(";");
            objectsAprendizaje[i] = new Aprendizaje(arrayAprendizaje[i][0], arrayAprendizaje[i][1], arrayAprendizaje[i][2], arrayAprendizaje[i][3]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("actividades").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataActividades = fr.result;
        dataActividades = dataActividades.split(/[\r\n]+/g);
        for(let i = 0; i < dataActividades.length; i++){
            arrayActividades[i] = dataActividades[i].split(";");
            objectsActividades[i] = new Actividad(arrayActividades[i][0], arrayActividades[i][1], arrayActividades[i][2], arrayActividades[i][3], arrayActividades[i][4]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("notasxactividades").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataNotasActvidades = fr.result;
        dataNotasActvidades = dataNotasActvidades.split(/[\r\n]+/g);
        for(let i = 0; i < dataNotasActvidades.length; i++){
            arrayNotasActvidades[i] = dataNotasActvidades[i].split(";");
            objectsNotasActvidades[i] = new NotaActividades(arrayNotasActvidades[i][0], arrayNotasActvidades[i][1], arrayNotasActvidades[i][2], arrayNotasActvidades[i][3]);
        }
        if(dataNotasActvidades.length > 0)
            obtenerActividadesRelacionadas();
        
    }
    fr.readAsText(this.files[0]);
});

//DESCARGAR ARCHIVO
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