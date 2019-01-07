<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Bitbucket Projekt</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du ein Bitbucket Projekt erstellen</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Hier klicken um zur WZU SSP Doku zu gelangen.</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendBitbucket">
            <b-field label="Projekt Name (nur alphanummerische Zeichen)"
                     :type="errors.has('ProjektName') ? 'is-danger' : ''"
                     :message="errors.first('ProjektName')">
                <b-input v-model.trim="bitprojectname"
                         name="ProjektName"
                         ref="autofocus"
                         v-validate.rules="{ required: true, regex: /^[a-zA-Z0-9öäüÖÄÜ\s]+$/}">
                </b-input>
            </b-field>

            <b-field label="Projekt Key (nur Grossbuchstaben beginnend mit Domänen Modell)"
                     :type="errors.has('ProjektKey') ? 'is-danger' : ''"
                     :message="errors.first('ProjektKey')">
                <b-input v-model.trim="bitprojectkey"
                         name="ProjektKey"
                         v-validate.rules="{ required: true, regex: /^(((KS|SC|PV|PN|MV|ZF|INV|BP|AM|ERP|KD|KI|MVC|MVG|MVP|OM|PT|PZ|RSW|USER|TEST|TA|FT)_?.*))$/}">
                </b-input>
            </b-field>

            <b-field label="Projekt Beschreibung (kein Pflichtfeld)"
                     :type="errors.has('ProjektBeschreibung') ? 'is-danger' : ''"
                     :message="errors.first('ProjektBeschreibung')">
                <b-input v-model.trim="bitprojectdescription"
                         name="ProjektBeschreibung">
                </b-input>
            </b-field>

            <b-field label="Bestellung für anderen User (kein Pflichtfeld)"
                     :type="errors.has('Bestellung für anderen User') ? 'is-danger' : ''"
                     :message="errors.first('Bestellung für anderen User')">
                <b-input v-model.trim="bitprojectowner"
                         name="Bestellung für anderen User"
                         v-validate.rules="{ required: false, regex:/^(u|U)([0-9]{6})$|^(ue|UE|Ue)([0-9]{5})$/ }">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Projekt erstellen
            </button>
        </form>
    </div>
</template>

<script>
    import { Validator } from 'vee-validate';

    const dictionary = {
        custom: {

            "ProjektName": {
                required: "Bitte gib einen Projekt Namen an.",
                regex: "Der Projekt Name darf sich nur aus alphanumerischen Zeichen zusammensetzen."
            },
            "ProjektKey": {
                required: "Bitte gib einen Projekt Key an.",
                regex: "Der Projekt Key muss mit dem Kürzel aus dem Domänenmodell und einem _ beginnen."
            },
            "Bestellung für anderen User": {
                regex: "Bitte gib eine valide U-, E- oder Ue-Nummer an."
            }
        }
    };

    // Override and merge the dictionaries
    Validator.localize('de', dictionary);

    export default {
        data() {
            return {
                bitprojectname:  '',
                bitprojectkey: '',
                bitprojectdescription: '',
                bitprojectowner: '',
                loading: false
            };
        },
        methods: {
            addToBackendBitbucket: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        // @TODO switch to WZU backend
                        this.$http.post(this.$store.state.wzuURL + '/api/bitbucket', {
                            bitprojectname: this.bitprojectname,
                            bitprojectkey: this.bitprojectkey,
                            bitprojectdescription:  this.bitprojectdescription,
                            bitprojectowner: this.bitprojectowner
                        }).then(() => {
                            this.loading = false;
                        });
                    }
                });
            }
        }

    };
</script>
