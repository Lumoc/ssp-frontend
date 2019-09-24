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
                 :loading="loading">

            <template slot-scope="props">
                <b-table-column field="sender" label="Benutzername">
                    {{ props.row }}
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
              console.log(res.body)
            }, () => {
              this.loading = false;
            });
    }
  };
</script>
