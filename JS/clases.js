class Universidad {
	constructor(nombre, rif, direccion){
	
	this._nombre = nombre;
	this._rif = rif;
	this._direccion = direccion;
	}
}


class Facultad {
	constructor(facultad, codigo){
	
	this._facultad = facultad;
	this._codigo = codigo;
	}
}


class Escuela {
	constructor(escuela, nro_carreras){

	this._escuela = escuela;
	this._nro_carreras = nro_carreras;
	}
}


class Carrera {
	constructor(carrera, nro_est){
	
	this._carrera = carrera;
	this._nro_est = nro_est;
	}
}


class Aula {
	constructor(nro_aula){

	this._nro_aula = nro_aula;
	}
}


class PlanEstudio {
	constructor(act_planificadas, act_realizadas){

	this._act_planificadas = act_planificadas;
	this._act_realizadas = act_realizadas;
	}
}


class Periodo {
	construtor(tipo, fecha_inicio, fecha_fin){
	
	this._tipo = tipo;
	this._fecha_inicio = fecha_inicio;
	this._fecha_fin = fecha_fin;
	}
}


class Curso {
	constructor(curso, matricula, evaluacion, duracion){

	this._curso = curso;
	this._matricula = matricula;
	this._evaluacion = evaluacion;
	this._duracion = duracion;
	}
}


class Horario {
	constructor(horario){
	
	this._horario = horario;
	}
}


class Pensum {

	constructor(asignatura, codigo){
	this._asignatura = asignatura;
	this._codigo = codigo;
	}
}


class Persona {
	constructor(nombre, cedula, edad, correo){
	
	this._nombre = nombre;
	this._cedula = cedula; 
	this._correo = correo;
	}
}


class Estudiante extends Persona{
	constructor(nombre, cedula, edad, correo, seccion, prepa){
	
	super(_nombre, _cedula, _edad, _correo);
	this._prepa = prepa;
	}
}


class Profesor extends Persona{
	constructor(nombre, cedula, edad, correo, curso){
	
	super(_nombre, _cedula, _edad, _correo);
	this._curso = curso;
	}
}
