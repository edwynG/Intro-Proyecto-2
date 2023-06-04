var dataAsignatura = "";
var objectsAsignatura = [];
var attrAsignatura = [];
var dataAprendizaje = "";
var objectsAprendizaje = [];
var attrAprendizaje = [];


//CALCULAR EXPEDIENTE ACADEMICO
function expedienteAcademico(){
    debugger
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