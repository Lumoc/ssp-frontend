<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cached</i>Adjust project Quotas </h1>
                </div>
                <h2 class="subtitle">
                    you can adjust the CPU / memory quotas here. All changes will be logged!</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="editQuotas">
            <cluster-select v-model="clusterid"></cluster-select>
            <project-select v-bind:clusterid="clusterid" v-bind:project.sync="project"></project-select>

            <b-field label="New CPU quotas [Cores]"
                     :type="errors.has('CPU') ? 'is-danger' : ''"
                     :message="errors.first('CPU')">
                <b-input type="number"
                         v-validate="'required'"
                         name="CPU"
                         v-model.number="cpu"
                         min="1">
                </b-input>
            </b-field>

            <b-field label="New memory quotas [GB]"
                     :type="errors.has('Memory') ? 'is-danger' : ''"
                     :message="errors.first('Memory')">
                <b-input type="number"
                         v-model.number="memory"
                         v-validate="'required'"
                         name="Memory"
                         min="2">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
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
        clusterid: '',
        cpu: 2,
        memory: 4,
        project: '',
        loading: false
      };
    },
    methods: {
      editQuotas: function() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;

            this.$http.post(this.$store.state.backendURL + '/api/ose/quotas', {
              clusterid: this.clusterid,
              project: this.project,
              cpu: this.cpu,
              memory: this.memory
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
