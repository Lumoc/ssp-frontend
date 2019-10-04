<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">account_circle</i>Create service account</h1>
                </div>
                <h2 class="subtitle">
                    Here you can create a service account for your project</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="createServiceAccount">
            <cluster-select v-model="clusterid"></cluster-select>
            <project-select v-bind:clusterid="clusterid" v-bind:project.sync="project"></project-select>

            <b-field label="Service-Account Name"
                     :type="errors.has('Service-Account') ? 'is-danger' : ''"
                     :message="errors.first('Service-Account')">
                <b-input v-model.trim="serviceAccount"
                         name="Service-Account"
                         v-validate="{ rules: { required: true, regex: /^[a-z0-9]([-a-z0-9]*[a-z0-9])$/} }">
                </b-input>
            </b-field>
            <b-message type="is-info">
                Service-Account Name darf nur Kleinbuchstaben, Zahlen und - enthalten
            </b-message>

            <b-field>
                <b-checkbox v-model="createJenkinsCredential">
                    {{ 'Create Jenkins credential from the service account (used by ESTA deployment pipeline)? '}}
                </b-checkbox>
            </b-field>
            <b-field v-if="createJenkinsCredential"
                    label="Jenkins Bitbucket/Team job name"
                     :type="errors.has('Jenkins Bitbucket/Team Job Name') ? 'is-danger' : ''"
                     :message="errors.first('Jenkins Bitbucket/Team Job Name')">
                <b-input v-model.trim="organizationKey"
                         name="Jenkins Organization-Key" required>
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Create service account
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
            serviceAccount: '',
            project: '',
            loading: false,
            createJenkinsCredential: false,
            organizationKey: ''
        };
    },
    methods: {
        createServiceAccount: function () {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    this.loading = true;

                    this.$http.post(this.$store.state.backendURL + '/api/ose/serviceaccount', {
                        clusterid: this.clusterid,
                        project: this.project,
                        organizationKey: this.createJenkinsCredential ? this.organizationKey : '',
                        serviceAccount: this.serviceAccount
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
