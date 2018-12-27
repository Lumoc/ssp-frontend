<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cloud</i> Persistent Volume anlegen</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du ein Persistent Volume für OpenShift erstellen</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="createVolume">
            <cluster-select v-model="clusterid"></cluster-select>
            <b-field label="Projekt-Name"
                     :type="errors.has('Projekt-Name') ? 'is-danger' : ''"
                     :message="errors.first('Projekt-Name')">
                <b-input v-model.trim="project"
                         placeholder="projekt-dev"
                         name="Projekt-Name"
                         ref='autofocus'
                         v-validate="'required'">
                </b-input>
            </b-field>

            <template v-if="technology == 'nfs'">
                <b-field label="Grösse"
                        :type="errors.has('Grösse') ? 'is-danger' : ''"
                        :message="errors.first('Grösse')">
                    <b-input v-model.trim="size"
                            placeholder="1G"
                            name="Grösse"
                            v-validate="{ rules: { required: true, regex: /^[0-9]+[G]$/}}">
                    </b-input>
                </b-field>
                <b-message type="is-info">
                    Mindestgrösse ist 1G. Grösse angeben mit Einheit (G) z.B. 5G
                </b-message>
            </template>
            <template v-else>
                <b-field label="Grösse"
                        :type="errors.has('Grösse') ? 'is-danger' : ''"
                        :message="errors.first('Grösse')">
                    <b-input v-model.trim="size"
                            placeholder="500M"
                            name="Grösse"
                            v-validate="{ rules: { required: true, regex: /^[0-9]+[GM]$/}}">
                    </b-input>
                </b-field>

                <b-message type="is-info">
                    Mindestgrösse ist 500M. Grösse angeben mit Einheit (M/G) z.B. 500M oder 5G. Ab 1024M muss G verwendet werden
                </b-message>

            </template>

            <b-field label="Name des Persistent Volume Claims"
                     :type="errors.has('PVC-Name') ? 'is-danger' : ''"
                     :message="errors.first('PVC-Name')">
                <b-input v-model.trim="pvcName"
                         name="PVC-Name"
                         v-validate="{ rules: { required: true, regex: /^[a-z0-9]([-a-z0-9]*[a-z0-9])$/} }">
                </b-input>
            </b-field>
            <b-message type="is-info">
                Name des Persistent Volume Claims darf nur Kleinbuchstaben, Zahlen und - enthalten
            </b-message>

            <label class="label">Verwendungsmodus</label>
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
                Siehe <a target="_blank" href="https://docs.openshift.com/container-platform/3.6/architecture/additional_concepts/storage.html#pv-access-modes">Dokumentation</a>
            </b-message>

            <label class="label">Technologie</label>
            <b-message type="is-info">
                Es wird ein {{ technology | capitalize }}-Volume erstellt.
                Siehe <a target="_blank" href="https://confluence.sbb.ch/x/-LJENQ">Dokumentation</a>
            </b-message>
            <br>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Persistent Volume erstellen
            </button>
            <div v-if="progress">
            Das Volume wird erstellt. Dies kann einige Minuten dauern. Sie dürfen diese Seite schliessen, der Vorgang wird im Hintergrund fertiggestellt.
            <progress :value="progress" max="100"></progress>
            </div>
        </form>
    </div>
</template>

<script>
  import ClusterSelect from './ClusterSelect.vue'
  export default {
    components: {
      'cluster-select': ClusterSelect
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
                        message: 'Das Volume wurde erstellt. Deinem Projekt wurde das PVC hinzugefügt.'
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
