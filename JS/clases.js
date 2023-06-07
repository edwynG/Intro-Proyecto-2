class Universidad {
	constructor(nombre, rif, direccion){
		this.nombre = nombre;
		this.rif = rif;
		this.direccion = direccion;
	}
}

class Facultad {
	constructor(id_universidad, nombre){
		this.id_universidad = id_universidad;
		this.nombre = nombre;
	}
}

class Escuela {
	constructor(id_facultad, nombre){
		this.id_facultad = id_facultad;
		this.nombre = nombre;
		this.nro_carreras = nro_carreras;
	}
}

class Carrera {
	constructor(id_escuela, nombre){
		this.id_escuela = id_escuela;
		this.nombre = nombre;
		this.nro_est = nro_est;
	}
}

class Aula {
	constructor(nro_aula){
		this.nro_aula = nro_aula;
	}
}

class Periodo {
	constructor(tipo, fecha_inicio, fecha_fin, semanas){
		this.tipo = tipo;
		this.fecha_inicio = fecha_inicio;
		this.fecha_fin = fecha_fin;
		this.semanas = semanas;
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

class Asignatura {
	constructor(asignatura, codigo, uc){
		this.asignatura = asignatura;
		this.codigo = codigo;
		this.uc = uc;
	}
}

class Horario {
	constructor(horario){
		this.horario = horario;
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
	constructor(nombre, cedula, email, cursos){
		super(nombre, cedula, email);
		this.cursos = cursos;
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
	constructor(id_alumno, id_actividad, nota){
		this.id_alumno = id_alumno;
		this.id_asignatura = id_actividad;
		this.nota = nota;
	}
}