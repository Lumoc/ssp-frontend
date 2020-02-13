<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cached</i> Adjust Project Quotas </h1>
                </div>
                <h2 class="subtitle">
                    You can adjust the CPU / memory quotas here. All changes are logged and will be billed.</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="editQuotas">
            <cluster-select v-model="cluster"></cluster-select>
            <project-select v-bind:clusterid="cluster.id" v-bind:project.sync="project"></project-select>

            <b-field label="New CPU Quota [cores]">
                <b-input type="number"
                         required
                         v-model.number="cpu"
                         min="1">
                </b-input>
            </b-field>

            <b-field label="New Memory Quota [GB]">
                <b-input type="number"
                         v-model.number="memory"
                         required
                         min="2">
                </b-input>
            </b-field>

            <button v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Adjust quotas
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
        cluster: {},
        cpu: 2,
        memory: 4,
        project: '',
        loading: false
      };
    },
    methods: {
      editQuotas: function() {
        this.loading = true;

        this.$http.post(this.$store.state.backendURL + '/api/ose/quotas', {
          clusterid: this.cluster.id,
          project: this.project,
          cpu: this.cpu,
          memory: this.memory
        }).then(() => {
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      }
    }
  };
</script>
