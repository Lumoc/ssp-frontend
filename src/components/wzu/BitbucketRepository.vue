<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Bitbucket Repository</h1>
                </div>
                <h2 class="subtitle">
                    You can create a Bitbucket repo here</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Click here to see the WZU SPP documentation..</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendBitbucket">
            <b-field label="Load GitFlow-Template?"
                     :type="errors.has('GitFlow-Template') ? 'is-danger' : ''"
                     :message="errors.first('GitFlow-Template')">
                <b-checkbox v-model="templateyesno"></b-checkbox>

            </b-field>

            <b-field label="Repository name (only alphanumeric characters without umlauts)"
                     :type="errors.has('Repository Name') ? 'is-danger' : ''"
                     :message="errors.first('Repository Name')">
                <b-input v-model.trim="bitreponame"
                         name="Repository Name"
                         ref="autofocus"
                         v-validate.rules="{ required: true, regex: /^[a-zA-Z0-9-\s]+$/}">
                </b-input>
            </b-field>

            <b-field label="Projekt Key (Project has to exist)"
                     :type="errors.has('Projekt Key') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Key')">
                <b-input v-model.trim="bitprojectkey"
                         name="Projekt Key"
                         v-validate.rukles="{ required: true, regex: /^(((KS|SC|PV|PN|MV|ZF|INV|BP|AM|ERP|KD|KI|MVC|MVG|MVP|OM|PT|PZ|RSW|USER|TEST|TA|FT)_?.*))$/}">
                </b-input>
            </b-field>

            <b-field label="Order for other User (not mandatory)"
                     :type="errors.has('Bestellung für anderen User') ? 'is-danger' : ''"
                     :message="errors.first('Bestellung für anderen User')">
                <b-input v-model.trim="bitrepoowner"
                         name="Bestellung für anderen User"
                         v-validate.rules="{ required: false, regex:/^(u|U)([0-9]{6})$|^(ue|UE|Ue)([0-9]{5})$|^(e|E)([0-9]{6})$/ }">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Repo create
            </button>
        </form>
    </div>
</template>

<script>
    import { Validator } from 'vee-validate';

    const dictionary = {
        custom: {

            "Repository Name": {
                required: "Please provide a project name.",
                regex: "Project name can only contain alphanumberic signs."
            },
            "Projekt Key": {
                required: "Please provide a project key.",
                regex: "The project key has to start with a contraction of the domainmodel and "_".."
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
                templateyesno: true,
                bitreponame:  '',
                bitprojectkey: '',
                bitrepoowner: '',
                loading: false
            };
        },
        methods: {
            addToBackendBitbucket: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        // @TODO switch to WZU backend
                        this.$http.post(this.$store.state.wzuURL + '/api/bitbucketrepo', {
                            templateyesno: this.templateyesno,
                            bitreponame: this.bitreponame,
                            bitprojectkey: this.bitprojectkey,
                            bitrepoowner: this.bitrepoowner
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
