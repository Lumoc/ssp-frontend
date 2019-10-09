<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Create Jenkins Credentials</h1>
                </div>
                <h2 class="subtitle">
                    Here you can create credentials in your Jenkins organization.</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404">Click here to see the WZU self-service portal documentation.</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newJenkinsCredentials">
            <b-field label="Jenkins organization name"
                     :type="errors.has('Jenkins Organization Name') ? 'is-danger' : ''"
                     :message="errors.first('Jenkins Organization Name')">
                <b-input v-model.trim="organizationKey"
                         name="Jenkins Organization Name"
                         ref="autofocus"
                         v-validate.rules="{ required: true }">
                </b-input>
            </b-field>
            <b-field label="Description"
                     :type="errors.has('Beschreibung') ? 'is-danger' : ''"
                     :message="errors.first('Beschreibung')">
                <b-input v-model.trim="description"
                         name="Beschreibung"
                         v-validate.rules="{ required: true }">
                </b-input>
            </b-field>
            <b-field label="Secret"
                     :type="errors.has('Secret') ? 'is-danger' : ''"
                     :message="errors.first('Secret')">
                <b-input v-model.trim="secret"
                         name="Secret">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Create credentials
            </button>
        </form>
    </div>
</template>

<script>
    import { Validator } from 'vee-validate';

    const dictionary = {
        custom: {

            "Jenkins organization name": {
                required: "Please provide a Jenkins organization name.",
            },
            "Description": {
                required: "Please provide a description",
            }
        }
    };

    // Override and merge the dictionaries
    Validator.localize('de', dictionary);

    export default {
        data() {
            return {
                organizationKey: '',
                description: '',
                secret: ''
            };
        },
        methods: {
            newJenkinsCredentials: function () {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        this.$http.post(this.$store.state.wzuURL + '/api/jenkins/credentials', {
                            organizationKey: this.organizationKey,
                            description: this.description,
                            secret: this.secret
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
