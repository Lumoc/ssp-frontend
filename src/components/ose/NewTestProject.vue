<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        <i class="material-icons">receipt</i> Create OpenShift Trial Project</h1>
                </div>
                <h2 class="subtitle">
                    Here you can create an OpenShift trial project.</h2>
            </div>
        </div>
        <br>
        <article class="message is-info">
            <div class="message-body">
                - You can create a trial project anytime for your experiments without generating costs.<br/>
                - The name of the trial project always contains your account identifier<br/>
                - Pods in the trial project can be stopped by the Cloud Team when causing disturbance or any other reason<br/>
                - Every test project will be deleted after 30 days without prior notice<br/>
            </div>
        </article>
        <form v-on:submit.prevent="newTestProject">
            <cluster-select v-model="clusterid" feature="testprojects"></cluster-select>
            <b-field label="Trial Project Name">
                <b-field>
                    <p class="control">
                        <span class="button is-static">{{ username }}-</span>
                    </p>
                    <b-input v-model.trim="testprojectname" name="Trial project name"
                            required
                            pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])$"
                            ref="autofocus"
                            placeholder="testprojekt">
                    </b-input>
                </b-field>
            </b-field>

            <b-message type="is-info">
                The project name can only contain lower case letters, numbers or "-"
            </b-message>

            <button v-bind:class="{'is-loading': loading}" class="button is-primary">
                Create new trial project
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
    computed: {
      username() {
        return this.$store.state.user.uid;
      }
    },
    data() {
      return {
        clusterid: '',
        testprojectname: '',
        loading: false
      };
    },
    methods: {
      newTestProject: function() {
        this.loading = true;

        this.$http.post(this.$store.state.backendURL + '/api/ose/testproject', {
          clusterid: this.clusterid,
          project: this.testprojectname
        }).then(() => {
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      }
    }
  };
</script>
