<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Bitbucket Project</h1>
                </div>
                <h2 class="subtitle">
                    Create BitBucket project here</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404">Click here to see the WZU self service portal documentation.</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendBitbucket">
            <b-field label="Project Name (only alphanumberic signs)"
                     :type="errors.has('Projekt Name') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Name')">
                <b-input v-model.trim="bitprojectname"
                         name="Projekt Name"
                         ref="autofocus"
                         v-validate.rules="{ required: true, regex: /^[a-zA-Z0-9öäüÖÄÜ\s]+$/}">
                </b-input>
            </b-field>

            <b-field label="Project Key (only uper case letters starting with the domain model)"
                     :type="errors.has('Projekt Key') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Key')">
                <b-input v-model.trim="bitprojectkey"
                         name="Projekt Key"
                         v-validate.rules="{ required: true, regex: /^(((AMG|AML|AMN|AMP|ARD|AM|BP|EK|EN|ERP|FCON|FI|FT|HR|LOG|INV|KD|KI|KIP|KIN|KS|MV|MVC|MVG|MVP|MVL|NM|NMD|OM|PN|PPG|PPP|PT|PV|PZ|RSW|SC|TA|TC|TP|TEST|TMS|USER|WP|ZF)_?.*))$/}">
                </b-input>
            </b-field>

            <b-field label="Project Description (optional)"
                     :type="errors.has('Projekt Beschreibung') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Beschreibung')">
                <b-input v-model.trim="bitprojectdescription"
                         name="Projekt Beschreibung">
                </b-input>
            </b-field>

            <b-field label="Order for another user (optional)"
                     :type="errors.has('Bestellung für anderen User') ? 'is-danger' : ''"
                     :message="errors.first('Bestellung für anderen User')">
                <b-input v-model.trim="bitprojectowner"
                         name="Bestellung für anderen User"
                         v-validate.rules="{ required: false, regex:/^(u|U)([0-9]{6})$|^(ue|UE|Ue)([0-9]{5})$/ }">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Create projekt
            </button>
        </form>
    </div>
</template>

<script>
    import { Validator } from 'vee-validate';

    const dictionary = {
        custom: {

            "Project Name": {
                required: "Please provide a project name.",
                regex: "The project name can only contain alphanumberic letters and numbers."
            },
            "Projekt Key": {
                required: "Please provide a project key.",
                regex: "The project key has to start with a contraction of the domainmodel and _"
            },
            "Order for another user": {
                regex: "Please provide a validated U-,E-, or Ue- number"
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
