<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">speaker_notes</i> OpenShift Projekt anlegen</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du ein OpenShift Projekt erstellen</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newProject">
            <cluster-select v-model="clusterid"></cluster-select>
            <b-field label="OpenShift Projekt"
                     :type="errors.has('Projekt-Name') ? 'is-danger' : ''"
                     :message="errors.first('Projekt-Name')">
                <b-input v-model.trim="project"
                         name="Projekt-Name"
                         v-validate="{ rules: { required: true, regex: /^[a-z0-9]([-a-z0-9]*[a-z0-9])$/} }"
                         ref="autofocus"
                         placeholder="projekt-name">
                </b-input>
            </b-field>
            <b-message type="is-info">
                Projekt-Name darf nur Kleinbuchstaben, Zahlen und - enthalten
            </b-message>

            <b-field label="Kontierungsnummer"
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
                <b-input v-model.trim="megaId"
                         name="Mega ID"
                         v-validate="'required'">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Neues Projekt erstellen
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
        megaId: '',
        billing: '',
        project: '',
        loading: false
      };
    },
    methods: {
      newProject: function() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;

            this.$http.post(this.$store.state.backendURL + '/api/ose/project', {
              clusterid: this.clusterid,
              project: this.project,
              billing: this.billing,
              megaId: this.megaId
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
