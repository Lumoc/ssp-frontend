<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Jenkins Credentials erstellen</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du Credentials in deiner Jenkins-Organization erstellen</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Hier klicken um zur WZU Doku zu gelangen.</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newJenkinsCredentials">
            <b-field label="Jenkins Organization Name"
                     :type="errors.has('Jenkins Organization Name') ? 'is-danger' : ''"
                     :message="errors.first('Jenkins Organization Name')">
                <b-input v-model.trim="organizationKey"
                         name="Jenkins Organization Name"
                         v-validate="{ rules: { required: true } }">
                </b-input>
            </b-field>
            <b-field label="Beschreibung"
                     :type="errors.has('Beschreibung') ? 'is-danger' : ''"
                     :message="errors.first('Beschreibung')">
                <b-input v-model.trim="description"
                         name="spacekey"
                         v-validate="{ rules: { required: true } }">
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
                    class="button is-primary">Credentials erstellen
            </button>
        </form>
    </div>
</template>

<script>
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

