"use strict";

let app = new Vue({
    el: '#app',
    data: {
        miembrosVue: null,
        partidos: [],
        estadisticas: {
            nroDemocratas: 0,
            nroRepublicanos: 0,
            nroIndependientes: 0,
            nroTotal: 0,
            democratsAverageVotesWithParty: 0,
            republicansAverageVotesWithParty: 0,
            independentsAverageVotesWithParty: 0,
            leastEngaged: [],
            mostEngaged: [],
            leastLoyal: [],
            mostLoyal: []
        }
    },

    methods: {
        init(miembros) {
            this.miembrosVue = miembros;
            this.cargarPartidos();
            this.cargarEstadisticas();
        },

        cargarPartidos() {
            this.miembrosVue.forEach(miembro => {
                let partidoEncontrado = this.partidos.find(partido => partido.nombre === miembro.party);
                if (partidoEncontrado) {
                    partidoEncontrado.miembros.push(miembro);
                } else {
                    this.partidos.push({
                        nombre: miembro.party,
                        miembros: [miembro]
                    });
                }
            });
        },

        cargarEstadisticas() {
            this.estadisticas.nroDemocratas = this.getCantMiembrosDePartido('D');
            this.estadisticas.nroRepublicanos = this.getCantMiembrosDePartido('R');
            this.estadisticas.nroIndependientes = this.getCantMiembrosDePartido('I');
            this.estadisticas.nroTotal = this.miembrosVue.length;

            this.estadisticas.democratsAverageVotesWithParty = this.getVotoPromedioConPartido('D');
            this.estadisticas.republicansAverageVotesWithParty = this.getVotoPromedioConPartido('R');
            this.estadisticas.independentsAverageVotesWithParty = this.getVotoPromedioConPartido('I');

            this.estadisticas.mostEngaged = this.get10pctMiembrosSegun('missed_votes_pct', (m1,m2) => m1.missed_votes_pct - m2.missed_votes_pct);
            this.estadisticas.leastEngaged = this.get10pctMiembrosSegun('missed_votes_pct', (m1,m2) => m2.missed_votes_pct - m1.missed_votes_pct);
            this.estadisticas.mostLoyal = this.get10pctMiembrosSegun('votes_with_party_pct', (m1,m2) => m2.votes_with_party_pct - m1.votes_with_party_pct);         
            this.estadisticas.leastLoyal = this.get10pctMiembrosSegun('votes_with_party_pct', (m1,m2) => m1.votes_with_party_pct - m2.votes_with_party_pct);
        },

        getVotoPromedioConPartido(nombrePartido) {
            let partidoEncontrado = this.partidos.find(partido => partido.nombre === nombrePartido);
            if (partidoEncontrado) {
                return Math.round(
                    partidoEncontrado.miembros
                        .map(miembro => miembro.votes_with_party_pct)
                        .reduce((acum, pct) => acum + pct, 0) / partidoEncontrado.miembros.length
                );
            }
            return 0;
        },

        get10pctMiembrosSegun(key, fnOrdenamiento) {
            this.miembrosVue.sort(fnOrdenamiento);
            let valorLimite = this.miembrosVue[Math.round(this.miembrosVue.length * 0.1) - 1][key];
  
            if (this.miembrosVue[0][key] >= valorLimite) {
                return this.miembrosVue.filter(m => m[key] >= valorLimite);
            }

            return this.miembrosVue.filter(m => m[key] <= valorLimite);
        },

        getMiembrosDePartido(nombrePartido) {
            let partidoEncontrado = this.partidos.find(partido => partido.nombre === nombrePartido);
            if (partidoEncontrado) {
                return partidoEncontrado.miembros;
            }
        },

        getCantMiembrosDePartido(nombrePartido) {
            let miembrosEncontrados = this.getMiembrosDePartido(nombrePartido);
            if (miembrosEncontrados) {
                return miembrosEncontrados.length;
            }
            return 0;
        },

        getMemberFullName(member) {
            return member.first_name + " " + (member.middle_name || "") + " " + member.last_name;
        },

        getMemberVotesWithParty(member) {
            return Math.round(member.total_votes * member.votes_with_party_pct / 100);
        }
    }
});