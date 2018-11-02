<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Entwickler-Proxy Eintrag</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du dich in den Entwickler-Proxy einrtagen</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Hier klicken um zur WZU SSP Doku zu gelangen.</a></h3>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/display/WZU/Entwickler-Proxy"> Hier klicken um zur WZU SSP Doku zu gelangen.</a></h3>
            </div>
        </div>
        <form v-on:submit.prevent="addToBackendTasks">
            <b-field label="Username (U/E/UE-Nr)"
                     :type="errors.has('Username') ? 'is-danger' : ''"
                     :message="errors.first('Username')">
                <b-input v-model.trim="username"
                         name="Username"
                         v-validate="{ rules: { required: true, regex:/^(u|U)([0-9]{6})$|^(ue|UE|Ue)([0-9]{5})$|^(e|E)([0-9]{6})$/} }">
                </b-input>
            </b-field>
            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">berechtigen
            </button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username:  '',
                loading: false
            };
        },
        methods: {
            addToBackendTasks: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        this.$http.post(this.$store.state.wzuURL + '/api/devproxy', {
                            username: this.username
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