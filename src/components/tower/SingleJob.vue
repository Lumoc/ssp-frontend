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
