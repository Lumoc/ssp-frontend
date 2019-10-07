<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Jira Project</h1>
                </div>
                <h2 class="subtitle">
                    You can createa a jira project on issues.sbb here</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404">Click here to see the WZU SPP documentation.</a></h3>
            </div>
        </div>
        <form v-on:submit.prevent="addToBackendJira">
            <b-field label="Activate Xray?"
                     :type="errors.has('XRay') ? 'is-danger' : ''"
                     :message="errors.first('XRay')">
                <b-checkbox v-model="activatexray"></b-checkbox>

            </b-field>
            <b-field label="Project name (only alphanumeric characters)"
                     :type="errors.has('ProjectName') ? 'is-danger' : ''"
                     :message="errors.first('ProjectName')">
                <b-input v-model.trim="projectname"
                         name="ProjectName"
                         ref="autofocus"
                         v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9öäüÖÄÜ\s]+$/} }">
                </b-input>
            </b-field>
            <b-field label="Project key (only uper case letters max 10 signs)"
                     :type="errors.has('ProjectKey') ? 'is-danger': ''"
                     :message="errors.first('ProjectKey')">
                <b-input v-model.trim="projectkey"
                         name="ProjectKey"
                         v-validate.rules="{ required: true, regex: /^[A-Z]{0,10}$/}"
                         :message="errors.first('ProjectKey')">
                </b-input>
            </b-field>
            <b-field label="Project description (not mandatory)"
                     :type="errors.has('Projekt Beschreibung') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Beschreibung')">
                <b-input v-model.trim="projectdescription"
                         name="Projekt Beschreibung">
                </b-input>
            </b-field>
            <b-field label="Order for other User (not mandatory)"
                     :type="errors.has('Bestellung für anderen User') ? 'is-danger' : ''"
                     :message="errors.first('Bestellung für anderen User')">
                <b-input v-model.trim="projectowner"
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

            "ProjectKey": {
                required: "Please provide a project key.",
                regex: "The project key can only contain uper case letters and max 10 characters."

            },
            "ProjectName": {
                required: "Please provide a project name.",
                regex: "The project name can only contian alphanumeric characters"
            },
            "Order for other users":{
                regex: "Please provide a valid U-,E- or Ue- number."
            }
        }
    };

    Validator.localize('de', dictionary);

    export default {
        data() {
            return {
                activatexray: false,
                projectname:  '',
                projectkey: '',
                projectdescription: '',
                projectowner: '',
                loading: false
            };
        },
        methods: {
            addToBackendJira: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        this.$http.post(this.$store.state.wzuURL + '/api/jira', {
                            activatexray: this.activatexray,
                            projectname: this.projectname,
                            projectkey: this.projectkey,
                            projectdescription:  this.projectdescription,
                            projectowner: this.projectowner
                        }).then(() => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                });
            }
        }

    };
</script>
