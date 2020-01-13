<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">all_inclusive</i> Kafka Topic List</h1>
                </div>
                <h2 class="subtitle">Your topics will be listed here.</h2>
            </div>
        </div>
        <br>
        <h2 class="subtitle">Environments</h2>
        <b-field>
            <b-radio-button v-for="option in environments" v-bind:key="option.environmentId" v-model="selectedEnvironmentId"
                :native-value="option.environmentId">
                <span>{{ option.environmentFriendlyName }}</span>
            </b-radio-button>
        </b-field>
        <br>
        <h2 class="subtitle">Topics</h2>
        <b-table :data="data" :loading="loading" detailed narrowed default-sort="props.row.name">
            <template slot-scope="props">
                <b-table-column field="name" label="Topic Name" sortable>
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="partitions" label="Partitions" sortable>
                    {{ props.row.partitions }}
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div class="columns">
                    <div class="column">
                        <table>
                            <div class="column">
                                <table>
                                    <tr v-for="(value, name) in props.row.configs" v-bind:key="name">
                                        <td>{{ name }}:</td>
                                        <td>{{ value }}</td>
                                    </tr>
                                </table>
                            </div>
                        </table>
                    </div>
                </div>
            </template>
            <div slot="empty" class="has-text-centered">
                Don't have any topics yet? It doesn't have to be like that, read the <a href="https://confluence.sbb.ch/display/KAFKA/Getting+Started">getting started</a>.
            </div>
        </b-table>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                data: [],
                kafkaBackendUrl: '',
                environments: [],
                loading: false,
                selectedEnvironmentId: ''
            };
        },
        watch: {
            selectedEnvironmentId: function() {
                if (this.kafkaBackendUrl.length) {
                    this.fetchTopics();
                }
            }
        },
        mounted: function() {
            this.fetchKafkaBackendUrl();
        },
        methods: {
            fetchKafkaBackendUrl: function() {
                this.$http.get(this.$store.state.backendURL + "/api/kafka/backend").then((res) => {
                    this.kafkaBackendUrl = res.body.backend_url;
                    this.fetchEnvironments();
                });
            },

            fetchEnvironments: function() {
                this.$http.get(this.kafkaBackendUrl + "/api/environments/").then((res) => {
                    this.environments = res.body;
                    this.selectedEnvironmentId = this.environments[0].environmentId;
                });
            },

            fetchTopics: function() {
                this.loading = true;
                this.$http.get(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/topics/", null).then((res) => {
                    this.data = res.data;
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }
        }
    };
</script>