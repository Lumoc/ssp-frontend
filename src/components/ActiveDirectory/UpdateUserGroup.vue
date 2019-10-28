<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i> Group User Management</h1>
                </div>
                <h2 class="subtitle">
                    You can add or remove a user from the Active Directory group here.</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Click here to get to the WZU self serivce portal documentation. </a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendCreateGroup">
            <b-field>
                <b-radio-button v-model="type"
                                native-value="hinzufügen"
                                type="is-success">
                    <span>Add</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="löschen"
                                type="is-success">
                    <span>remove</span>
                </b-radio-button>
            </b-field>
            <b-field label="Group Name"
                     :type="errors.has('Gruppen Name') ? 'is-danger' : ''"
                     :message="errors.first('Gruppen Name')">
                <b-input v-model.trim="groupname"
                         name="Gruppen Name"
                         v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9öäüÖÄÜ\s]+$/} }">
                </b-input>
            </b-field>

            <b-field label="User Name (UID)"
                     :type="errors.has('User Name') ? 'is-danger' : ''"
                     :message="errors.first('User Name')">
                <b-input v-model.trim="user"
                         name="User Name"
                         v-validate="{ rules: { required: true, regex:/^(u|U)([0-9]{6})$|^(ue|UE|Ue)([0-9]{5})$|^(e|E)([0-9]{6})$/} }">
                </b-input>
            </b-field>
            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Update admin
            </button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                type: '',
                groupname:  '',
                username: '',
                loading: false
            };
        },
        methods: {
            addToBackendBitbucket: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        // @TODO switch to WZU backend
                        this.$http.post(this.$store.state.wzuURL + '/api/updateGroup', {
                            methode: this.type,
                            groupname: this.groupname,
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
