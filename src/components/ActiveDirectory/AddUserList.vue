<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i> Group Admin Management</h1>
                </div>
                <h2 class="subtitle">
			Here you can add or remove a group admin</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Click here to get to the WZU self service portal documentation</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendCreateGroup">
            <b-field label="Group Name"
                     :type="errors.has('Gruppen Name') ? 'is-danger' : ''"
                     :message="errors.first('Gruppen Name')">
                <b-input v-model.trim="groupname"
                         name="Gruppen Name"
                         v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9öäüÖÄÜ\s]+$/} }">
                </b-input>
            </b-field>

            <b-field label="Admin Name (UID)"
                     :type="errors.has('Admin Name') ? 'is-danger' : ''"
                     :message="errors.first('Admin Name')">
                <b-input v-model.trim="adminname"
                         name="Admin Name"
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
                adminname: '',
                loading: false
            };
        },
        methods: {
            addToBackendBitbucket: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        // @TODO switch to WZU backend
                        this.$http.post(this.$store.state.wzuURL + '/api/addUserList', {
                            groupname: this.groupname,
                            adminname: this.adminname
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
