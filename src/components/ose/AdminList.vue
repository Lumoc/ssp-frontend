<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        <i class="material-icons">person</i> OpenShift Projekt Admins anzeigen</h1>
                    <h2 class="subtitle">
                        Zeigt alle User eines Projektes mit Admin-Rolle an</h2>
                </div>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="getAdminList">
            <cluster-select v-model="clusterid"></cluster-select>
            <project-select v-bind:clusterid="clusterid" v-bind:project.sync="project"></project-select>

            <button :disabled="errors.any()" v-bind:class="{'is-loading': loading}" class="button is-primary">
                Admin-Liste anzeigen
            </button>
        </form>
        <br><br>
        <label><strong>Administratoren</strong></label><br><br>
        <b-table :data="data"
                 :narrowed="true"
                 :loading="loading">

            <template slot-scope="props">
                <b-table-column field="sender" label="Benutzername">
                    {{ props.row }}
                </b-table-column>
            </template>

            <div slot="empty" class="has-text-centered">
                Noch keine Abfrage durchgeführt
            </div>
        </b-table>
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
    computed: {
      username() {
        return this.$store.state.user.name;
      }
    },
    data() {
      return {
        clusterid: '',
        project: '',
        data: [],
        loading: false
      };
    },
    methods: {
      getAdminList: function() {
            console.log(this.project)
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;
            this.$http.get(this.$store.state.backendURL + '/api/ose/project/admins', {
                params: {
                  clusterid: this.clusterid,
                  project: this.project
                }
            }).then((res) => {
              this.loading = false;
              this.data = res.body.admins;
            }, () => {
              this.loading = false;
            });
          }
        });
      }
    }
  };
</script>
