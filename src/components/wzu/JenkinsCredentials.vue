<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i> Create Jenkins Credentials</h1>
                </div>
                <h2 class="subtitle">
                    Here you can create credentials in your Jenkins organization.</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404">Click here to see the WZU self-service portal documentation.</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newJenkinsCredentials">
            <b-field label="Jenkins Organization Name">
                <b-input v-model.trim="organizationKey"
                         ref="autofocus"
                         required>
                </b-input>
            </b-field>
            <b-field label="Description">
                <b-input v-model.trim="description" required>
                </b-input>
            </b-field>
            <b-field label="Secret">
                <b-input v-model.trim="secret" required>
                </b-input>
            </b-field>

            <button v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Create credentials
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
        }

    };
</script>
