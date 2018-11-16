<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Entwicklerproxy</h1>
                </div>
                <h2 class="subtitle">Hier kannst du dir einen API-Token für den Entwicklerproxy anlegen.</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Hier klicken um zur WZU SSP Doku zu gelangen.</a></h3>
            </div>
        </div>
        <form v-on:submit.prevent="createApiToken">
            <button class="button is-primary">Token erstellen</button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false
            };
        },
        methods: {
            createApiToken: function() {
                this.loading = true;
                this.$http.get(this.$store.state.wzuURL + '/api/squid/getApiKey').then(() => {
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }
        }

    };
</script>
