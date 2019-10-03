<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        <i class="material-icons">person</i> Ansible-Tower Jobs</h1>
                    <h2 class="subtitle">
                        Only long running jobs are listed here</h2>
                </div>
            </div>
        </div>
        <br>
        <b-table :data="data"
                 :narrowed="true"
                 :loading="loading"
                 default-sort="started"
                 default-sort-direction="desc">

            <template slot-scope="props">
                <b-table-column field="started" label="Started" sortable>
                    <b-tooltip :label="moment(props.row.started).calendar()">
                    {{ moment(props.row.started).fromNow() | capitalize }}
                    </b-tooltip>
                </b-table-column>
                <b-table-column field="status" label="Status" sortable>
                    <a :href="'/tower/jobs/' + props.row.id">{{ props.row.status | capitalize }}</a>
                </b-table-column>
                <b-table-column field="description" label="Description" sortable>
                    {{ props.row.description }}
                </b-table-column>
            </template>

            <div slot="empty" class="has-text-centered">
                Noch keine Abfrage durchgeführt
            </div>
        </b-table>
    </div>
</template>


<script>
  export default {
    data() {
      return {
        data: [],
        loading: false
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
            this.$http.get(this.$store.state.backendURL + '/api/tower/jobs').then((res) => {
              this.loading = false;
              let json = JSON.parse(res.body)
              let filtered = json.results.filter(function(job) {
                // finished jobs are filtered on the backend
                if (job.status != "running") return true
                // filter the remaining jobs (not supported by tower api)
                let extra_vars = JSON.parse(job.extra_vars)
                return extra_vars.custom_tower_user_name == this.$store.state.user.name
              }, this);
              this.data = filtered
              console.log(json.results)
            }, () => {
              this.loading = false;
            });
    }
  };
</script>
