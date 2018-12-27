<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">attach_money</i> Kontierungsnummer anzeigen/anpassen
                    </h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du die Kontierungsnummer deines OpenShift Projekts anzeigen/anpassen</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="updateBilling">
            <cluster-select v-model="clusterid"></cluster-select>
            <label class="label">Projekt-Name</label>
            <b-field grouped
                     :type="errors.has('Projekt-Name') ? 'is-danger' : ''"
                     :message="errors.first('Projekt-Name')">
                <b-input v-model.trim="project"
                         placeholder="projekt-dev"
                         name="Projekt-Name"
                         v-validate="'required'"
                         ref="autofocus"
                         expanded>
                </b-input>
                <p class="control">
                    <span class="button is-info"
                          v-on:click="getExistingBillingData">Aktuelle Daten anzeigen</span>
                </p>
            </b-field>

            <b-field label="Neue Kontierungsnummer"
                     :type="errors.has('Kontierungsnummer') ? 'is-danger' : ''"
                     :message="errors.first('Kontierungsnummer')">
                <b-input v-model.trim="billing"
                         name="Kontierungsnummer"
                         v-validate="'required'">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Kontierungsinformation anpassen
            </button>
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
        billing: '',
        project: '',
        loading: false
      };
    },
    methods: {
      updateBilling: function() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;

            this.$http.post(this.$store.state.backendURL + '/api/ose/billing', {
              clusterid: this.clusterid,
              project: this.project,
              billing: this.billing
            }).then(() => {
              this.loading = false;
            }, () => {
              this.loading = false;
            });
          }
        });
      },
      getExistingBillingData: function() {
        this.$http.get(this.$store.state.backendURL + '/api/ose/billing', {
            params: {
                clusterid: this.clusterid,
                project: this.project
            }
        }).then(() => {
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      }
    }
  };
</script>
