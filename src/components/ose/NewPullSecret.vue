<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">account_circle</i>create Docker pull-secret</h1>
                </div>
                <h2 class="subtitle">
		    You can give your porject Pull-permissions to your Docker repository here.</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="createPullSecret">
            <cluster-select v-model="clusterid"></cluster-select>
            <project-select v-bind:clusterid="clusterid" v-bind:project.sync="project"></project-select>

            <b-field label="Username"
                     :type="errors.has('Username') ? 'is-danger' : ''"
                     :message="errors.first('Username')">
                <b-input v-model.trim="username" name="username"></b-input>
            </b-field>

            <b-field label="Password"
                     :type="errors.has('Password') ? 'is-danger' : ''"
                     :message="errors.first('Password')">
                <b-input v-model.trim="password" name="password" type="password" password-reveal></b-input>
            </b-field>
            <b-message type="is-info">
                "Username" and "Password" which got provided by Artifactory in the Docker repo order from  <a target="_blank" href="https://confluence.sbb.ch/x/jwf5Q">More infos</a>
	    </b-message>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">create secret
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
