<style>
.bold {
    font-weight: 800;
}
</style>
<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        <i class="material-icons">person</i> Ansible-Tower Job</h1>
                    <h2 class="subtitle">
                        Status eines einzelnen Jobs</h2>
                </div>
            </div>
        </div>
        <br>
        <div class="columns">
            <div class="column is-narrow bold">
                Description:<br>
                Name:<br>
                Start:<br>
            </div>
            <div class="column">
            {{ job.description }}<br>
            {{ job.name }}<br>
            {{ moment(job.started).calendar() | capitalize }}<br>
            </div>
        </div>
        <button class="button"
            @click="isExtraVarsModalActive = true">
            Show advanced details
        </button>
        <br>
        <br>
        <b-modal :active.sync="isExtraVarsModalActive" has-modal-card trap-focus>
            <div class="modal-card modal-card-body">
                The following variables were used to start this job:
                <div class="columns">
                    <div class="column is-narrow bold">
                        <template v-for="(value, key) in extra_vars">
                        {{ key }}:<br>
                        </template>
                    </div>
                    <div class="column">
                        <template v-for="(value, key) in extra_vars">
                        {{ value }}<br>
                        </template>
                    </div>
                </div>
            </div>
        </b-modal>
        <job-stdout :job="jobID" v-on:finished="stopLoading"></job-stdout>
    </div>
</template>

<script>
  import JobStdout from './JobStdout.vue'
  export default {
    components: {
        'job-stdout': JobStdout
    },
    props: ['jobID'],
    data() {
      return {
        job: {},
        loading: true,
        isExtraVarsModalActive: false,
      };
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    mounted: function() {
            this.loading = true;
            this.$http.get(this.$store.state.backendURL + '/api/tower/jobs/' + this.jobID).then((res) => {
              this.loading = false;
              let json = JSON.parse(res.body)
              this.job = json
              console.log(json)
            }, () => {
              this.loading = false;
            });
    },
    methods: {
        stopLoading: function() {
            this.loading = false;
        }
    },
    computed: {
        extra_vars: function() {
            if (!this.job) return []
            if (!this.job.extra_vars) return []
            return JSON.parse(this.job.extra_vars)
        }
    }
  };
</script>
