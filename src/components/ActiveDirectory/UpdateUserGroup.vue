<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Gruppen User Management</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du einen User zu/ von einer Active Directory Gruppe hinzufügen oder entfernen</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Hier klicken um zur WZU SSP Doku zu gelangen.</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendCreateGroup">
            <b-field>
                <b-radio-button v-model="type"
                                native-value="hinzufügen"
                                type="is-success">
                    <span>Hinzufügen</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="löschen"
                                type="is-success">
                    <span>löschen</span>
                </b-radio-button>
            </b-field>
            <b-field label="Gruppen Name"
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
                    class="button is-primary">Admin updaten
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
