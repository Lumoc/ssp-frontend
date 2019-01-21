<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">account_circle</i> Docker Pull-Secret anlegen</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du deinem Projekt Pull-Zugriff geben auf ein Docker Repository</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="createPullSecret">
            <cluster-select v-model="clusterid"></cluster-select>
            <project-select v-bind:clusterid="clusterid" v-bind:project.sync="project"></project-select>

            <b-field label="Docker Repository"
                     :type="errors.has('Docker Repository') ? 'is-danger' : ''"
                     :message="errors.first('Docker Repository')">
                <b-input v-model.trim="repository" name="repository"></b-input>
            </b-field>

            <b-field label="Benutzername"
                     :type="errors.has('Benutzername') ? 'is-danger' : ''"
                     :message="errors.first('Benutzername')">
                <b-input v-model.trim="username" name="username"></b-input>
            </b-field>

            <b-field label="Passwort"
                     :type="errors.has('Passwort') ? 'is-danger' : ''"
                     :message="errors.first('Passwort')">
                <b-input v-model.trim="password" name="password"></b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Secret erstellen
            </button>
        </form>
    </div>
</template>

<script>
  import ClusterSelect from './ClusterSelect.vue'
  import ProjectSelect from './ProjectSelect.vue'
  export default {
    components: {
      'cluster-select': ClusterSelect,
      'project-select': ProjectSelect
    },
    data() {
        return {
            clusterid: '',
            project: '',
            repository: '',
            username: '',
            password: '',
            loading: false,
        };
    },
    methods: {
        createPullSecret: function () {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.loading = true;

                    this.$http.post(this.$store.state.backendURL + '/api/ose/secret/pull', {
                        clusterid: this.clusterid,
                        project: this.project,
                        repository: this.repository,
                        username: this.username,
                        password: this.password
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
