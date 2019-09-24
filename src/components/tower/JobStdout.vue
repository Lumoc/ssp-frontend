<style type="text/css">
    .job_stdout_root {
        position: relative;
        height: 200px;
    }
    .job_stdout_html pre {
        background-color: inherit;
        color: inherit;
    }
    .ansi_fore { color: #000000; }
    .ansi_back { background-color: #F5F5F5; }
    .ansi_fore.ansi_dark { color: #AAAAAA; }
    .ansi_back.ansi_dark { background-color: #000000; }
    .ansi1 { font-weight: bold; }
    .ansi3 { font-weight: italic; }
    .ansi4 { text-decoration: underline; }
    .ansi9 { text-decoration: line-through; }
    .ansi30 { color: #161b1f; }
    .ansi31 { color: #d9534f; }
    .ansi32 { color: #5cb85c; }
    .ansi33 { color: #f0ad4e; }
    .ansi34 { color: #337ab7; }
    .ansi35 { color: #e1539e; }
    .ansi36 { color: #2dbaba; }
    .ansi37 { color: #ffffff; }
    .ansi40 { background-color: #161b1f; }
    .ansi41 { background-color: #d9534f; }
    .ansi42 { background-color: #5cb85c; }
    .ansi43 { background-color: #f0ad4e; }
    .ansi44 { background-color: #337ab7; }
    .ansi45 { background-color: #e1539e; }
    .ansi46 { background-color: #2dbaba; }
    .ansi47 { background-color: #ffffff; }
    body.ansi_back pre {
      font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
      font-size: 12px;
    }
    div.ansi_back.ansi_dark {
      padding: 0 8px;
      max-height: 700px;
      overflow-y: scroll;
    }
    div.job_stdout_status {
        padding: 8px 0;
    }
    .card-header-title {
        font-size: 20px;
        font-weight: 400;
    }
</style>

<template>
    <div class="job_stdout_root">
      <div v-if="job_data.status" class="job_stdout_status">
          <p v-if="job_data.status == 'running'">Dies kann einige Minuten dauern. Die Seite darf geschlossen werden und Sie erhalten eine Email sobald der Job ferig ist.</p>
      </div>

      <b-collapse class="card" :open="false">
            <div
                slot="trigger"
                slot-scope="props"
                class="card-header"
                role="button"
                aria-controls="contentIdForA11y3">
                <p class="card-header-title">
                   {{ job_data.status | capitalize }}
                </p>
                <a class="card-header-icon">
                    <b-icon
                        :icon="props.open ? 'menu-down' : 'menu-up'">
                    </b-icon>
                </a>
            </div>
            <div class="card-content job_stdout_html ansi_fore ansi_back ansi_dark" v-html="job_stdout_html">
            </div>
      </b-collapse>
            <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
    </div>
</template>

<script>
  export default {
    name: 'job-stdout',
    props: ["job"],
    data() {
      return {
        job_data: '',
        job_stdout_html: '',
        loading: true,
      };
    },
    mounted: function() {
        if (this.job) {
          this.getJobStdout(this.job)
        }
    },
    watch: {
      job(val) {
        this.getJobStdout(val);
      }
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    methods: {
      finished: function(interval) {
          this.loading = false
          clearInterval(interval)
          this.$emit('finished')
      },
      getJobStdout: function(job_id) {
        var that = this
        var interval = setInterval(function() {
            that.$http.get(that.$store.state.backendURL + '/api/tower/jobs/' + job_id).then((res) => {
                that.job_data = JSON.parse(res.body)
                if (that.job_data.finished) that.finished(interval)
            }, () => {
                that.finished(interval)
                console.log("error")
            });
            if (that.job_data.status != "pending") {
                that.$http.get(that.$store.state.backendURL + '/api/tower/jobs/' + job_id + '/stdout').then((res) => {
                    var el = document.createElement( 'html' );
                    el.innerHTML = res.body
                    that.job_stdout_html = el.getElementsByTagName('body')[0].innerHTML
                }, () => {
                    that.finished(interval)
                    console.log("error")
                });
            }
        }, 3000);
      }
    }
  };
</script>
