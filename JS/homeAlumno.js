/*SAM */

var dataAsignatura = "";
var objectsAsignatura = [];
var attrAsignatura = [];
var dataAprendizaje = "";
var objectsAprendizaje = [];
var attrAprendizaje = [];


//CALCULAR EXPEDIENTE ACADEMICO
function expedienteAcademico(){
  //  debugger
    let expedienteAcademico = {
        promedioGeneral: 0,
        promedioAsigAprob: 0,
        UC: 0,
        eficiencia: 0,
        materiasInscritas: 0,
        materiasRetiradas: 0,
        materiasAplazadas: 0,
        materiasPorEQ: 0,
        materiasAprobadas: 0,
        materiasCursadas: 0,
    }
    let contGeneral = 0;
    let contAprobadas = 0;
    let UCTotales = 0;

    let aprendizaje = []

    for(let i = 0; i < attrAprendizaje.length; i++){
        if(attrAprendizaje[i][0] === sessionStorage.getItem("userId")){
            expedienteAcademico['promedioGeneral'] += Number(attrAprendizaje[i][3]);
            contGeneral++;
            aprendizaje.push(attrAprendizaje[i]);

            if(attrAprendizaje[i][2] === "Aprobada"){
                expedienteAcademico['promedioAsigAprob'] += Number(attrAprendizaje[i][3]);
                expedienteAcademico['materiasAprobadas']++;
                contAprobadas++;
            }
            else if(attrAprendizaje[i][2] === "Inscrita"){
                expedienteAcademico['materiasInscritas']++;
            }
            else if(attrAprendizaje[i][2] === "Retirada"){
                expedienteAcademico['materiasRetiradas']++;
            }
            else if(attrAprendizaje[i][2] === "Aplazada"){
                expedienteAcademico['materiasAplazadas']++;
            }
            else if(attrAprendizaje[i][2] === "PorEQ"){
                expedienteAcademico['materiasPorEQ']++;
            }
            else if(attrAprendizaje[i][2] === "Cursada"){
                expedienteAcademico['materiasCursadas']++;
            }
        }  
    }
    expedienteAcademico['promedioGeneral'] = expedienteAcademico['promedioGeneral']/contGeneral;
    expedienteAcademico['promedioAsigAprob'] = expedienteAcademico['promedioAsigAprob']/contAprobadas;

    for(let i = 0; i < attrAsignatura.length; i++){
        for(let j = 0; j < attrAprendizaje.length; j++){
            if(attrAprendizaje[j][1] === attrAsignatura[i][1]){
                if(attrAprendizaje[j][2] === "Aprobada"){
                    expedienteAcademico['UC'] += attrAsignatura[i][2];
                }
                UCTotales += attrAsignatura[i][2];
            }
        
        }
        
    }
    expedienteAcademico['eficiencia'] = expedienteAcademico['UC']/UCTotales;
    return expedienteAcademico;
}

//LEER ARCHIVO 
document.getElementById("asignatura").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAsignatura = fr.result;
        objectsAsignatura = dataAsignatura.split(/[\r\n]+/g);
        for(let i = 0; i < objectsAsignatura.length; i++){
            attrAsignatura[i] = objectsAsignatura[i].split(";");
        }
        
    }
    fr.readAsText(this.files[0]);
});

document.getElementById("aprendizaje").addEventListener("change", function() {
    var fr = new FileReader();
    fr.onload = function(){
        
        dataAprendizaje = fr.result;
        objectsAprendizaje = dataAprendizaje.split(/[\r\n]+/g);
        for(let i = 0; i < objectsAprendizaje.length; i++){
            attrAprendizaje[i] = objectsAprendizaje[i].split(";");
        }
        if(dataAprendizaje != "")
            expedienteAcademico();
        
    }
    fr.readAsText(this.files[0]);
});







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

