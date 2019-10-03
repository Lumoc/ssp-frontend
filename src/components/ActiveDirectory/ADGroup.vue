<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>WZU-Gruppenmanagement</h1>
                </div>
                <h2 class="subtitle">
                    You can create an AD group here.</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Click here to get to the WZU SSP documentation.</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendCreateGroup">
            <b-field label="Group name"
                     :type="errors.has('Gruppen Name') ? 'is-danger' : ''"
                     :message="errors.first('Gruppen Name')">
                <b-input v-model.trim="groupname"
                         name="Gruppen Name"
                         v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9öäüÖÄÜ\s]+$/} }">
                </b-input>
            </b-field>
            <button :disabled="errors.any()"
                v-bind:class="{'is-loading': loading}"
                class="button is-primary">Create group
            </button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                groupname:  '',
                loading: false
            };
        },
        methods: {
            addToBackendBitbucket: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        // @TODO switch to WZU backend
                        this.$http.post(this.$store.state.wzuURL + '/api/creategroup', {
                            groupname: this.groupname
                        }, () => {
                            this.loading = false;
                        });
                    }
                });
            }
        }

    };
</script>
