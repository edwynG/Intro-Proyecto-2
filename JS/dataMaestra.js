//VARIABLES GLOBALES
var dataUniversidad = "", objectsUniversidad = [];
var dataFacultad = "", objectsFacultad = [];
var dataEscuela = "", objectsEscuela = [];
var dataCarrera = "", objectsCarrera = [];
var dataAula = "", objectsAula = [];
var dataPeriodo = "", objectsPeriodo = [];
var dataPensum = "", objectsPensum = [];
var dataAsignatura = "", objectsAsignatura = [];
var dataHorario = "", objectsHorario = [];
var dataAlumno = "", objectsAlumno = [];
var dataProfesor = "", objectsProfesor = [];


//CLASES
class Universidad {
	constructor(id, nombre, rif, direccion){
		this.id = id;
		this.nombre = nombre;
		this.rif = rif;
		this.direccion = direccion;
	}
}

class Facultad {
	constructor(id, id_universidad, nombre){
		this.id = id;
		this.id_universidad = id_universidad;
		this.nombre = nombre;
	}
}

class Escuela {
	constructor(id, id_facultad, nombre, nro_carreras){
		this.id = id;
		this.id_facultad = id_facultad;
		this.nombre = nombre;
		this.nro_carreras = nro_carreras;
	}
}

class Carrera {
	constructor(id, id_escuela, nombre, nro_est){
		this.id = id;
		this.id_escuela = id_escuela;
		this.nombre = nombre;
		this.nro_est = nro_est;
	}
}

class Aula {
	constructor(id_universidad, nombre){
		this.id_universidad = id_universidad;
		this.nombre = nombre;
	}
}

class Periodo {
	constructor(tipo, fecha_inicio, fecha_fin, semanas){
		this.tipo = tipo;
		this.fecha_inicio = fecha_inicio;
		this.fecha_fin = fecha_fin;
	}
}

class Asignatura {
	constructor(nombre, codigo, uc){
		this.nombre = nombre;
		this.codigo = codigo;
		this.uc = uc;
	}
}

class Horario {
	constructor(dia, horario, id_asignatura, aula){
		this.dia = dia;
		this.horario = horario;
		this.id_asignatura = id_asignatura;
		this.aula = aula;
	}
}

class Pensum {
	constructor(id_carrera, nombre_asignatura, codigo_asignatura){
		this.id_carrera = id_carrera;
		this.nombre_asignatura = nombre_asignatura;
		this.codigo_asignatura = codigo_asignatura;
	}
}

class Persona {
	constructor(nombre, cedula, email){
		this.nombre = nombre;
		this.cedula = cedula; 
		this.email = email;
	}
}

class Alumno extends Persona{
	constructor(nombre, cedula, email, prepa){
		super(nombre, cedula, email);
		this.prepa = prepa;
	}
}

class Profesor extends Persona{
	constructor(nombre, cedula, email, asignaturas){
		super(nombre, cedula, email);
		this.asignaturas = asignaturas;
	}
}


//OTROS
function textToObject(data, object, type){
    data = data.split(/[\r\n]+/g);
    let array = [];
    for(let i = 0; i < data.length; i++){
        array[i] = data[i].split(";");
        if(type == "Universidad")
            object[i] = new Universidad(array[i][0], array[i][1], array[i][2], array[i][3]);
        else if(type == "Facultad")
            object[i] = new Facultad(array[i][0], array[i][1], array[i][2]);
        else if(type == "Escuela")
            object[i] = new Escuela(array[i][0], array[i][1], array[i][2], array[i][3]);
        else if(type == "Carrera")
            object[i] = new Carrera(array[i][0], array[i][1], array[i][2], array[i][3]);
        else if(type == "Aula")
            object[i] = new Aula(array[i][0], array[i][1]);
        else if(type == "Periodo")
            object[i] = new Periodo(array[i][0], array[i][1], array[i][2]);
        else if(type == "Pensum")
            object[i] = new Pensum(array[i][0], array[i][1], array[i][2]);
        else if(type == "Asignatura")
            object[i] = new Asignatura(array[i][0], array[i][1], array[i][2]);
        else if(type == "Horario")
            object[i] = new Horario(array[i][0], array[i][1], array[i][2], array[i][3]);
        else if(type == "Alumno")
            object[i] = new Alumno(array[i][0], array[i][1], array[i][2], array[i][3]);
        else if(type == "Profesor")
            object[i] = new Profesor(array[i][0], array[i][1], array[i][2], array[i][3]);
    }
}

//ORGANIZAR DATA
function instituciones(){
    
}

//LEER ARCHIVOS
document.getElementById("universidad").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataUniversidad = fr.result;
        textToObject(dataUniversidad, objectsUniversidad, "Universidad");
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("facultad").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataFacultad = fr.result;
        textToObject(dataFacultad, objectsFacultad, "Facultad");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("escuela").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataEscuela = fr.result;
        textToObject(dataEscuela, objectsEscuela, "Escuela");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("carrera").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataCarrera = fr.result;
        textToObject(dataCarrera, objectsCarrera, "Carrera");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("aula").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAula = fr.result;
        textToObject(dataAula, objectsAula, "Aula");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("periodo").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataPeriodo = fr.result;
        textToObject(dataPeriodo, objectsPeriodo, "Periodo");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("pensum").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataPensum = fr.result;
        textToObject(dataPensum, objectsPensum, "Pensum");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("asignatura").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAsignatura = fr.result;
        textToObject(dataAsignatura, objectsAsignatura, "Asignatura");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("horario").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataHorario = fr.result;
        textToObject(dataHorario, objectsHorario, "Horario");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("alumno").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAlumno = fr.result;
        textToObject(dataAlumno, objectsAlumno, "Alumno");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("profesor").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataProfesor = fr.result;
        textToObject(dataProfesor, objectsProfesor, "Profesor");
        
    }
    fr.readAsText(this.files[0]);
});