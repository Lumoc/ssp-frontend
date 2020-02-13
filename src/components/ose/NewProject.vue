<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">speaker_notes</i> Create OpenShift Project</h1>
                </div>
                <h2 class="subtitle">
                    Here you can create a new OpenShift project</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newProject">
            <cluster-select v-model="cluster" feature="newprojects" recommend></cluster-select>
            <b-field label="OpenShift Project">
                <b-field>
                    <b-input v-model.trim="project"
                            required pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])(?<!-prod)$"
                            data-patternMismatch="The project name can only contain lower case letters, numbers and -"
                            ref="autofocus"
                            placeholder="projekt-name">
                    </b-input>
                    <p class="control">
                        <span v-if="cluster.production" class="button is-static">-prod</span>
                    </p>
                </b-field>
            </b-field>
            <b-message v-if="cluster.production" type="is-info">
                Only production projects are allowed on this cluster! Please read the <a target="_blank" href="https://confluence.sbb.ch/x/tIHPUw">production guidelines</a></br>
            </b-message>
            <b-message v-if="!cluster.production" :type="project.endsWith('prod') ? 'is-danger':'is-info'">
                No production projects are allowed on this cluster!
            </b-message>

            <b-field label="Accounting Number">
                <b-input v-model.trim="billing"
                         name="Kontierungsnummer"
                         required>
                </b-input>
            </b-field>
            <b-message type="is-info">
            Accounting number (e.g 77606105), internal order (70029490) or PSP element including phase number (1157803.4-10.1)
            Please only fill in correct information. This can be changed later at: <a href="#/ose/project" target="_blank">Change project information</a>
            </b-message>

            <b-field label="Mega ID">
                <b-input v-model.trim="megaId"
                         required pattern="^[A-Z0-9]{16}$">
                </b-input>
            </b-field>
            <b-message type="is-info">
                Useful links for Mega-ID: <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/85c6a9c748db00d1.htm">All applications</a>, <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/a261aa7848d00c63.htm">Overview (e.g application creation form)</a>
            </b-message>

            <button v-bind:class="{'is-loading': loading}"
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
        cluster: {},
        megaId: '',
        billing: '',
        project: '',
        loading: false
      };
    },
    methods: {
      newProject: function() {
        this.loading = true;

        this.$http.post(this.$store.state.backendURL + '/api/ose/project', {
          clusterid: this.cluster.id,
          project: this.project + (this.cluster.production ? '-prod' : ''),
          billing: this.billing,
          megaId: this.megaId
        }).then(() => {
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      }
    }
  };
</script>
