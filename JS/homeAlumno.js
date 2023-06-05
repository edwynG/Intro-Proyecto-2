



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