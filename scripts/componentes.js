"use strict";

let app = new Vue({
    el: '#app',
    data: {
        estadisticas: estadisticas,
        miembros: miembros
    },

    methods: {
        getMemberFullName(member) {
            return member.first_name + " " + (member.middle_name || "") + " " + member.last_name;
        },

        getMemberVotesWithParty(member) {
            return Math.round(member.total_votes * member.votes_with_party_pct / 100);
        },

        getCheckBoxesValues(name) {
            return Array.from(document.querySelectorAll(`input[name=\"${name}\"]:checked`)).map(check => check.value);
        },

        getStateFilterValue(name) {
            return document.querySelector(`select[name=\"${name}\"]`).value;
        },

        filterMembersBy(checkValues, selectValue) {
            return this.miembros
                    .filter(miembro => (!selectValue || miembro.state === selectValue))
                    .filter(miembro => checkValues.includes(miembro.party));
        }
    }
});