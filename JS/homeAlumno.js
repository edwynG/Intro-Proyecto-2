/*SAM */
//VARIABLES GLOBALES
var dataAsignatura = "", attrAsignatura = [];
var dataAprendizaje = "", attrAprendizaje = [];
var asignaturasInscritas = [], todasAsignaturas = [];


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
            attrAprendizaje[i] = new Aprendizaje(objectsAprendizaje[i][0], objectsAprendizaje[i][1], objectsAprendizaje[i][2], objectsAprendizaje[i][3], objectsAprendizaje[i][4], objectsAprendizaje[i][5], objectsAprendizaje[i][6]);
        }
        if(dataAprendizaje.length > 0)
            calcularExpedienteAcademico();
        
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
const inicio_Clone=document.importNode(template_inicio.content,true);

const Container_Page= document.querySelector(".container_main");

Container_Page.appendChild(inicio_Clone);
/*********************************************** */


/*Funciones para moverse entre paginas */
function CargarInicio(){
    const template = document.getElementById("template_Inicio");
    const clone=document.importNode(template.content,true);

    const Container_Page= document.querySelector(".container_main");
    while(Container_Page.firstElementChild){
        Container_Page.removeChild(Container_Page.firstElementChild)
    }
    Container_Page.appendChild(clone);
}

function CargarMaterias(){
    const template = document.getElementById("template_materias");
    const clone=document.importNode(template.content,true);

    const Container_Page= document.querySelector(".container_main");

    while(Container_Page.firstElementChild){
        Container_Page.removeChild(Container_Page.firstElementChild)
    }

    Container_Page.appendChild(clone);
}
/*************************************** */


/*Moverse entre paginas ********/

const pageInicio= document.getElementById("inicio");
const pageMaterias = document.getElementById("materias");

pageInicio.addEventListener("click",()=> CargarInicio());

pageMaterias.addEventListener("click",()=> CargarMaterias());
/************************** */




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





/*Manejo de materias inscritas y materias retiradas */


function inscribirMateria(materia,codigo,op){
    
    let container_Retirar =document.getElementById("ContenedorRetirarMateria");
    let container_inscribir =document.getElementById("ContenedorInscribirMateria");
    let opcion;
    (op)?opcion=`fa-solid fa-xmark` :opcion=`fa-solid fa-check`;
 
    const div =document.createElement("DIV");
    div.innerHTML=`      <h2>${materia}</h2>
                        <span>${codigo}</span> 
                        <i class="${opcion}" id="${id}"></i>
                    `
    div.classList.add(`items-proceso-Materias`);

    if(op){
        
            container_Retirar.appendChild(div);
    }else{
        
        container_inscribir.appendChild(div);
    }

}

/**************************************************** */

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

                document.querySelector(".file_item-title h1").style.color="#111"
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
                
                document.querySelector(".file_item-title h1").style.color="#111"
             }
            
             
        })
    })
    
    /*boton evento para cerrar ventana emergente */
    document.getElementById("btn_result").addEventListener("click",cerrarCargaDeArchivo)
    

/************************************** */

