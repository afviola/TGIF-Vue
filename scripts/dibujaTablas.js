"use strict";

function agregarDatosEnTabla(tabla, ...datosDeFila) {
  let fila = tabla.insertRow(-1);

  datosDeFila.forEach(function(dato) {
    let celda = fila.insertCell(-1);
    celda.innerHTML = dato;
  });
}

function crearGlanceTable() {
  let tabla = document.getElementById('at-glance-table');
  agregarDatosEnTabla(tabla, "Democrats", estadisticas["number-of-democrats"], estadisticas["democrats-average-votes-with-party"]);
  agregarDatosEnTabla(tabla, "Republicans", estadisticas["number-of-republicans"], estadisticas["republicans-average-votes-with-party"]);
  agregarDatosEnTabla(tabla, "Independents", estadisticas["number-of-independents"], estadisticas["independents-average-votes-with-party"]);
  agregarDatosEnTabla(tabla, "Total", estadisticas["total"], "");
}

function getNombreCompleto(miembro) {
  return miembro.first_name + " " + (miembro.middle_name || "") + " " + miembro.last_name;
}

function getNombreCompletoLink(miembro) {
  return "<a href=\"" + miembro.url + "\">" + getNombreCompleto(miembro)+ "</a>";
}

function crearTablasGenericas() {
  let tablaLeast, tablaMost;

  tablaLeast = document.getElementById("least-table");
  tablaMost = document.getElementById("most-table");

  if (window.location.pathname.includes('attendance')) {
    estadisticas["least-engaged"].forEach(function(miembro) {
      agregarDatosEnTabla(tablaLeast, getNombreCompletoLink(miembro), miembro.missed_votes, miembro.missed_votes_pct);
    });

    estadisticas["most-engaged"].forEach(function(miembro) {
      agregarDatosEnTabla(tablaMost, getNombreCompletoLink(miembro), miembro.missed_votes, miembro.missed_votes_pct);
    });
  } else { //caso loyalty
    estadisticas["least-loyal"].forEach(function(miembro) {
      agregarDatosEnTabla(tablaLeast, getNombreCompletoLink(miembro), Math.round(miembro.total_votes * miembro.votes_with_party_pct/100), miembro.votes_with_party_pct);
    });
  
    estadisticas["most-loyal"].forEach(function(miembro) {
      agregarDatosEnTabla(tablaMost, getNombreCompletoLink(miembro), Math.round(miembro.total_votes * miembro.votes_with_party_pct/100), miembro.votes_with_party_pct);
    });
  }
}

function inicializarPaginaSegunCamara(camara) {
  let url = `https://api.propublica.org/congress/v1/113/${camara}/members.json`;

  fetch(url, {headers: {"X-API-Key": "LdAhzLBvrq4dOnvfdddHYB1qgTk1cEjSFS77V4xk"}})
    .then(respuesta => respuesta.json())
    .then(data => {
      miembros = data.results[0].members;
      partidos.inicializarMiembros();
      cargarEstadisticas();
      crearGlanceTable();
      crearTablasGenericas();
    })
    .catch(error => console.log(error));
}

if (window.location.pathname.includes('senate')) {
  inicializarPaginaSegunCamara('senate');
} else {
  inicializarPaginaSegunCamara('house');
}