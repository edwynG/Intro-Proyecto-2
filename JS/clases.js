class Universidad {
	constructor(nombre, rif, direccion){
		this._nombre = nombre;
		this._rif = rif;
		this._direccion = direccion;
	}
}

class Facultad {
	constructor(id_universidad, facultad){
		this._id_universidad = id_universidad;
		this._facultad = facultad;
	}
}

class Escuela {
	constructor(id_facultad, escuela){
		this._id_facultad = id_facultad;
		this._escuela = escuela;
		this._nro_carreras = nro_carreras;
	}
}

class Carrera {
	constructor(id_escuela, carrera){
		this._id_escuela = id_escuela;
		this._carrera = carrera;
		this._nro_est = nro_est;
	}
}


class Aula {
	constructor(nro_aula){
		this._nro_aula = nro_aula;
	}
}

class Periodo {
	constructor(tipo, fecha_inicio, fecha_fin, semanas){
		this._tipo = tipo;
		this._fecha_inicio = fecha_inicio;
		this._fecha_fin = fecha_fin;
		this._semanas = semanas;
	}
}

class Aprendizaje {
	constructor(id_alumno, id_asignatura, estado, nota){
		this._id_alumno = id_alumno;
		this._id_asignatura = id_asignatura;
		this._estado = estado;
		this._nota = nota;
	}
}

class Asignatura {
	constructor(asignatura, codigo, uc){
		this._asignatura = asignatura;
		this._codigo = codigo;
		this._uc = uc;
	}
}

class Horario {
	constructor(horario){
		this._horario = horario;
	}
}

class Pensum {
	constructor(id_carrera, asignatura, codigo){
		this._id_carrera = id_carrera;
		this.asignatura = asignatura;
		this._codigo = codigo;
	}
}

class Persona {
	constructor(nombre, cedula, correo){
		this._nombre = nombre;
		this._cedula = cedula; 
		this._correo = correo;
	}
}

class Estudiante extends Persona{
	constructor(nombre, cedula, correo, prepa){
		super(nombre, cedula, correo);
		this._prepa = prepa;
	}
}

class Profesor extends Persona{
	constructor(nombre, cedula, correo, cursos){
		super(nombre, cedula, correo);
		this._cursos = cursos;
	}
}

class Actividad {
	constructor(id_asignatura, actividad, realizada, horas, observaciones){
		this._id_asignatura = id_asignatura;
		this._actividad = actividad; 
		this._realizada = realizada;
		this._horas = horas;
		this._observaciones = observaciones;
	}
}

class notaActividades {
	constructor(id_alumno, id_actividad, nota){
		this._id_alumno = id_alumno;
		this._id_asignatura = id_actividad;
		this._nota = nota;
	}
}