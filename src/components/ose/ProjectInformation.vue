<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">attach_money</i> Display/Update project details
                    </h1>
                </div>
                <h2 class="subtitle">
                    You can show or adjust the details of your project here</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="updateInformation">
            <cluster-select v-model="clusterid"></cluster-select>
            <project-select v-bind:clusterid="clusterid" v-bind:project.sync="project" v-on:selected="getExistingInformation"></project-select>

            <b-message type="is-info">
                The details will appear below once a project is selected.
            </b-message>

            <b-field label="Accounting number"
                     :type="errors.has('Kontierungsnummer') ? 'is-danger' : ''"
                     :message="errors.first('Kontierungsnummer')">
                <b-input v-model.trim="billing"
                         name="Kontierungsnummer"
                         v-validate="'required'">
                </b-input>
            </b-field>

            <b-field label="Mega ID"
                     :type="errors.has('Mega ID') ? 'is-danger' : ''"
                     :message="errors.first('Mega ID')">
                <b-input v-model.trim="megaid"
                         name="Mega ID"
                         v-validate.rules="{ required: true, regex: /^[A-Z0-9]{16}$/}">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Change account management
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
        billing: '',
        megaid: '',
        project: '',
        loading: false
      };
    },
    methods: {
      updateInformation: function() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;

            this.$http.post(this.$store.state.backendURL + '/api/ose/project/info', {
              clusterid: this.clusterid,
              project: this.project,
              billing: this.billing,
              megaid: this.megaid,
            }).then(() => {
              this.loading = false;
            }, () => {
              this.loading = false;
            });
          }
        });
      },
      getExistingInformation: function(project) {
        this.$http.get(this.$store.state.backendURL + '/api/ose/project/info', {
            params: {
                clusterid: this.clusterid,
                project: project
            }
        }).then((res) => {
          this.loading = false;
          this.billing = res.body.kontierungsnummer;
          this.megaid = res.body.megaid;
        }, () => {
          this.loading = false;
        });
      }
    }
  };
</script>
