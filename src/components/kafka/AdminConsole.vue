<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">all_inclusive</i> Admin Console</h1>
                </div>
                <h2 class="subtitle">Select environment and app to see users, clients and their scopes.</h2>
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
        <Apps :kafkaBackendUrl="kafkaBackendUrl" :selectedEnvironmentId="selectedEnvironmentId" />
    </div>
</template>
<script>
    import Apps from './Apps.vue'

    export default {
        components: {
            Apps
        },
        data() {
            return {
                kafkaBackendUrl: '',
                environments: [],
                selectedEnvironmentId: ''
            };
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
            }
        }
    };
</script>