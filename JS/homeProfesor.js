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
                if(objectsAprendizaje[j]["id_asignatura"] == objectsAsignatura[i]["codigo"] && seccionesAsignaturasImpartidas.includes(objectsAprendizaje[j]["seccion"]) && periodosAsignaturasImpartidas.includes(objectsAprendizaje[j]["periodo"])){

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

//OTROS
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
    }
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
            AjusteActividad(30326271,10)

        
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

    for(let i = 0;i < informacionProfesor.length;i++){
        let listaCursos = document.getElementById("cursos_impartidos");
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
    div.setAttribute("onclick",`deleteLista();crearEspecificaciones(${id});deleteMoment();selec();`)

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

    let temp = busqueda(id);
    let arrayEstudiante = informacionProfesor[temp][1];
    let arrayCurso = informacionProfesor[temp][0];


    for (let i = 0; i < arrayEstudiante.length; i++) {
       let tempCI = arrayEstudiante[i][0].id_alumno;
       let tempSeccion = arrayEstudiante[i][0].seccion;
       crearEstudiante(tempCI,tempSeccion,Especificaciones_estudiante);
        
    }
    Especificaciones_asignatura.innerHTML=arrayCurso.nombre;
    Especificaciones_seccion.innerHTML=arrayEstudiante[0][0].seccion;
    Especificaciones_periodo.innerHTML=arrayEstudiante[0][0].periodo;
    Especificaciones_codigo.innerHTML=arrayCurso.codigo;


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
    console.log(apro)
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
                <h3 class="curso_data-item5 curso_data-item">${nota}</h3>
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
    console.log(estudiante)
}