<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Developer Proxy</h1>
                </div>
                <h2 class="subtitle">You can create a APi-token for the DevProxy here..</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404">Click here to see the WZU self service portal documentation.</a></h3>
            </div>
        </div>
        <form v-on:submit.prevent="createApiToken">
            <button class="button is-primary">Create token</button>
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
