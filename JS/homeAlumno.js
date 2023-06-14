/*SAM */
//VARIABLES GLOBALES
var dataAsignatura = "", attrAsignatura = [];
var dataAprendizaje = "", attrAprendizaje = [];
var asignaturasInscritas = [], todasAsignaturas = [];
var retirar_materia = document.getElementById("retirar_Materia");
var inscribir_materia=document.getElementById("inscribir_Materia")
var tablaCalificaciones =document.getElementById("calificaciones");


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

class Expediente {
    constructor(){
		this.promedioGeneral = 0;
		this.promedioAsigAprob = 0;
		this.UC = 0;
        this.eficiencia = 0;
        this.materiasInscritas = 0;
        this.materiasRetiradas = 0;
        this.materiasAplazadas = 0;
        this.materiasAprobadas = 0;
        this.materiasPorEQ = 0;
        this.materiasCursadas = 0;
        this.totalAprobadas = 0;
	}
}


//OTROS
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
    }
}

function download(data, nameFile){
    let filename = nameFile + ".txt";
    let text = data;
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

function openPage(name){
    window.open(`${name}.html`,"_blank");
}


//CALCULAR EXPEDIENTE ACADEMICO
let expedienteAcademico = new Expediente();
let aprendizajeEstudiante = [];
function calcularExpedienteAcademico(){
    let contGeneral = 0;
    let contAprobadas = 0;

    for(let i = 0; i < attrAprendizaje.length; i++){
        //MATERIAS RELACIONADAS AL ESTUDIANTE
        if(attrAprendizaje[i]["id_alumno"] === sessionStorage.getItem("userId")){
            expedienteAcademico['promedioGeneral'] += Number(attrAprendizaje[i]["nota"]);
            contGeneral++;
            //ASIGNATURAS INSCRITAS
            if(attrAprendizaje[i]["estado"] != "Retirada"){
                aprendizajeEstudiante.push(attrAprendizaje[i]);
            }

            //ESTADOS DE MATERIAS
            if(attrAprendizaje[i]["estado"] === "Inscrita"){
                expedienteAcademico['materiasInscritas']++;
            }
            else if(attrAprendizaje[i]["estado"] === "Retirada"){
                //tuvo que haber sido inscrita para estar en este estado
                expedienteAcademico['materiasInscritas']++;
                expedienteAcademico['materiasRetiradas']++;
            }
            else if(attrAprendizaje[i]["estado"] === "Aprobada"){
                expedienteAcademico['promedioAsigAprob'] += Number(attrAprendizaje[i]["nota"]);
                //tuvo que haber sido inscrita para estar en este estado
                expedienteAcademico['materiasInscritas']++;
                expedienteAcademico['materiasAprobadas']++;
                expedienteAcademico['materiasCursadas']++;
                contAprobadas++;
            }
            else if(attrAprendizaje[i]["estado"] === "Aplazada"){
                //tuvo que haber sido inscrita para estar en este estado
                expedienteAcademico['materiasInscritas']++;
                expedienteAcademico['materiasAplazadas']++;
                expedienteAcademico['materiasCursadas']++;
            }
            else if(attrAprendizaje[i]["estado"] === "PorEQ"){
                expedienteAcademico['materiasPorEQ']++;
                expedienteAcademico['materiasCursadas']++;
            }
            else if(attrAprendizaje[i]["estado"] === "Cursada"){             
                expedienteAcademico['materiasCursadas']++;
            }
        }  
    }
    expedienteAcademico['promedioGeneral'] = expedienteAcademico['promedioGeneral']/contGeneral;
    expedienteAcademico['promedioAsigAprob'] = expedienteAcademico['promedioAsigAprob']/contAprobadas;
    expedienteAcademico['eficiencia'] = expedienteAcademico['materiasAprobadas']/expedienteAcademico['materiasInscritas'];
    expedienteAcademico['totalAprobadas'] = expedienteAcademico['materiasAprobadas'] + expedienteAcademico['materiasPorEQ'];


    for(let i = 0; i < attrAsignatura.length; i++){
        for(let j = 0; j < aprendizajeEstudiante.length; j++){

            //IGUALAR ASIGNATURAS CON APRENDIZAJE
            if(aprendizajeEstudiante[j]["id_asignatura"] === attrAsignatura[i]["codigo"]){

                //CALCULAR UC DE ASIGNATURAS APROBADAS
                if(aprendizajeEstudiante[j]["estado"] === "Aprobada"){
                    expedienteAcademico["UC"] += Number(attrAsignatura[i]["uc"]);
                }
                attrAsignatura[i]["notaEstudiante"] = aprendizajeEstudiante[j]["nota"];
                
                asignaturasInscritas.push(attrAsignatura[i]);
                
            }
        
        }
        
        todasAsignaturas.push(attrAsignatura[i]);
    }
    todasAsignaturas.shift();
    return expedienteAcademico;
}


//RETIRAR ASIGNATURA
function retirarAsignatura(idAsignatura){
    dataAprendizaje = "";
    let aux = "";
    for(let i = 0; i < attrAprendizaje.length; i++){
        
        if(attrAprendizaje[i]["id_asignatura"] == idAsignatura && attrAprendizaje[i]["id_alumno"] === sessionStorage.getItem("userId")){
            attrAprendizaje[i]["estado"] = 'Retirada';
            
        }
        aux = replaceChars(attrAprendizaje[i]);
        dataAprendizaje += aux;
        if(i != attrAprendizaje.length-1)
            dataAprendizaje += "\n";
    }
    download(dataAprendizaje, 'Aprendizaje');

}


//INSCRIBIR ASIGNATURA
function inscribirAsignatura(idAsignatura){
    dataAprendizaje = "";
    attrAprendizaje.push(new Aprendizaje(sessionStorage.getItem("userId"), idAsignatura.toString(), "Inscrita", "0", "Tipo de examen", "C1", "01-2023"));
    let aux = "";

    for(let i = 0; i < attrAprendizaje.length; i++){
        aux = replaceChars(attrAprendizaje[i]);
        dataAprendizaje += aux;
        if(i != attrAprendizaje.length-1)
            dataAprendizaje += "\n";
    }
    download(dataAprendizaje, 'Aprendizaje');
    
}

//DESCARGAR KARDEX
function descargarKardex(){
    let historialAcademico = "Periodo | Codigo | Seccion | Nombre | UC | Nota | Tipo Examen | Tipo \n";
    for(let i = 0; i < asignaturasInscritas.length; i++){
        historialAcademico += 
        aprendizajeEstudiante[i]["periodo"] + " | " + 
        asignaturasInscritas[i]["codigo"] + " | " + 
        aprendizajeEstudiante[i]["seccion"] + " | " + 
        asignaturasInscritas[i]["nombre"] + " | " + 
        asignaturasInscritas[i]["uc"] + " | " + 
        aprendizajeEstudiante[i]["nota"] + " | " + 
        aprendizajeEstudiante[i]["tipo_examen"] + " | " + 
        "O | " + 
        "\n";
    }
    let kardex = 
    "UNIVERSIDAD CENTRAL DE VENEZUELA FACULTAD DE CIENCIAS DIVISIÓN DE CONTROL DE ESTUDIOS \n" + 
    "DATOS------------------------------------------ \n" + 
    "Licenciatura en computación \n" + 
    "Nombre: " + sessionStorage.getItem("userName") + "\n" + 
    "Cedula: " + sessionStorage.getItem("userId") + "\n" + 
    "Correo: " + sessionStorage.getItem("userEmail") + "\n" + 
    "PROMEDIOS--------------------------------------- \n" + 
    "Promedio general: " + expedienteAcademico["promedioGeneral"].toString() + "\n" + 
    "Promedio asignaturas aprobadas: " + expedienteAcademico["promedioAsigAprob"].toString() + "\n" +
    "Unidades de credito: " + expedienteAcademico["UC"].toString() + "\n" +
    "Eficiencia: " + expedienteAcademico["eficiencia"].toString() + "\n" +
    "RESUMEN------------------------------------------ \n" + 
    "Asignaturas inscritas: " + expedienteAcademico["materiasInscritas"].toString() + "\n" +
    "Asignaturas retiradas: " + expedienteAcademico["materiasRetiradas"].toString() + "\n" +
    "Asignaturas aplazadas: " + expedienteAcademico["materiasAplazadas"].toString() + "\n" +
    "Asignaturas por equivalencia: " + expedienteAcademico["materiasPorEQ"].toString() + "\n" +
    "Asignaturas aprobadas: " + expedienteAcademico["materiasAprobadas"].toString() + "\n" +
    "Asignaturas cursadas: " + expedienteAcademico["materiasCursadas"].toString() + "\n" +
    "Total Aprobadas: " + expedienteAcademico["totalAprobadas"].toString() + "\n" +
    "HISTORIAL ACADEMICO------------------------------ \n" + historialAcademico +
    "NOTA--------------------------------------------- \n" + 
    "Las normas de permanencia se calculan dinámicamente durante todo el semestre, y no es definitivo hasta tanto todas las materias esten retiradas o calificadas";
    
    download(kardex, 'Kardex');
}


//LEER ARCHIVO 
document.getElementById("asignatura").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAsignatura = fr.result;
        textToObject(dataAsignatura, attrAsignatura, "Asignatura");
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("aprendizaje").addEventListener("change", function() {
    var fr = new FileReader();
    console.log(sessionStorage.getItem("userId"));
    fr.onload = function(){
        
        dataAprendizaje = fr.result;
        textToObject(dataAprendizaje, attrAprendizaje, "Aprendizaje");
        if(dataAprendizaje.length > 0)
           // calcularExpedienteAcademico();
            layoutEstrucutrado();
            loopInscribir();
            loopRetirar();
            personStatus();

    }
    fr.readAsText(this.files[0]);
});


/*EDWYN*/

// /*Moverse entre paginas ********/
let dataMaestra = document.getElementById("dataMaestra");
dataMaestra.addEventListener("click",() => openPage("dataMaestra"))

const template_inicio = document.getElementById("template_Inicio");
const template_materias = document.getElementById("template_materias");


const pageInicio= document.getElementById("inicio");
const pageMaterias = document.getElementById("materias");

pageInicio.addEventListener("click",()=>{
    if(template_inicio.classList.contains("template")){
    template_inicio.classList.toggle("template")
    template_materias.classList.toggle("template")
    }
} );

pageMaterias.addEventListener("click",()=>{
    if(template_materias.classList.contains("template")){
        template_materias.classList.toggle("template")
        template_inicio.classList.toggle("template")
    }
} );
// /************************** */




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
function sessionUser(name, id, email, otro){
    sessionStorage.setItem("userName", name.toString());
    sessionStorage.setItem("userId", id.toString());
    sessionStorage.setItem("userEmail", email.toString());
    sessionStorage.setItem("userOtro", otro.toString());
}

document.querySelector("#userExit").addEventListener("click",()=>{
    document.querySelector(".container_list-exit").classList.toggle("list_user-exit");
})

document.getElementById("cerrarSesion").addEventListener("click",()=> {
    window.open("index.html","_self");
    window.close("homeAlumno.html");
    sessionUser("none", "none", "none", "none");
});

// document.querySelector(".container_person-close").addEventListener("click",()=> {
//    window.open("index.html");
//    window.close();
//    sessionUser("none", "none", "none", "none");
// });

/************************** */


/* Funcion para cerrar ventana emergente */


function cerrarCargaDeArchivo(){
    let temp =document.getElementById("contenedor_load-file");
    temp.style.display="none";
}

function btnContinuarSesion(){
    const btn = document.getElementById("btn_result");
    btn.classList.toggle("btn_file-load")
}


    /*importa nodos */
    var close1,close2;
    const file1Emergente = document.getElementById("asignatura");
    const file2Emergente = document.getElementById("aprendizaje");
    /*estado de los inputs */
    let value1Emergente =file1Emergente.value;
    let value2Emergente=file2Emergente.value;

    /*Valida si se subio un archivo*/
    
    file1Emergente.addEventListener("change",(e)=>{
        if(file1Emergente.value != value1Emergente){
            close2=true;
        }

        file2Emergente.addEventListener("change",(e)=>{
        
            if(file2Emergente.value != value2Emergente ){
             close1=true;
            }
            if(close1 && close2){
                btnContinuarSesion();
                const temp =document.querySelectorAll(".btn_file");

                for (let index = 0; index < temp.length; index++) {
                    temp[index].style.background="#69E0C3"
                    
                }

                document.querySelector(".file_item-title h1").style.color="#111";
                
          }
         })
        
         
    })


    file2Emergente.addEventListener("change",(e)=>{
        
        if(file2Emergente.value != value2Emergente ){
         close1=true;
        }

        file1Emergente.addEventListener("change",(e)=>{
            if(file1Emergente.value != value1Emergente){
                close2=true;
            }
    
            if(close1 && close2){
                btnContinuarSesion();
                const temp =document.querySelectorAll(".btn_file");

                for (let index = 0; index < temp.length; index++) {
                    temp[index].style.background="#7EB2FD"
                    
                }
                
                document.querySelector(".file_item-title h1").style.color="#111";
  
             }
            
             
        })
    })
    
    /*boton evento para cerrar ventana emergente */
    document.getElementById("btn_result").addEventListener("click",cerrarCargaDeArchivo)
    

/************************************** */


/*Funciones para data dinamica en el layout */
    /*box dinamicas*/
const mainMaterias = document.getElementById("main_Materias");
const boxRetirarMateria = document.getElementById("retirarMateria");
const boxInscribirMateria = document.getElementById("inscribirMateria");

function layoutEstrucutrado(){
    /*Estado */ 
    let userDate= sessionStorage;
    const boxEficiencia = document.getElementById("box_Eficiencia");
    const boxUC = document.getElementById("box_U-C");
    const boxPG = document.getElementById("box_P-G");
    const boxAsingA = document.getElementById("box_Asig-A");
    const boxUser = document.getElementById("box_user");
    const boxCorreo = document.getElementById("box_Correo");

    /***************/
    /*Asignaturas */
    const boxInscrita = document.getElementById("box_Inscrita");
    const boxCursada = document.getElementById("box_Cursada");
    const boxRetirada = document.getElementById("box_Retirada");
    const boxAplazada = document.getElementById("box_Aplazada");
    const boxAprovada = document.getElementById("box_Aprovada");
    const boxEquivalecia = document.getElementById("box_Equivalencia");
    const boxTA = document.getElementById("box_Total-A");
    const boxPA = document.getElementById("box_PA");
    /***************/
    /*Data Academica*/
    const DataAcademica = calcularExpedienteAcademico();
    console.log(DataAcademica)
    /*div dinamico*/
    
    /*estado */
    boxEficiencia.innerHTML=DataAcademica.eficiencia.toFixed(2).replace(/\.?0+$/, '');
    boxUC.innerHTML=DataAcademica.UC.toFixed(2).replace(/\.?0+$/, '');
    boxPG.innerHTML=DataAcademica.promedioGeneral.toFixed(2).replace(/\.?0+$/, '');
    boxAsingA.innerHTML=DataAcademica.promedioAsigAprob.toFixed(2).replace(/\.?0+$/, '');
    let userName = userDate.getItem("userName");
    boxUser.innerHTML= userName;
    boxCorreo.innerHTML=userDate.getItem("userEmail");
    

    /*Asignatura*/
    boxInscrita.innerHTML=DataAcademica.materiasInscritas.toFixed(2).replace(/\.?0+$/, '');
    boxCursada.innerHTML=DataAcademica.materiasCursadas.toFixed(2).replace(/\.?0+$/, '');
    boxRetirada.innerHTML=DataAcademica.materiasRetiradas.toFixed(2).replace(/\.?0+$/, '');
    boxAplazada.innerHTML=DataAcademica.materiasAplazadas.toFixed(2).replace(/\.?0+$/, '');
    boxAprovada.innerHTML=DataAcademica.materiasAprobadas.toFixed(2).replace(/\.?0+$/, '');
    boxEquivalecia.innerHTML=DataAcademica.materiasPorEQ.toFixed(2).replace(/\.?0+$/, '');
    boxTA.innerHTML=DataAcademica.totalAprobadas.toFixed(2).replace(/\.?0+$/, '');

    for (let index = 0; index < asignaturasInscritas.length; index++) {
        appendMateria(asignaturasInscritas[index].nombre,asignaturasInscritas[index].codigo,mainMaterias,true)
        appendMateria(asignaturasInscritas[index].nombre,asignaturasInscritas[index].codigo,boxRetirarMateria,true)
        tablaDeCalificaciones(asignaturasInscritas[index].nombre,asignaturasInscritas[index].codigo,asignaturasInscritas[index].uc,asignaturasInscritas[index].notaEstudiante,tablaCalificaciones)
        
    }

    for (let index = 1; index < todasAsignaturas.length; index++) {
        appendMateria(todasAsignaturas[index].nombre,todasAsignaturas[index].codigo,boxInscribirMateria,false)
        
    }
   



}

function tablaDeCalificaciones(name,id,uc,nota,lugar){
    let div = document.createElement("DIV")
    let content = `
                        <h2 class="data_item1 data_item">${name}</h2>
                        <h3 class="data_item2 data_item">${id}</h3>                     
                        <h3 class="data_item3 data_item">${uc}</h3>
                        <h3 class="data_item4 data_item">${nota}</h3>
                    `
    div.classList.add("tabla-date");
    div.setAttribute("id",`${id}`);
    div.innerHTML=content;
    lugar.appendChild(div);
}

function appendMateria(name,id,lugar,ios){
    let box = document.createElement("DIV");
    let content;
    if(ios){
        content = ` 

                        <div class="name_materias-proceso">
                            <h2>${name}</h2>
                            <span>${id}</span> 
                        
                        </div>
                        <label class="fa-solid fa-xmark icon_btn_materia" id="retirar_Materia" onclick="retirarAsignatura(${id}); isRetirada();"></label>
                       
                    `

                    box.classList.add("items-proceso-Materias");
                    box.classList.add("contianer_item-retirar");
                    box.setAttribute("id",`${id}`)
    }else{
        
        content = ` 
                        <div class="name_materias-proceso">
                            <h2>${name}</h2>
                            <span>${id}</span> 
                        </div>
                        <label class="fa-solid fa-check icon_btn_materia" id="inscribir_Materia" onclick="inscribirAsignatura(${id}); isInscrita();"></label>
                        

                    `
        box.classList.add("items-proceso-Materias");
        box.classList.add("contianer_item-inscribir");
        box.setAttribute("id",`${id}`)


    }
    box.innerHTML=content;
    lugar.appendChild(box);
}

/************* */


/*Elminar materias */




function materiaRetirada(nodo){
    deleteMateria(nodo.parentNode.getAttribute("id"))
    loopInscribir();
}


 function materiaInscribir(nodo){
     let id = nodo.parentNode.getAttribute("id")
     nodo.parentNode.remove();
     let name=busqueda(id,todasAsignaturas,true);
     appendMateria(name,id,mainMaterias,true);
     appendMateria(name,id,boxRetirarMateria,true);
     loopRetirar();
     let index=busqueda(id,todasAsignaturas,false);

     tablaDeCalificaciones(todasAsignaturas[index].nombre,todasAsignaturas[index].codigo,todasAsignaturas[index].uc,todasAsignaturas[index].notaEstudiante,tablaCalificaciones)

 }


function deleteMateria(id){

    let materia =document.querySelectorAll(`[id="${id}"] `)
    for (let index = 0; index < materia.length; index++) {
        materia[index].remove();
        
    }
    
}

function busqueda(params,arr,boleano) {
    for (let index = 0; index < arr.length; index++) {
        if(arr[index].codigo == params){
            if(boleano){
                return arr[index].nombre;

            }else{
                return index;
            }
        }
    }
}

function loopRetirar(){
    retirar_materia = document.querySelectorAll("#retirar_Materia");
    for (let i = 0; i <  retirar_materia.length; i++) {
        retirar_materia[i].addEventListener('click', function(event) {
          let nodoSeleccionado = event.currentTarget;
            nodoSeleccionado=nodoSeleccionado.parentNode.getAttribute("id");
            deleteMateria(nodoSeleccionado);
           
        });
      }
}

function loopInscribir(){
    inscribir_materia=document.querySelectorAll("#inscribir_Materia");
    for (let i = 0; i < inscribir_materia.length; i++) {
       
       
        inscribir_materia[i].addEventListener('click', function(event) {
          const nodoSeleccionado = event.currentTarget;
          materiaInscribir(nodoSeleccionado);
          

        });
      }
}

function personStatus(){
    let cache = sessionStorage;
    let divCi= document.querySelectorAll("#ci_list");

    for(let i = 0;i < divCi.length;i++){
        divCi[i].innerHTML= "V" + cache.getItem("userId");
    }
}

function isRetirada(){
        let inscritas = document.getElementById("box_Inscrita");
        let retiradas = document.getElementById("box_Retirada");
        let cantidadIns = parseInt(inscritas.textContent,10);
        let cantidadRet = parseInt(retiradas.textContent,10);
        inscritas.innerHTML=cantidadIns-1;
        retiradas.innerHTML=cantidadRet+1;
}

function isInscrita(){
    let inscritas = document.getElementById("box_Inscrita");
    let cantidadIns = parseInt(inscritas.textContent,10);
    inscritas.innerHTML=cantidadIns+1;

}
/************************************** */
