
var alcohol = document.getElementById('alcohol');
var ibu = document.getElementById('ibu');
var titulo = document.getElementById('titulo');
var descripcion = document.getElementById('descripcion');
var lataMuestra = document.getElementById('lata-muestra');
var flechaDerecha = document.getElementsByClassName('flecha-derecha');
var flechaIzquierda = document.getElementsByClassName('flecha-izquierda');

var i = 0;
//cargar valor en session
sessionStorage.setItem('valor', i);

//SUMAR 1 POR VUELTA DE ARRAY PARA QUE CAMBIE EL ELEMENTO Y SOBRESCRIBIR EL ELEMENTO

function moveRight(detalle) {

    var ci = sessionStorage.getItem('valor');
    var i = parseInt(ci);

    if (i < detalle.length - 1) {
        i++;
    } else {
        i = 0;
    }

    //guardar en session
    var currentItem = i;
    sessionStorage.setItem('valor', currentItem);

    descripcion.innerHTML = detalle[i].descripcion;
    ibu.innerHTML = detalle[i].ibu;
    alcohol.innerHTML = detalle[i].alcohol;
    titulo.innerHTML = detalle[i].titulo;
    lataMuestra.src = detalle[i].imagen;


}

/*

1. FUNCION QUE TRAE VALOR DE SESSION STORAGE */

function moveLeft(detalle) {
    //traer de session

    var ci = sessionStorage.getItem('valor');
    var i = parseInt(ci);

    if (i < detalle.length && i > 0) {
        i = i - 1;
    } else {
        i = 5;
    }
    var currentItem = i;
    sessionStorage.setItem('valor', currentItem);

    descripcion.innerHTML = detalle[i].descripcion;
    ibu.innerHTML = detalle[i].ibu;
    alcohol.innerHTML = detalle[i].alcohol;
    titulo.innerHTML = detalle[i].titulo;
    lataMuestra.src = detalle[i].imagen;

}




////////////////////////////////////////////////
