<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">all_inclusive</i> Kafka Cost Forecast</h1>
                </div>
                <h2 class="subtitle">See how affordable Kafka really is.</h2>
            </div>
        </div>
        
        <section class="section">
            <b-table :data="data" :columns="columns" :loading="loading"></b-table>
        </section>

        <section class="section">
            <div class="tile is-ancestor">
                <div class="tile">
                    <b-field label="Partition Count">
                        <b-numberinput v-model="partitionCount" :loading="loading" min="1"></b-numberinput>
                    </b-field>
                </div>
                <div class="tile">
                    <b-field label="Storage in GB">
                        <b-numberinput v-model="storageGB" :loading="loading" min="1"></b-numberinput>
                    </b-field>
                </div>
                <div class="tile">
                    <b-field label="Incoming Data in GB">
                        <b-numberinput v-model="dataInGB" :loading="loading" min="1"></b-numberinput>
                    </b-field>
                </div>
                <div class="tile">
                    <b-field label="Outgoing Data in GB">
                        <b-numberinput v-model="dataOutGB" :loading="loading" min="1"></b-numberinput>
                    </b-field>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                partitionCount: 10,
                storageGB: 125,
                dataInGB: 15,
                dataOutGB:65,
                kafkaBillingUrl: '',
                loading: false,
                data: [],
                columns: 
                [
                    { 
                        field: "environment",
                        label: "Environment"
                    },
                    { 
                        field: "pricePartitionsPerDay",
                        label: "CHF Partitions/Day",
                        numeric: true
                    },
                    { 
                        field: "priceStoragePerDay",
                        label: "CHF Storage/Day",
                        numeric: true
                    },
                    { 
                        field: "priceDataInPerDay",
                        label: "CHF Data In/Day",
                        numeric: true
                    },
                    { 
                        field: "priceDataOutPerDay",
                        label: "CHF Data Out/Day",
                        numeric: true
                    },
                    { 
                        field: "pricePerDay",
                        label: "CHF/Day",
                        numeric: true
                    },
                    { 
                        field: "pricePerMonth",
                        label: "CHF/Month",
                        numeric: true
                    },
                    { 
                        field: "pricePerYear",
                        label: "CHF/Year",
                        numeric: true
                    }
                ]
            };
        },
        mounted: function() {
            this.fetchKafkaBillingUrl();
        },
        watch: {
            partitionCount: function() { this.debounceFetching(); },
            storageGB: function() { this.debounceFetching(); },
            dataInGB: function() { this.debounceFetching(); },
            dataOutGB: function() { this.debounceFetching(); },
        },
        methods: {
            debounceFetching: _.debounce(function() {
              this.fetchForecast() 
              }, 1000),
            fetchKafkaBillingUrl: function() {
                this.$http.get(this.$store.state.backendURL + "/api/kafka/backend").then((res) => {
                    this.kafkaBillingUrl = res.body.billing_url;
                    this.fetchForecast();
                });
            }, fetchForecast: function() {
              if (this.kafkaBillingUrl.length) {
                this.loading = true;
                this.$http.post(this.kafkaBillingUrl + "/api/forecast", {
                  "dataInGB": this.dataInGB,
                  "dataOutGB": this.dataOutGB,
                  "partitionCount": this.partitionCount,
                  "storageGB": this.storageGB
                }).then((res) => {
                      this.data = res.body;
                      this.loading = false;
                  });
              }
            }
        }
    };
</script>