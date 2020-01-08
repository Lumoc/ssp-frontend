<template>
    <div>
        <h2 class="subtitle">Apps</h2>
        <b-field>
            <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
            <b-radio-button v-for="option in apps" v-bind:key="option" v-model="app"
                :native-value="option">
                <span>{{ option }}</span>
            </b-radio-button>
        </b-field>
        <br>
        <admins :kafkaBackendUrl="kafkaBackendUrl" :selectedEnvironmentId="selectedEnvironmentId" :app="app" />

        <br>
        <clients :kafkaBackendUrl="kafkaBackendUrl" :selectedEnvironmentId="selectedEnvironmentId" :app="app" />

    </div>
</template>

<script>
    import Admins from './Admins.vue';
    import Clients from './Clients.vue';

    export default {
        components: {
            Admins,
            Clients
        },
        props: ["kafkaBackendUrl", "selectedEnvironmentId"],
        data() {
            return {
                apps: [],
                app: '',
                loading: false
            };
        },
        watch: {
            selectedEnvironmentId: function() {
                if (this.kafkaBackendUrl.length) {

                    this.apps = [];
                    this.app = '';

                    this.fetchApps();
                }
            }
        },
        methods: {
            fetchApps: function() {
                this.loading = true;
                this.$http.get(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/admin/apps/", null).then((res) => {
                    this.apps = res.data;
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }
        }
    };
</script>