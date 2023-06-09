/*SAM */
//VARIABLES GLOBALES
var dataAsignatura = "", attrAsignatura = [];
var dataAprendizaje = "", attrAprendizaje = [];
var asignaturasInscritas = [], todasAsignaturas = [];
var retirar_materia = document.getElementById("retirar_Materia");
var inscribir_materia=document.getElementById("inscribir_Materia")

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

class Expediente {
    constructor(){
		this.promedioGeneral = 0;
		this.promedioAsigAprob = 0;
		this.UC = 0;
        this.eficiencia = 0;
        this.materiasInscritas = 0;
        this.materiasRetiradas = 0;
        this.materiasAplazadas = 0;
        this.materiasPorEQ = 0;
        this.materiasAprobadas = 0;
        this.materiasCursadas = 0;
	}
}


//CALCULAR EXPEDIENTE ACADEMICO
function calcularExpedienteAcademico(){
    let expedienteAcademico = new Expediente();
    let contGeneral = 0;
    let contAprobadas = 0;
    let aprendizajeEstudiante = [];

    for(let i = 0; i < attrAprendizaje.length; i++){
        //MATERIAS RELACIONADAS AL ESTUDIANTE
        if(attrAprendizaje[i]["id_alumno"] === sessionStorage.getItem("userId")){
            aprendizajeEstudiante.push(attrAprendizaje[i]);
            expedienteAcademico['promedioGeneral'] += Number(attrAprendizaje[i]["nota"]);
            contGeneral++;

            //ESTADOS DE MATERIAS
            if(attrAprendizaje[i]["estado"] === "Aprobada"){
                expedienteAcademico['promedioAsigAprob'] += Number(attrAprendizaje[i]["nota"]);
                //tuvo que haber sido inscrita para estar en este estado
                expedienteAcademico['materiasInscritas']++;
                expedienteAcademico['materiasAprobadas']++;
                contAprobadas++;
            }
            else if(attrAprendizaje[i]["estado"] === "Inscrita"){
                expedienteAcademico['materiasInscritas']++;
            }
            else if(attrAprendizaje[i]["estado"] === "Retirada"){
                //tuvo que haber sido inscrita para estar en este estado
                expedienteAcademico['materiasInscritas']++;
                expedienteAcademico['materiasRetiradas']++;
            }
            else if(attrAprendizaje[i]["estado"] === "Aplazada"){
                //tuvo que haber sido inscrita para estar en este estado
                expedienteAcademico['materiasInscritas']++;
                expedienteAcademico['materiasAplazadas']++;
            }
            else if(attrAprendizaje[i]["estado"] === "PorEQ"){
                expedienteAcademico['materiasPorEQ']++;
            }
            else if(attrAprendizaje[i]["estado"] === "Cursada"){
                //tuvo que haber sido inscrita para estar en este estado
                expedienteAcademico['materiasInscritas']++;
                expedienteAcademico['materiasCursadas']++;
            }
        }  
    }
    expedienteAcademico['promedioGeneral'] = expedienteAcademico['promedioGeneral']/contGeneral;
    expedienteAcademico['promedioAsigAprob'] = expedienteAcademico['promedioAsigAprob']/contAprobadas;
    expedienteAcademico['eficiencia'] = expedienteAcademico['materiasAprobadas']/expedienteAcademico['materiasInscritas'];


    for(let i = 0; i < attrAsignatura.length; i++){
        for(let j = 0; j < aprendizajeEstudiante.length; j++){

            //IGUALAR ASIGNATURAS CON APRENDIZAJE
            if(aprendizajeEstudiante[j]["id_asignatura"] === attrAsignatura[i]["codigo"]){

                //CALCULAR UC DE ASIGNATURAS APROBADAS
                if(aprendizajeEstudiante[j]["estado"] === "Aprobada"){
                    expedienteAcademico['UC'] += Number(attrAsignatura[i]["uc"]);
                }
                attrAsignatura[i]["notaEstudiante"] = aprendizajeEstudiante[j]["nota"];
                
                asignaturasInscritas.push(attrAsignatura[i]);
                
            }
        
        }
        
        todasAsignaturas.push(attrAsignatura[i]);
        
    }

    return expedienteAcademico;
}

//RETIRAR ASIGNATURA
function retirarAsignatura(idAsignatura){
    console.log("funciona el btn")
    dataAprendizaje = "";
    let aux = "";
    for(let i = 0; i < attrAprendizaje.length; i++){
        
        if(attrAprendizaje[i]["id_asignatura"] == idAsignatura && attrAprendizaje[i]["id_alumno"] === sessionStorage.getItem("userId")){
            attrAprendizaje[i]["estado"] = 'Retirada';
            
        }
        aux = JSON.stringify(Object.values(attrAprendizaje[i])).replaceAll('"', '');
        aux = aux.replaceAll(',', ';');
        aux = aux.replaceAll('[', '');
        aux = aux.replaceAll(']', '');
        
        dataAprendizaje += aux;
        dataAprendizaje += "\n";
    }
    download(dataAprendizaje, 'Aprendizaje');

}

//INSCRIBIR ASIGNATURA
function inscribirAsignatura(idAsignatura){
    dataAprendizaje = "";
    attrAprendizaje.push(new Aprendizaje(sessionStorage.getItem("userId"), idAsignatura.toString(), "Inscrita", "0", "Tipo de examen"));
    let aux = "";

    for(let i = 0; i < attrAprendizaje.length; i++){
        aux = JSON.stringify(Object.values(attrAprendizaje[i])).replaceAll('"', '');
        aux = aux.replaceAll(',', ';');
        aux = aux.replaceAll('[', '');
        aux = aux.replaceAll(']', '');
        
        dataAprendizaje += aux;
        dataAprendizaje += "\n";
    }
    download(dataAprendizaje, 'Aprendizaje');
    
}

//LEER ARCHIVO 
document.getElementById("asignatura").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAsignatura = fr.result;
        dataAsignatura = dataAsignatura.split(/[\r\n]+/g);
        let objectsAsignatura = [];
        for(let i = 0; i < dataAsignatura.length; i++){
            objectsAsignatura[i] = dataAsignatura[i].split(";");
            attrAsignatura[i] = new Asignatura(objectsAsignatura[i][0], objectsAsignatura[i][1], objectsAsignatura[i][2]);
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("aprendizaje").addEventListener("change", function() {
    var fr = new FileReader();
    console.log(sessionStorage.getItem("userId"));
    fr.onload = function(){
        
        dataAprendizaje = fr.result;
        dataAprendizaje = dataAprendizaje.split(/[\r\n]+/g);
        let objectsAprendizaje = [];
        for(let i = 0; i < dataAprendizaje.length; i++){
            objectsAprendizaje[i] = dataAprendizaje[i].split(";");
            attrAprendizaje[i] = new Aprendizaje(objectsAprendizaje[i][0], objectsAprendizaje[i][1], objectsAprendizaje[i][2], objectsAprendizaje[i][3], objectsAprendizaje[i][4]);
        }
        if(dataAprendizaje.length > 0)
            calcularExpedienteAcademico();
            layoutEstrucutrado();
            loopInscribir();
            loopRetirar()
    }
    fr.readAsText(this.files[0]);
});


//DESCARGAR ARCHIVO
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

/*EDWYN*/

/* Algoritmo para cargar inicio automaticamente*/
const template_inicio = document.getElementById("template_Inicio");
const template_materias = document.getElementById("template_materias");
// const inicio_Clone=document.importNode(template_inicio.content,true);

// const Container_Page= document.querySelector(".container_main");

// Container_Page.appendChild(inicio_Clone);
// /*********************************************** */


// /*Funciones para moverse entre paginas */
// function CargarInicio(){
//     const template = document.getElementById("template_Inicio");
//     const clone=document.importNode(template.content,true);

//     const Container_Page= document.querySelector(".container_main");
//     while(Container_Page.firstElementChild){
//         Container_Page.removeChild(Container_Page.firstElementChild)
//     }
//     Container_Page.appendChild(clone);
// }

// function CargarMaterias(){
//     const template = document.getElementById("template_materias");
//     const clone=document.importNode(template.content,true);

//     const Container_Page= document.querySelector(".container_main");

//     while(Container_Page.firstElementChild){
//         Container_Page.removeChild(Container_Page.firstElementChild)
//     }

//     Container_Page.appendChild(clone);
// }
// /*************************************** */


// /*Moverse entre paginas ********/

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

document.querySelector(".container_person-close").addEventListener("click",()=> {
   window.open("index.html");
   window.close();
})

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
                    temp[index].style.background="#7EB2FD"
                    
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
    const boxEficiencia = document.getElementById("box_Eficiencia");
    const boxUC = document.getElementById("box_U-C");
    const boxPG = document.getElementById("box_P-G");
    const boxAsingA = document.getElementById("box_Asig-A");
    /***************/
    /*Asignaturas */
    const boxInscrita = document.getElementById("box_Inscrita");
    const boxCursada = document.getElementById("box_Cursada");
    const boxRetirada = document.getElementById("box_Retirada");
    const boxAplazada = document.getElementById("box_Aplazada");
    const boxAprovada = document.getElementById("box_Aprovada");
    const boxEquivalecia = document.getElementById("box_Equivalencia");
    const boxTA = document.getElementById("box_Total-A");
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

    /*Asignatura*/
    boxInscrita.innerHTML=DataAcademica.materiasInscritas.toFixed(2).replace(/\.?0+$/, '');
    boxCursada.innerHTML=DataAcademica.materiasCursadas.toFixed(2).replace(/\.?0+$/, '');
    boxRetirada.innerHTML=DataAcademica.materiasRetiradas.toFixed(2).replace(/\.?0+$/, '');
    boxAplazada.innerHTML=DataAcademica.materiasAplazadas.toFixed(2).replace(/\.?0+$/, '');
    boxAprovada.innerHTML=DataAcademica.materiasAprobadas.toFixed(2).replace(/\.?0+$/, '');
    boxEquivalecia.innerHTML=DataAcademica.materiasPorEQ.toFixed(2).replace(/\.?0+$/, '');

    for (let index = 0; index < asignaturasInscritas.length; index++) {
        appendMateria(asignaturasInscritas[index].nombre,asignaturasInscritas[index].codigo,mainMaterias,true)
        appendMateria(asignaturasInscritas[index].nombre,asignaturasInscritas[index].codigo,boxRetirarMateria,true)
        
    }

    for (let index = 1; index < todasAsignaturas.length; index++) {
        appendMateria(todasAsignaturas[index].nombre,todasAsignaturas[index].codigo,boxInscribirMateria,false)
        
    }
   



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
                        <label class="fa-solid fa-xmark icon_btn_materia" id="retirar_Materia" onclick="retirarAsignatura(${id})"></label>
                       
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
                        <label class="fa-solid fa-check icon_btn_materia" id="inscribir_Materia" onclick="inscribirAsignatura(${id})"></label>
                        

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
     let name=busqueda(id);
     appendMateria(name,id,mainMaterias,true);
     appendMateria(name,id,boxRetirarMateria,true);
     loopRetirar();
 }


function deleteMateria(id){

    let materia =document.querySelectorAll(`[id="${id}"] `)
    for (let index = 0; index < materia.length; index++) {
        materia[index].remove();
        
    }
    
}

function busqueda(params) {
    for (let index = 0; index < todasAsignaturas.length; index++) {
        if(todasAsignaturas[index].codigo == params){
            return todasAsignaturas[index].nombre;
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