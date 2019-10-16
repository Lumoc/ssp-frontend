<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cloud</i>Create persistent volume</h1>
                </div>
                <h2 class="subtitle">
                    Here you can create a persistent volume</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="createVolume">
            <cluster-select v-model="clusterid"></cluster-select>
            <project-select v-bind:clusterid="clusterid" v-bind:project.sync="project"></project-select>

            <template v-if="technology == 'nfs'">
                <b-field label="Size"
                        :type="errors.has('Grösse') ? 'is-danger' : ''"
                        :message="errors.first('Grösse')">
                    <b-input v-model.trim="size"
                            placeholder="1G"
                            name="Grösse"
                            v-validate="{ rules: { required: true, regex: /^[0-9]+[G]$/}}">
                    </b-input>
                </b-field>
                <b-message type="is-info">
                    min. size is 1G. Size in G e.g. 5G
                </b-message>
            </template>
            <template v-else>
                <b-field label="Size"
                        :type="errors.has('Grösse') ? 'is-danger' : ''"
                        :message="errors.first('Grösse')">
                    <b-input v-model.trim="size"
                            placeholder="500M"
                            name="Grösse"
                            v-validate="{ rules: { required: true, regex: /^[0-9]+[GM]$/}}">
                    </b-input>
                </b-field>

                <b-message type="is-info">
                    Min. size is 500M. Size in  M or G e.g. 500M oder 5G. At a size of 1024M you have to use G.
                </b-message>

            </template>

            <b-field label="Name of the Persistent Volume Claim"
                     :type="errors.has('PVC-Name') ? 'is-danger' : ''"
                     :message="errors.first('PVC-Name')">
                <b-input v-model.trim="pvcName"
                         name="PVC-Name"
                         v-validate="{ rules: { required: true, regex: /^[a-z0-9]([-a-z0-9]*[a-z0-9])$/} }">
                </b-input>
            </b-field>
            <b-message type="is-info">
                The name of the persistent volume claim can only contain lower case letters, numbers or "-"
            </b-message>

            <label class="label>Access Mode</label>
            <b-field>
                <b-radio-button v-model="mode"
                                native-value="ReadWriteOnce"
                                type="is-success">
                    <span>ReadWriteOnce (RWO)</span>
                </b-radio-button>

                <b-radio-button v-model="mode"
                                native-value="ReadWriteMany"
                                type="is-info">
                    <span>ReadWriteMany (RWX)</span>
                </b-radio-button>
            </b-field>
            <b-message type="is-info">
                For details check the <a target="_blank" href="https://docs.openshift.com/container-platform/3.11/architecture/additional_concepts/storage.html#pv-access-modes">official documentation</a>
            </b-message>

            <label class="label">Filesystem Type</label>
            <b-message type="is-info">
                A {{ technology | capitalize }} volume will be created.
                Check the <a target="_blank" href="https://confluence.sbb.ch/x/-LJENQ">documentation</a>
            </b-message>
            <br>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Create a persistent volume
            </button>
            <div v-if="progress">
            The volume will be created. This may take some minutes. You can close this window while the creation is going to be completed in the background.
            <progress :value="progress" max="100"></progress>
            </div>
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
        pvcName: '',
        size: '',
        progress: '',
        mode: 'ReadWriteOnce',
        technology: 'nfs',
        loading: false,
        features: {
            gluster: false,
            nfs: false
        }
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
                // if nfs is not supported, change to gluster instead of nfs
                if (this.features.nfs) {
                    this.technology = 'nfs'
                } else {
                    this.technology = 'gluster'
                }
            })
        }
    },
    methods: {
      createVolume: function() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;
            this.$http.post(this.$store.state.backendURL + '/api/ose/volume', {
              clusterid: this.clusterid,
              project: this.project,
              size: this.size,
              pvcName: this.pvcName,
              mode: this.mode,
              technology: this.technology
            }).then((res) => {
              if (res.body.data.JobId) {
                this.pollJob(this.clusterid, res.body.data.JobId)
              } else {
                this.loading = false;
              }
            }, () => {
              this.loading = false;
            });
          }
        });
      },
      pollJob: function(clusterid, job) {
        var that = this
        var poll = setInterval(function() {
            that.$http.get(that.$store.state.backendURL + '/api/ose/volume/jobs', {
                params: {
                    clusterid: clusterid,
                    job: job
                }
            }).then((res) => {
              that.progress = res.body
              if (res.body == "100") {
                that.progress = ''
                clearInterval(poll)
                that.loading = false
                that.$store.commit('setNotification', {
                    notification: {
                        type: 'success',
                        message: 'Persistent volume successfully created. A persistent volume claim (PVC) has been added to your project.'
                    }
                });
              }
            }, () => {
              that.progress = ''
              that.loading = false
              clearInterval(poll)
            });
          }, 3000)
      }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            if (value == 'nfs') return value.toUpperCase()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    }
  };
</script>
