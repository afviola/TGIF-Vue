"use strict";

let miembros = null;
  
const estadisticas = {
    "number-of-democrats": 0,
    "number-of-republicans": 0,
    "number-of-independents": 0,
    "total": 0,
    "democrats-average-votes-with-party": 0,
    "republicans-average-votes-with-party": 0,
    "independents-average-votes-with-party": 0,
    "least-engaged": [],
    "most-engaged": [],
    "least-loyal": [],
    "most-loyal": []
};

const partidos = {
    republicanos: [],
    democratas: [],
    independientes: [],

    inicializarMiembros() {
        this.republicanos = miembros.filter(m => m.party === "R");
        this.democratas = miembros.filter(m => m.party === "D");
        this.independientes = miembros.filter(m => m.party === "I");
    }
};

function votoPromedioConPartido(miembrosDeUnPartido) {
    if (miembrosDeUnPartido.length) {
        return Math.round(
            miembrosDeUnPartido
                .map(miembro => miembro.votes_with_party_pct)
                .reduce((pct1, pct2) => pct1 + pct2, 0) / miembrosDeUnPartido.length);
    }
    return 0;
}

function get10PctMiembrosSegun(key, fnOrdenamiento) {
    miembros.sort(fnOrdenamiento);
  
    let valorLimite = miembros[Math.round(miembros.length * 0.1) - 1][key];
  
    if (miembros[0][key] >= valorLimite) {
        return miembros.filter(m => m[key] >= valorLimite);
    } 

    return miembros.filter(m => m[key] <= valorLimite);
}

function cargarEstadisticas() {
    estadisticas["number-of-democrats"] = partidos.democratas.length;
    estadisticas["number-of-independents"] = partidos.independientes.length;
    estadisticas["number-of-republicans"] = partidos.republicanos.length;
    estadisticas["total"] = miembros.length;

    estadisticas["independents-average-votes-with-party"] = votoPromedioConPartido(partidos.independientes);
    estadisticas["democrats-average-votes-with-party"] = votoPromedioConPartido(partidos.democratas);
    estadisticas["republicans-average-votes-with-party"] = votoPromedioConPartido(partidos.republicanos);

    estadisticas["most-engaged"] = get10PctMiembrosSegun("missed_votes_pct", (m1, m2) => m1.missed_votes_pct - m2.missed_votes_pct);
    estadisticas["least-engaged"] = get10PctMiembrosSegun("missed_votes_pct", (m1, m2) => m2.missed_votes_pct - m1.missed_votes_pct);

    estadisticas["most-loyal"] = get10PctMiembrosSegun("votes_with_party_pct", (m1, m2) => m2.votes_with_party_pct - m1.votes_with_party_pct);
    estadisticas["least-loyal"] = get10PctMiembrosSegun("votes_with_party_pct", (m1, m2) => m1.votes_with_party_pct - m2.votes_with_party_pct);
}