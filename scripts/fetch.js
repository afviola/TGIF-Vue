"use strict";

function inicializarPaginaSegunCamara(camara) {
    let url = `https://api.propublica.org/congress/v1/113/${camara}/members.json`;
  
    fetch(url, {headers: {"X-API-Key": "LdAhzLBvrq4dOnvfdddHYB1qgTk1cEjSFS77V4xk"}})
        .then(respuesta => respuesta.json())
        .then(data => {
            miembros = data.results[0].members;
            partidos.inicializarMiembros();
            cargarEstadisticas();
        })
        .catch(error => console.log(error));
}

if (window.location.pathname.includes('senate')) {
    inicializarPaginaSegunCamara('senate');
} else {
    inicializarPaginaSegunCamara('house');
}