"use strict";

const miembros = data.results[0].members;

function agregarDatosEnTabla(tabla, ...datosDeFila) {
  let fila = tabla.insertRow(-1);
  
  datosDeFila.forEach(function(dato) {
    let celda = fila.insertCell(-1);
    celda.innerHTML = dato;
  });
}

function limpiarTabla(tabla) {
  while (tabla.childNodes.length > 0) {
    tabla.deleteRow(0);
  } 
}

function getNombreCompleto(miembro) {
  return miembro.first_name + " " + (miembro.middle_name || "") + " " + miembro.last_name;
}
  
function getNombreCompletoLink(miembro) {
  return "<a href=\"" + miembro.url + "\">" + getNombreCompleto(miembro)+ "</a>";
}

function getCheckBoxesValues(name) {
  return Array.from(document.querySelectorAll(`input[name=\"${name}\"]:checked`)).map(check => check.value);
}

function getStateFilterValue(name) {
  return document.querySelector(`select[name=\"${name}\"]`).value;
}

function filterMembersBy(checkValues, selectValue) {
  return miembros.filter(miembro => (!selectValue || miembro.state === selectValue))
                 .filter(miembro => checkValues.includes(miembro.party));
}

function updateUI() {
  let table= document.getElementById('tabla-filtrada');

  limpiarTabla(table);
  filterMembersBy(getCheckBoxesValues("party-filter"), getStateFilterValue("state-filter"))
      .forEach(function(miembro) {
        agregarDatosEnTabla(table, getNombreCompletoLink(miembro), miembro.party, miembro.state, miembro.seniority, miembro.votes_with_party_pct + "%");
      });
}

updateUI();

