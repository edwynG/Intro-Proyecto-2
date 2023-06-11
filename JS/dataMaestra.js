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
var dataEstudiante = "", objectsEstudiante = [];
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
	constructor(id, id_facultad, nombre){
		this.id = id;
		this.id_facultad = id_facultad;
		this.nombre = nombre;
		this.nro_carreras = nro_carreras;
	}
}

class Carrera {
	constructor(id, id_escuela, nombre){
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

class Estudiante extends Persona{
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
function textToObject(data, object){
    data = data.split(/[\r\n]+/g);
    let array = [];
    for(let i = 0; i < data.length; i++){
        array[i] = data[i].split(";");
        object[i] = new Asignatura(array[i][0], array[i][1], array[i][2]);
    }
}

//LEER ARCHIVOS
document.getElementById("universidad").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataUniversidad = fr.result;
        textToObject(dataUniversidad, objectsUniversidad)
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("facultad").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataFacultad = fr.result;
        dataFacultad = dataFacultad.split(/[\r\n]+/g);
        let array = [];
        for(let i = 0; i < dataFacultad.length; i++){
            array[i] = dataFacultad[i].split(";");
            objectsFacultad[i] = new Asignatura(array[i][0], array[i][1], array[i][2]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("escuela").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataEscuela = fr.result;
        dataEscuela = dataEscuela.split(/[\r\n]+/g);
        let array = [];
        for(let i = 0; i < dataEscuela.length; i++){
            array[i] = dataEscuela[i].split(";");
            objectsEscuela[i] = new Asignatura(array[i][0], array[i][1], array[i][2]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("carrera").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataCarrera = fr.result;
        dataCarrera = dataCarrera.split(/[\r\n]+/g);
        let array = [];
        for(let i = 0; i < dataCarrera.length; i++){
            array[i] = dataCarrera[i].split(";");
            objectsCarrera[i] = new Asignatura(array[i][0], array[i][1], array[i][2]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("aula").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAula = fr.result;
        dataAula = dataAula.split(/[\r\n]+/g);
        let array = [];
        for(let i = 0; i < dataAula.length; i++){
            array[i] = dataAula[i].split(";");
            objectsAula[i] = new Asignatura(array[i][0], array[i][1], array[i][2]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("aula").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAula = fr.result;
        dataAula = dataAula.split(/[\r\n]+/g);
        let array = [];
        for(let i = 0; i < dataAula.length; i++){
            array[i] = dataAula[i].split(";");
            objectsAula[i] = new Asignatura(array[i][0], array[i][1], array[i][2]);
        }
        
    }
    fr.readAsText(this.files[0]);
});