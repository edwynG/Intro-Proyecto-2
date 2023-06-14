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

function openPage(name){
    window.open(`${name}.html`,"_blank");
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
            initLayout();
            personStatus();
             asignaturasLibres=  obtenerAsignaturasLibres();

            manejoAsignaturas();
            listaDeCursosImpartidos();
            document.getElementById("btn_result").classList.toggle("hidden");
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
        readyInfo();
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
    let newAprendizaje = objectsAprendizaje.find(aprendizaje => (aprendizaje['id_alumno'] == id_alumno) && (aprendizaje['id_asignatura'] == id_asignatura));
    
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
        if(i != objectsAprendizaje.length-1)
            dataAprendizaje += "\n";
    }

    download(dataAprendizaje, 'Aprendizaje');
}


//CAMBIAR HORAS, OBSERVACIONES Y NOTA
function saveInfoActividad(id_actividad, id_asignatura, id_alumno){
    clickButton("submitInfoActividad");
    
    //ENCONTRAR MODIFICADO EN ARRAY
    let newActividad = objectsActividades.find(actividad => actividad['id_actividad'] == id_actividad);
    let newNotaActividad = objectsNotasActvidades.find(nota => (nota['id_actividad'] == id_actividad) && (nota['id_asignatura'] == id_asignatura) && (nota['id_alumno'] == id_alumno));
    
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
        if(i != objectsActividades.length-1)
            dataActividades += "\n";
    }

    download(dataActividades, 'Actividad');

    //MODIFICAR TXT NOTASACTIVIDADES
    dataNotasActvidades = "";
    aux = "";

    for(let i = 0; i < objectsNotasActvidades.length; i++){
        aux = replaceChars(objectsNotasActvidades[i]);
        dataNotasActvidades += aux;
        if(i != objectsNotasActvidades.length-1)
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
        if(i != objectsProfesor.length-1)
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
let dataMaestra = document.getElementById("dataMaestra");
dataMaestra.addEventListener("click",() => openPage("dataMaestra"))


function readyInfo(){
        
            document.getElementById("btn_result").removeAttribute("disabled");
            document.querySelector(".file_item-title h1").style.color="#111";
          let btn=  document.querySelectorAll(".btn_file")
            for(let i=0;i <btn.length;i++){
                btn[i].style.background="#69E0C3";
            }
}


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

/*Cerrar modal de ajuste de actividades */

document.getElementById("close_notas-icon").addEventListener("click",()=>{
    document.getElementById("modal_Ajuste-actividades").classList.toggle("hidden")
})

/*Cerrar modal de ajuste de nota general */

document.getElementById("close_notaGeneral-icon").addEventListener("click",()=>{
    document.getElementById("container_Ajuste-general").classList.toggle("hidden")

})

/**************************** */

/*Inicioo*/
function initLayout(){
    let listaCursos = document.getElementById("cursos_impartidos");
    listaCursos.innerHTML="";
    for(let i = 0;i < informacionProfesor.length;i++){
        let curso_name= informacionProfesor[i][0].nombre;
        let curso_id = informacionProfesor[i][0].codigo;
        crearListaCurso(curso_name,curso_id,listaCursos);

    }
}

function crearListaCurso(params,id,lugar) {
    let div = document.createElement("LI");
    let content = `${params}`
    div.classList.add("curso_item");
    div.setAttribute("id",id)
    div.setAttribute("onclick",`deleteMoment();selec();deleteLista();crearEspecificaciones(${id});`)

    div.innerHTML=content;
    lugar.appendChild(div);
}

function deleteLista(){
    let temp = document.querySelectorAll(".curso_item-temp");

    for (let i = 0; i < temp.length; i++) {
       temp[i].remove()
        
    }
}


function crearEspecificaciones(id){
    let Especificaciones_estudiante= document.getElementById("Especificaciones_curso");
    let Especificaciones_asignatura= document.getElementById("Especificaciones_curso-asignatura");
    let Especificaciones_seccion= document.getElementById("Especificaciones_curso-seccion");
    let Especificaciones_periodo= document.getElementById("Especificaciones_curso-periodo");
    let Especificaciones_codigo= document.getElementById("Especificaciones_curso-codigo");
    let error=document.getElementById("moment_date-curso-error");
    let inicio =document.getElementById("moment_date-curso");
    let case1 = document.getElementById("especificaciones_curso-itemA");
    let case2 = document.getElementById("Especificaciones_curso");

    let temp = busqueda(id);
  
    let arrayEstudiante = informacionProfesor[temp][1];
    let arrayCurso = informacionProfesor[temp][0];

    if( (arrayEstudiante != undefined) && (arrayCurso != undefined)){
        inicio.classList.remove("hidden");
        case1.classList.remove("hidden");
        case2.classList.remove("hidden");
        error.classList.add("hidden");
        document.getElementById("moment_date-curso").classList.add("hidden");
        document.getElementById("container_3-h1").innerHTML=`Seleccione a un estudiante`;


        for (let i = 0; i < arrayEstudiante.length; i++) {
        let tempCI = arrayEstudiante[i][0].id_alumno;
        let tempSeccion = arrayEstudiante[i][0].seccion;
        crearEstudiante(tempCI,tempSeccion,Especificaciones_estudiante);
            
        }
        Especificaciones_asignatura.innerHTML=arrayCurso.nombre;
        Especificaciones_seccion.innerHTML=arrayEstudiante[0][0].seccion;
        Especificaciones_periodo.innerHTML=arrayEstudiante[0][0].periodo;
        Especificaciones_codigo.innerHTML=arrayCurso.codigo;

   }else{
    inicio.classList.add("hidden");
    case1.classList.add("hidden");
    case2.classList.add("hidden");
    error.classList.remove("hidden");
    document.getElementById("container_3-h1").innerHTML=`Oops! al parecer no hay contenido de la asignatura ${id},porfavor espere a que haya información acerca del curso`;


   }

}


function crearEstudiante(ci,seccion,lugar){
    let div = document.createElement("DIV");
    let content = `
                        <h2 class="list_estudiante-CI">${ci}</h2>
                        <h2 class="list_estudiante-${seccion}">C1</h2>
                        <button class="list_btn-actividades" onclick="TablaActividade(${ci}); addselec();tablaCali();">Acividades</button>
                  `
    div.classList.add("curso_estudiantes");
    div.classList.add("curso_item-temp");

    div.innerHTML=content;
    lugar.appendChild(div);
}

function TablaActividade(id){
        deleteTabla();
        let asignatura =busquedaEstudiante(id,true);
        let alumno= busquedaEstudiante(id,false);
        let estudiante= informacionProfesor[asignatura][1][alumno];
        let CI=estudiante[0].id_alumno;
        
        for (let i = 0; i < estudiante[1].length; i++) {
            let actividad=estudiante[1][i]
            let  acti = actividad.nombre;
            let ob =actividad.observaciones;
            let reali=actividad.realizada;
            let  time = actividad.horas;
            let nota = actividad.notaEstudiante;
            let id_acti = actividad.id_actividad
            
            crearTablaNotas(acti,ob,reali,time,nota,id_acti);


        }

        document.getElementById("calificaciones_title").innerHTML=CI;
        ConfigActividades(estudiante[0].id_asignatura,CI)
        
    }


function busquedaEstudiante(int,k){
    for (let index = 0; index < informacionProfesor.length; index++) {

      if(k){
        for (let j = 0; j < informacionProfesor[index][1].length; j++) {
            if(informacionProfesor[index][1][j][0].id_alumno == int){
                return index;
            }
            
           }
      }else{
        for (let j = 0; j < informacionProfesor[index][1].length; j++) {
            if(informacionProfesor[index][1][j][0].id_alumno == int){
                return j;
            }
            
           }
      }
        
    }

    return -1;
}


function busqueda(int){
    for (let index = 0; index < informacionProfesor.length; index++) {
        if(informacionProfesor[index][0].codigo == int){
            return index;
        }
        
    }

    return -1;
}

function deleteMoment(){
    document.getElementById("especificaciones_curso-itemA").classList.remove("hidden")
    document.getElementById("Especificaciones_curso").classList.remove("hidden")
    document.getElementById("moment_date-curso").classList.add("hidden")
}


function crearTablaNotas(actividad,ob,apro,hora,nota,num){
    let lugar=document.getElementById("calificaciones");
    if(apro){
        apro="si";
    }else{
        apro="No";
    }
    let div = document.createElement("DIV")
    
    let content = `
                <h2 class="curso_data-item1 curso_data-item" id="selecActividad">${actividad}</h2>
                <h3 class="curso_data-item2 curso_data-item">${ob}</h3>                     
                <h3 class="curso_data-item3 curso_data-item">${apro}</h3>
                <h3 class="curso_data-item4 curso_data-item">${hora}</h3>
                <h3 class="curso_data-item5 curso_data-item" >${nota}</h3>
    `
    div.innerHTML=content;
    div.setAttribute("id",num)
    div.classList.add("tabla-date");
    div.classList.add("tabla-date");

    div.setAttribute("name","temp");
    lugar.appendChild(div)

   
}

function deleteTabla(){
    let temp = document.querySelectorAll(`[name="temp"]`);
    for (let i = 0; i < temp.length; i++) {
        temp[i].remove();
        
    }
}


const selec =  ()=>{
    document.getElementById("container_3-h1").classList.remove("hidden");
    document.querySelector(".tabla_calificaciones").classList.add("hidden");

        
}

const addselec =  ()=>{
    document.getElementById("container_3-h1").classList.add("hidden")

        
}

const tablaCali= ()=>{
    document.querySelector(".tabla_calificaciones").classList.remove("hidden")

}



function ConfigActividades(codigo,ci){
    let temp = document.querySelectorAll("#selecActividad");
    let id_actividad;
   for (let i = 0; i < temp.length; i++) {
    temp[i].addEventListener("click",(e)=>{
        let t = e.currentTarget;
        id_actividad = t.parentNode.getAttribute("id");
        generarbtnCofig(id_actividad,codigo,ci);
        
    })
    
    }
}

function generarbtnCofig(actividad,codigo,ci){
    let btn_guardar_cofig= document.getElementById("btn_ajusteNotas");
    btn_guardar_cofig.setAttribute("onclick",`saveInfoActividad(${actividad}, ${codigo}, ${ci});AjusteActividad(${ci},${actividad})`)
    document.getElementById("modal_Ajuste-actividades").classList.remove("hidden")
    

}

function busquedaPorActividad(int){
    for (let index = 0; index < informacionProfesor.length; index++) {
    
        for (let j = 0; j < informacionProfesor[index][1].length; j++) {

            for (let k = 0; k <  informacionProfesor[index][1][j][1].length; k++) {
   
                if(informacionProfesor[index][1][j][1][k].id_actividad == int){
                            return k;
                        }
                
            }
            
        }
      
        
    }
    
        return -1;
    
}


function AjusteActividad(id,tip) {
    let asignatura =busquedaEstudiante(id,true);
    let alumno= busquedaEstudiante(id,false);
    let tipo=busquedaPorActividad(tip)
    let estudiante= informacionProfesor[asignatura][1][alumno][1][tipo];
    
    let inputNota = document.getElementById("ajustesNotas_input");
    let inputObs = document.getElementById("ajustesObservaciones_input");
    let inputHora = document.getElementById("ajusteshoras_input");

    estudiante.notaEstudiante=inputNota.value;
    estudiante.horas=inputHora.value;
    estudiante.observaciones=inputObs.value;
    TablaActividade(id);
    document.getElementById("modal_Ajuste-actividades").classList.toggle("hidden");
    inputNota.value="";
    inputObs.value="";
    inputHora.value="";

}


/****interactividad inicio *****/

 document.getElementById("cambioInicio").addEventListener("click",cambiar_A_Inicio);
document.getElementById("cambioCurso").addEventListener("click",cambiar_A_Cursos);


function cambiar_A_Inicio(){
    let temp = document.getElementById("incioPage");
    let temp2 = document.getElementById("cursosPage");

   if(temp.classList.contains("hidden")){
     temp.classList.remove("hidden");
     temp2.classList.add("hidden");
   }

}

function cambiar_A_Cursos(){
    let temp = document.getElementById("cursosPage");
    let temp2 = document.getElementById("incioPage");

    if(temp.classList.contains("hidden")){
        temp.classList.remove("hidden");
        temp2.classList.add("hidden");

      } 
}



function asignaturasDadas(){
    let contenedorAsignaturas = document.getElementById("AsignaturasDadas");
    contenedorAsignaturas.innerHTML="";

    for (let i = 0; i < informacionProfesor.length; i++) {
        let name =informacionProfesor[i][0].nombre;
        let codex = informacionProfesor[i][0].codigo;
        let div= document.createElement("DIV");
        let content = ` 
                        <div class="name_materias-proceso">
                            <h2>${name}</h2>
                            <span>${codex}</span> 
                        </div>
                        <i class="fa-regular fa-folder-closed"></i>
                        `
        div.classList.add("contianer_item-inscribir")
        div.classList.add("items-proceso-Materias")
        div.setAttribute("id",`${codex}`)
        div.innerHTML=content;
        contenedorAsignaturas.appendChild(div);
        
    }    
}

function manejoAsignaturas(){
   
    let containerDisponibles = document.getElementById("cursosDisponibles");
    containerDisponibles.innerHTML="";
  
   for (let i = 0; i< asignaturasLibres.length; i++) {
    let name =asignaturasLibres[i].nombre;
    let codex = asignaturasLibres[i].codigo;
    let div= document.createElement("DIV");
    let content = ` 
                    <div class="name_materias-proceso">
                        <h2>${name}</h2>
                        <span>${codex}</span> 
                    </div>
                    <label class="fa-solid fa-check icon_btn_materia icon_btn_materia-mxd" id="DarAsignatura" onclick="inscribirAsignatura(${codex});listaDeCursosImpartidos();" title="Inscribir"></label>
                    
                    `
    div.classList.add("contianer_item-inscribir")
    div.classList.add("items-proceso-Materias")
    div.setAttribute("id",`${codex}`)
    div.innerHTML=content;
    containerDisponibles.appendChild(div);
    
   }

   asignaturasDadas();
   trasladoDeMateria();
}

function trasladoDeMateria(){
    let temp = document.querySelectorAll("#DarAsignatura");
    
    for(let i = 0; i < temp.length;i++){
        temp[i].addEventListener("click",(e)=>{
            let object = e.currentTarget;
            let id = object.parentNode.getAttribute("id");
            configAsignatura(id);
            object.parentNode.remove();
        })
    }
}


function deleteAsignatura(id){
    let temp = document.querySelectorAll(`[id="${id}"]`);
    for (let i = 0; i < temp.length; i++) {
       temp[i].remove;
        
    }
}

function configAsignatura(id){
    let temp = asignaturasLibres.find((object)=> (object.codigo == id))
    temp = [temp];
    informacionProfesor.push(temp);
    asignaturasDadas();
    initLayout();

}

/******lista de cursos impartidos*/
var contenedorListaDecursos =document.getElementById("listaCursosImpartidos");
var contendorTablaEstudiante = document.getElementById("EstudiantesCursos");


function listaDeCursosImpartidos(){
    contenedorListaDecursos.innerHTML="";
    
        for (let i = 0; i < informacionProfesor.length; i++) {
           if(informacionProfesor[i].length > 1){
            let name =informacionProfesor[i][0].nombre;
            let codigo =informacionProfesor[i][0].codigo;
            agregarAlaLista(name,codigo);
            listaDesplegar(codigo);
           }
            
        }
}

function agregarAlaLista(name,id){
    let li = document.createElement("LI");
    let content=`

                        <div class="curso_item_li-date">
                        <h3>${name}</h3>
                        <h3>${id}</3>
                        </div>
                        <div class="iconlistcursos" id="cotainerIcon">
                            <i class="fa-regular fa-star" id="cursosImparatidos-icon${id}"></i>
                         </div>
                
                `;
    li.classList.add("cursos_item-li");
    li.setAttribute("id",`${name}`)
    li.innerHTML=content;
    contenedorListaDecursos.appendChild(li);
}

function listaDesplegar(codigo){
    let btn_ico = document.getElementById("cursosImparatidos-icon"+codigo);

    btn_ico.addEventListener("click",(e)=>{
        let aux = e.currentTarget;
        let temp = aux.parentNode.parentNode.getAttribute("id");
        desplegar(temp);
        hiddenLista();
    })
}

function desplegar(codigo){
    contendorTablaEstudiante.innerHTML="";
        let indice = buscarPorNombre(codigo);
        let temp = informacionProfesor[indice][1];
        let nombreAsignatura =informacionProfesor[indice][0].nombre;

        for (let i = 0; i < temp.length; i++) {
            let name= temp[i][0].id_alumno;
            let estado = temp[i][0].estado;
            let nota = temp[i][0].nota;
            let id= temp[i][0].id_asignatura;
            let examen = temp[i][0].tipo_examen;
            generarDataCursosImpartidos(name,estado,nota,examen,id);
        }
        document.getElementById("name_lista_curso-asignatura").innerHTML=nombreAsignatura;
        cambiarDatosGnerales();
}


function generarDataCursosImpartidos(name,estado,nota,exam,id){
        //(estado)?estado="Si":estado="No";
        let div = document.createElement("DIV");

        let content=`
        
                        <h3 class="student_name" id="CambiarValoreesGenerale" >${name}</h3>
                        <h3 class="student_apro">${estado}</h3>
                        <h3 class="item_examen">${exam}</h3>
                        <h3 class="student_nota">${nota}</h3>
                    
                    `;

        div.classList.add("student_list");
        div.setAttribute("id",`V${name}`);
        div.setAttribute("name",`#${id}`);

        div.innerHTML=content;
        contendorTablaEstudiante.appendChild(div);
        
}

function deleteCursosImpartido(){
    let temp = document.querySelectorAll(".tempCursos");
    for (let i = 0; i < temp.length; i++) {
        temp[i].remove();
        
    }
}

function buscarPorNombre(k){
        for(let i = 0;i< informacionProfesor.length;i++){
            if (informacionProfesor[i][0].nombre == k) {
                return i;
            }
        }
}


/*Retrocede a la lista nuevamente */

document.getElementById("retroceder_icon").addEventListener("click",hiddenLista);

function hiddenLista(){
    document.getElementById("listaEstudiantesDelprofesor").classList.toggle("hidden");
    document.getElementById("listaDelProfesor").classList.toggle("hidden");
}

/**Cambiar valores generales de los estudiantes */

function cambiarDatosGnerales(){
        let temp =document.querySelectorAll("#CambiarValoreesGenerale");
        let btn = document.getElementById("btn_actualizar_general");
        for (let i = 0; i < temp.length; i++) {
            temp[i].addEventListener("click",(e)=>{
                    let tag = e.currentTarget;
                    let name= tag.parentNode.getAttribute("id");
                    let id= tag.parentNode.getAttribute("name");
                    id = id.substring(1,id.length);
                    name = name.substring(1,name.length);
                    btn.setAttribute("onclick",`saveInfoAsignatura(${name}, ${id});ActualizarInfoGeneral(${name}, ${id})`)
                    document.getElementById("name_estudiante_curso_general").innerHTML=name;
                    document.getElementById("container_Ajuste-general").classList.toggle("hidden");
            })
            
        }
}

function busquedaPorMateria(int,id){
    for (let index = 0; index < informacionProfesor.length; index++) {

        for (let j = 0; j < informacionProfesor[index][1].length; j++) {
            if(informacionProfesor[index][1][j][0].id_alumno == int){
                if(informacionProfesor[index][0].codigo ==id){
                     return index;

                }
            }
            
        }
    }

    return -1;
} 


function ActualizarInfoGeneral(cedula,id){
    let inputNota = document.getElementById("inputGeneralAlumnoNota");
    let inputActividad = document.getElementById("inputGeneralAlumnoActiviadad");
    
    let materia = busquedaPorMateria(cedula,id);
    let estudiante = busquedaEstudiante(cedula,false);
    
    if((materia != -1) && (estudiante != -1)){
        let arr = informacionProfesor[materia][1][estudiante][0];
        arr.nota=inputNota.value;
        arr.tipo_examen=inputActividad.value;
        let tempName=busqueda(id);
        desplegar(informacionProfesor[tempName][0].nombre);
        document.getElementById("container_Ajuste-general").classList.toggle("hidden");
        inputNota.value="";
        inputActividad.value=""

    }
}