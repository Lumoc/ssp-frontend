<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        <i class="material-icons">dashboard</i>Show Sematext Logsene apps</h1>
                    <h2 class="subtitle">
                        Shows all your Sematext Lognese apps</h2>
                </div>
            </div>
        </div>
        <br>
        <label><strong>Logsene Apps</strong></label><br><br>
        <b-table :data="data"
                 :narrowed="true"
                 :striped="true"
                 :loading="loading">

            <template slot-scope="props">
                <b-table-column field="name" label="App Name">
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="planName" label="Logsene Plan">
                    {{ props.row.planName }}
                </b-table-column>
                <b-table-column field="isFree" label="Gratis?">
                    <b-icon
                            :icon="props.row.isFree ? 'checkbox-marked' : 'close-box'"
                            :type="props.row.isFree ? 'is-success' : 'is-danger'">
                    </b-icon>
                </b-table-column>
                <b-table-column field="pricePerMonth" label="Costs per Month">
                    {{ props.row.pricePerMonth }}$
                </b-table-column>
                <b-table-column field="billingInfo" label="Account number">
                    {{ props.row.billingInfo }}
                </b-table-column>
                <b-table-column field="userRole" label="Your Role">
                    {{ props.row.userRole }}
                </b-table-column>
            </template>

            <div slot="empty" class="has-text-centered">
                 You have no Logsene applications.
            </div>
        </b-table>
    </div>
</template>

<script>
    export default {
        mounted: function() {
            this.getSematextAppList();
        },
        data() {
            return {
                data: [],
                loading: false
            };
        },
        methods: {
            getSematextAppList: function() {
                this.loading = true;

                this.$http.get(this.$store.state.backendURL + '/api/sematext/logsene').then((res) => {
                    this.loading = false;
                    this.data = res.body;
                }, () => {
                    this.loading = false;
                });
            }
        }
    };
</script>
