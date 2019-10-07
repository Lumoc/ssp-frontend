<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">attach_money</i> Show DDC expenses</h1>
                </div>
                <h2 class="subtitle">
                    Here you find the costs for the DDC-infrastructure </h2>
            </div>
        </div>
        <br>
        <button v-bind:class="{'is-loading': loading}"
                v-on:click="getDDCBilling"
                class="button is-primary">Create cost accounting
        </button>
        <a v-if="csvDownload"
           class="button is-primary"
           :href="csvDownload"
           download="DDC_Verrechnung.csv">Download CSV
        </a>
        <br>
        <b-table :data="data"
                 :narrowed="true">

            <template slot-scope="props">
                <b-table-column field="sender" label="off" width="40">
                    {{ props.row.sender }}
                </b-table-column>
                <b-table-column field="receptionAssignment" label="receiving office" width="40">
                    {{ props.row.receptionAssignment }}
                </b-table-column>
                <b-table-column field="orderReception" label="reception order" width="40">
                    {{ props.row.orderReception }}
                </b-table-column>
                <b-table-column field="pspElement" label="Recepicant-PSP-element" width="40">
                    {{ props.row.pspElement }}
                </b-table-column>
                <b-table-column field="art" label="Art" width="40">
                    {{ props.row.art }}
                </b-table-column>
                <b-table-column field="project" label="Project" width="40">
                    {{ props.row.project }}
                </b-table-column>
                <b-table-column field="host" label="Host" width="40">
                    {{ props.row.host }}
                </b-table-column>
                <b-table-column field="total" label="Total" width="40" numeric>
                    {{ props.row.total }} CHF
                </b-table-column>
                <b-table-column field="backup" label="with Backup" width="40" numeric>
                    {{ props.row.backup }}
                </b-table-column>
            </template>

            <div slot="empty" class="has-text-centered">
                Click the button above to start the cost calculation
            </div>
        </b-table>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [],
        loading: false,
        csvDownload: ''
      };
    },
    methods: {
      getDDCBilling: function() {
        this.loading = true;

        this.$http.get(this.$store.state.backendURL + '/api/ddc/billing').then((res) => {
          this.data = res.body.rows;
          let blob = new Blob([res.body.csv], {type: 'text/csv'});

          this.csvDownload = window.URL.createObjectURL(blob);
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      }
    }
  };
</script>
