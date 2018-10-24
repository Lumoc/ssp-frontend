<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>ALM User</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du einen ALM User zu einem Projekt hinzufügen.</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Hier klicken um zur WZU Doku zu gelangen.</a></h3>

            </div>
        </div>
        <br>
        <form v-on:submit.prevent="ALMUser">

            <b-field label="Projekt Name"
                     :type="errors.has('Projekt Name') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Name')">
                <b-input v-model.trim="projectname"
                         name="Repository Name"
                         v-validate="{ rules: { required: true} }">
                </b-input>
            </b-field>

            <label class="label">Projekt Funktion</label>
            <b-field>
                <b-radio-button v-model="projectfunction"
                                native-value="SBB_Project_Admin"
                                type="is-success">
                    <span>SBB Project Admin</span>
                </b-radio-button>
                <b-radio-button v-model="projectfunction"
                                native-value="SBB_Project_Member"
                                type="is-success">
                    <span>SBB Project Member</span>
                </b-radio-button>
                <b-radio-button v-model="projectfunction"
                                native-value="SBB_Project_Tester"
                                type="is-success">
                    <span>SBB Project Tester</span>
                </b-radio-button>
                <b-radio-button v-model="projectfunction"
                                native-value="SBB_Viewer"
                                type="is-success">
                    <span>SBB Viewer</span>
                </b-radio-button>
            </b-field>


            <label class="label">Domain Name</label>
            <b-field>
                <b-radio-button v-model="domainname"
                                native-value="ANWENDUNGEN_TF"
                                type="is-success">
                    <span>ANWENDUNGEN_TF</span>
                </b-radio-button>
                <b-radio-button v-model="domainname"
                                native-value="ANWENDUNGEN"
                                type="is-success">
                    <span>ANWENDUNGEN</span>
                </b-radio-button>
                <b-radio-button v-model="domainname"
                                native-value="PROJEKTE"
                                type="is-success">
                    <span>PROJEKTE</span>
                </b-radio-button>
                <b-radio-button v-model="domainname"
                                native-value="PROJEKTE_TF"
                                type="is-success">
                    <span>PROJEKTE_TF</span>
                </b-radio-button>
            </b-field>

            <b-field label="Bestellung für anderen User (u-Nr lowercase, wegen ALM)"
                     :type="errors.has('Bestellung für anderen User') ? 'is-danger' : ''"
                     :message="errors.first('Bestellung für anderen User')">
                <b-input v-model.trim="almuser"
                         name="Bestellung für anderen User"
                         v-validate="{ rules: { required: false, regex:/^(u|e)([0-9]{6})$|^(ue)([0-9]{5})$/ } }">
                </b-input>
            </b-field>

            <button v-on:click="addToBackendALM" :disabled="errors.any()"
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
                projectname:  '',
                projectfunction: '',
                almuser: '',
                domainname: '',
                loading: false
            };
        },
        methods: {
            addToBackendALM: function() {

                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        // @TODO switch to WZU backend
                        this.$http.post(this.$store.state.wzuURL + '/api/alm', {
                            projectname: this.projectname,
                            projectfunction: this.projectfunction,
                            almuser: this.almuser,
                            domainname: this.domainname

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
