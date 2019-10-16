<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">perm_scan_wifi</i> Generate GlusterFS Configuration</h1>
                </div>
                <h2 class="subtitle">
                   This function creates the GlusterFS objects (Service & Endpoints) in your project.</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="fixGlusterObjects">
            <cluster-select v-model="clusterid"></cluster-select>
            <div v-if="gluster">
                <project-select v-bind:clusterid="clusterid" v-bind:project.sync="project"></project-select>

                <button :disabled="errors.any()"
                        v-bind:class="{'is-loading': loading}"
                        class="button is-primary">Create GlusterFS object
                </button>
            </div>
            <p v-if="!gluster">This Cluster doesnt not support a GlusterFS at the moment</p>
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
        loading: false,
        gluster: false
      };
    },
    watch: {
        clusterid: function(val) {
            this.$http.get(this.$store.state.backendURL + '/features', {
                params: {
                    clusterid: val
                }
            }).then(res => {
                this.features = res.body.openshift
                // if gluster is not supported, change to false
                this.gluster = res.body.openshift.gluster
            })
        }
    },
    methods: {
      fixGlusterObjects: function() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;

            this.$http.post(this.$store.state.backendURL + '/api/ose/volume/gluster/fix', {
              clusterid: this.clusterid,
              project: this.project
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
