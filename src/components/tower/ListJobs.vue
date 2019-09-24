<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        <i class="material-icons">person</i> Ansible-Tower Jobs anzeigen</h1>
                    <h2 class="subtitle">
                        Zeigt alle deine Jobs an, die du auf dem Ansible-Tower gestartet hast</h2>
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
                    {{ moment(props.row.started).fromNow() }}
                    </b-tooltip>
                </b-table-column>
                <b-table-column field="status" label="Status" sortable>
                    <a :href="'/tower/jobs/' + props.row.id">{{ props.row.status }}</a>
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
    computed: {
      username() {
        return this.$store.state.user.name;
      }
    },
    data() {
      return {
        data: [],
        loading: false
      };
    },
    mounted: function() {
            this.loading = true;
            this.$http.get(this.$store.state.backendURL + '/api/tower/jobs').then((res) => {
              this.loading = false;
              let json = JSON.parse(res.body)
              this.data = json.results

              console.log(json.results)
            }, () => {
              this.loading = false;
            });
    }
  };
</script>
