<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">all_inclusive</i> App Management</h1>
                </div>
                <h2 class="subtitle">Manage your Kafka applications here.</h2>
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
        <UserApps :kafkaBackendUrl="kafkaBackendUrl" :selectedEnvironmentId="selectedEnvironmentId" :mailFromToken="true" />
    </div>
</template>
<script>
    import UserApps from './UserApps.vue'

    export default {
        components: {
            UserApps
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