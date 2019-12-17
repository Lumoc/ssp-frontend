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
        <b-select v-model="selectedEnvironmentId">
            <option
                v-for="option in environments"
                :value="option.environmentId"
                :key="option.environmentId">
                Environment: {{ option.environmentId }}
            </option>
        </b-select>
        <br>
        <b-table :data="data" v-bind:class="{'is-loading': loading}" detailed narrowed>
            <template slot-scope="props">
                <b-table-column field="name" label="Topic Name">
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="partitions" label="Partitions">
                    {{ props.row.partitions }}
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div class="columns">
                    <div class="column">
                        <table>
                            <div class="column">
                                <table>
                                    <tr v-for="(value, name) in props.row.configs">
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
                kafkaAutomationUrl: '',
                environments: [],
                loading: false,
                selectedEnvironmentId: ''
            };
        },
        watch: {
            selectedEnvironmentId(url) {
                if (url.length > 0) {
                    this.listTopics();
                }
            }
        },
        mounted: function() {
            this.getKafkaAutomation();
        },
        methods: {
            getKafkaAutomation: function() {
                this.$http.get(this.$store.state.backendURL + "/api/kafka/backend").then((res) => {
                    this.kafkaAutomationUrl = res.body.backend_url;
                    this.loadEnvironments()
                });
            },

            loadEnvironments: function() {
                this.$http.get(this.kafkaAutomationUrl + "/api/environments/").then((res) => {
                    this.environments = res.body;
                    this.selectedEnvironmentId = this.environments[0].environmentId;
                });
            },

            listTopics: function() {
                this.loading = true;
                this.$http.get(this.kafkaAutomationUrl + "/api/" + this.selectedEnvironmentId + "/topics/", null, {
                    headers: {
                        Accept: "*/*"
                    }
                }).then((res) => {
                    this.data = res.data;
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }
        }
    };
</script>