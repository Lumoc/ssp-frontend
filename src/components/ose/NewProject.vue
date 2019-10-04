<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">speaker_notes</i> Create OpenShift project</h1>
                </div>
                <h2 class="subtitle">
                    Here you can create new OpenShift projects</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newProject">
            <cluster-select v-model="clusterid" feature="newprojects"></cluster-select>
            <b-field label="OpenShift Project"
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
                The project name can only contain lower case letters, numbers and "-"</br>
                Production projects:</br>
                - Please note the following information: <a target="_blank" href="https://confluence.sbb.ch/x/XWUOMg">Produktions-Kriterien</a></br>
                - No production projects auf Test04</br>
            </b-message>

            <b-field label="Accounting number"
                     :type="errors.has('Kontierungsnummer') ? 'is-danger' : ''"
                     :message="errors.first('Kontierungsnummer')">
                <b-input v-model.trim="billing"
                         name="Kontierungsnummer"
                         v-validate="'required'">
                </b-input>
            </b-field>
            <b-message type="is-info">
            Accounting number (e.g 77606105), internal order (70029490) or PSP element including phase number (1157803.4-10.1)
            Please only fill in correct information. It can later still be changed at: <a href="#/ose/project" target="_blank">Change project information</a>
            </b-message>

            <b-field label="Mega ID"
                     :type="errors.has('Mega ID') ? 'is-danger' : ''"
                     :message="errors.first('Mega ID')">
                <b-input v-model.trim="megaId"
                         name="Mega ID"
                         v-validate.rules="{ required: true, regex: /^[A-Z0-9]{16}$/}">
                </b-input>
            </b-field>
            <b-message type="is-info">
                Useful links for Mega-ID: <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/85c6a9c748db00d1.htm">All Applications</a>, <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/a261aa7848d00c63.htm">Overview (e.g application creation form)</a>
            </b-message>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Create new project
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
