"use strict";

let app = new Vue({
    el: '#app',
    data: {
        miembrosVue: null,
        miembrosFiltrados: null,
        checkValues: null,
        selectValue: null
    },

    methods: {
        init(miembros) {
            this.miembrosVue = miembros;
            this.checkValues = ['I', 'R', 'D'];
            this.selectValue = '';
            this.loadFilteredMembers();
        },

        loadFilteredMembers() {
            this.miembrosFiltrados = this.miembrosVue
                    .filter(miembro => (!this.selectValue || miembro.state === this.selectValue))
                    .filter(miembro => this.checkValues.includes(miembro.party));
        },

        getMemberFullName(member) {
            return member.first_name + " " + (member.middle_name || "") + " " + member.last_name;
        },
    
        getMemberVotesWithParty(member) {
            return Math.round(member.total_votes * member.votes_with_party_pct / 100);
        }
    }
});