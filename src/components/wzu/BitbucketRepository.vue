<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i> Bitbucket Repository</h1>
                </div>
                <h2 class="subtitle">
                    You can create a Bitbucket repository here</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Click here to see the WZU self service portal documentation..</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendBitbucket">
            <b-field label="Use GitFlow Template?"
                     :type="errors.has('GitFlow-Template') ? 'is-danger' : ''"
                     :message="errors.first('GitFlow-Template')">
                <b-checkbox v-model="templateyesno"></b-checkbox>

            </b-field>

            <b-field label="Repository Name (only alphanumeric characters without umlauts)"
                     :type="errors.has('Repository Name') ? 'is-danger' : ''"
                     :message="errors.first('Repository Name')">
                <b-input v-model.trim="bitreponame"
                         name="Repository Name"
                         ref="autofocus"
                         v-validate.rules="{ required: true, regex: /^[a-zA-Z0-9-\s_]+$/}">
                </b-input>
            </b-field>

            <b-field label="Repository Description (optional)"
                     :type="errors.has('Repository Description') ? 'is-danger' : ''"
                     :message="errors.first('Repository Description')">
                <b-input v-model.trim="bitrepodescription"
                         name="Repository Description"
                         ref="autofocus">
                </b-input>
            </b-field>

            <b-field label="Projekt Key (project must exist)"
                     :type="errors.has('Projekt Key') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Key')">
                <b-input v-model.trim="bitprojectkey"
                         name="Projekt Key"
                         v-validate.rukles="{ required: true, regex: /^((amg|aml|amn|amp|ard|am|bp|ek|en|erp|fi|ft|hr|log|inv|kd|ki|kip|kin|ks|mv|mvc|mvg|mvp|mvl|nm|nmd|om|pn|ppg|ppp|pt|pv|pz|rsw|sc|ta|tc|tp|template|test|tms|user|wp|zf)\..*\.[a-z0-9-].*)|((AMG|AML|AMN|AMP|ARD|AM|BP|EK|EN|ERP|FCON|FI|FT|HR|LOG|INV|KD|KI|KIP|KIN|KS|MV|MVC|MVG|MVP|MVL|NM|NMD|OM|PN|PPG|PPP|PT|PV|PZ|RSW|SC|TA|TC|TP|TEST|TMS|USER|WP|ZF)_?.*)$/}">
                </b-input>
            </b-field>

            <b-field label="Order for another user (optional)"
                     :type="errors.has('Bestellung für anderen User') ? 'is-danger' : ''"
                     :message="errors.first('Bestellung für anderen User')">
                <b-input v-model.trim="bitrepoowner"
                         name="Bestellung für anderen User"
                         v-validate.rules="{ required: false, regex:/^(u|U)([0-9]{6})$|^(ue|UE|Ue)([0-9]{5})$|^(e|E)([0-9]{6})$/ }">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Create Repository
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
                regex: "Project name can only contain alphanumeric characters."
            },
            "Projekt Key": {
                required: "Please provide a project key.",
                regex: "The project key must begin with an abbreviation from the domain model and '_'"
            },
            "Order for another user": {
                regex: "Please provide a valid U-,E-, or Ue- number"
            }
        }
    };

    // Override and merge the dictionaries
    Validator.localize('en', dictionary);

    export default {
        data() {
            return {
                templateyesno: true,
                bitreponame:  '',
                bitprojectkey: '',
                bitrepodescription: '',
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
                            bitrepodescription: this.bitrepodescription,
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
