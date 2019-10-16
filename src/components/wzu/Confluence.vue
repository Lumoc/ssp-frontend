<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Confluence Space</h1>
                </div>
                <h2 class="subtitle">
                    You can create a Confluence Space here.</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404">Click here to see the WZU self service portal documentation.</a></h3>
            </div>
        </div>
        <br>
        <!-- die regex error message funktioniert iwie mit type="errors... aber auch ohne, jedoch manchmal geht es dann nicht mehr...
        notiere es hier, damit ich in zukunft effizienter handeln kann"-->
        <form v-on:submit.prevent="addToBackendConfluence">
            <b-field label="Space Name (only alphanumeric characters)"
                     :type="errors.has('Space Name') ? 'is-danger' : ''"
                     :message="errors.first('Space Name')">
                <b-input v-model.trim="spacename"
                         name="Space Name"
                         ref="autofocus"
                         v-validate.rules="{ required: true, regex: /^[a-zA-Z0-9öäüÖÄÜ\s]+$/}">
                </b-input>
            </b-field>
            <b-field label="Space key (uppercase, less than 10 characters)"
                     :message="errors.first('SpaceKey')"
                     :type="errors.has('SpaceKey') ? 'is-danger' : ''">
                <b-input v-model.trim="spacekey"
                         name="SpaceKey"
                         v-validate.rules="{ required: true, regex: /^[A-Z]{0,10}$/}">
                </b-input>
            </b-field>
            <b-field label="Space Description (optional)">
                <b-input v-model.trim="spacedescription"
                         name="spacedescription">
                </b-input>
            </b-field>
            <b-field label="Order for another user (optional)"
                     :type="errors.has('Bestellung für anderen User') ? 'is-danger' : ''"
                     :message="errors.first('Bestellung für anderen User')">
                <b-input v-validate.rules="{ required: false, regex:/^(u|U)[0-9]{6}|(e|E)[0-9]{6}|(ue|Ue|UE)[0-9]{5}$/ }"
                         name="Bestellung für anderen User"
                         v-model.trim="spaceowner">
                </b-input>
            </b-field>

        <button :disabled="errors.any()"
                v-bind:class="{'is-loading': loading}"
                class="button is-primary">Create Space
        </button>
        </form>
    </div>
</template>

<script>
    import { Validator } from 'vee-validate';

    const dictionary = {
        custom: {

            "SpaceKey": {
                required: "Please provide a space key.",
                regex: "The Space Key can contain max 10 characters and only uppercase letters."
            },
            "Space Name": {
                required: "Please provide a space name",
                regex: "The space name can only contain alphanumeric letters"
            },
            "Order for another user": {
                regex: "Please provide a valid U-,E-, or Ue- number"
            }
        }
    };

    // Override and merge the dictionaries
    Validator.localize('de', dictionary);


    export default {
        data() {
            return {
                spacename:  '',
                spacekey: '',
                spacedescription: '',
                spaceowner: '',
                loading: false
            };
        },
        methods: {
            addToBackendConfluence: function () {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        // @TODO switch to WZU backend
                        this.$http.post(this.$store.state.wzuURL + '/api/confluence', {
                            spacename: this.spacename,
                            spacekey: this.spacekey,
                            spacedescription: '' + this.spacedescription,
                            spaceowner: '' + this.spaceowner
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

