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
        <job-stdout :job="jobID" v-on:finished="stopLoading"></job-stdout>
    </div>
</template>

<script>
  import JobStdout from './JobStdout.vue'
  export default {
    components: {
        'job-stdout': JobStdout
    },
    computed: {
      username() {
        return this.$store.state.user.name;
      }
    },
    props: ['jobID'],
    data() {
      return {
        job: {},
        loading: true
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
    }
  };
</script>
