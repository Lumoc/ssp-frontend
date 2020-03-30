<template>
    <div>
        <h2 class="subtitle">Apps</h2>
        <b-button type="is-primary" @click="openNewAppModal">New App</b-button>
        <br><br>
        <b-field>
            <b-loading :is-full-page="false" :active.sync="loading"></b-loading>
            <b-radio-button v-for="option in apps" v-bind:key="option" v-model="app"
                :native-value="option">
                <span>{{ option }}</span>
            </b-radio-button>
        </b-field>
        <br>
        <admins :kafkaBackendUrl="kafkaBackendUrl" :selectedEnvironmentId="selectedEnvironmentId" :app="app" :isInAdminConsole="false" v-show="app.length" />

    </div>
</template>

<script>
    import Admins from './Admins.vue';
    import NewApp from './NewApp.vue';

    export default {
        components: {
            Admins
        },
        props: ["kafkaBackendUrl", "selectedEnvironmentId", "mailFromToken"],
        data() {
            return {
                apps: [],
                app: '',
                loading: false
            };
        },
        created() {
            var self = this;
            this.$root.$once("fetch-apps", function () {
                self.app = '';
                self.apps = [];
                self.fetchApps();
            });
        },
        destroyed() {
            this.$root.$off("fetch-apps");
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
            lol: function() { console.log("lol");},
            refreshToken: function(appName) {
                // force token refresh
                this.$keycloak.updateToken(3600).success(() => {

                    this.fetchApps();
                    this.app = appName;
                    
                }).error(() => {
                    keycloak.clearToken()
                });
            },
            fetchApps: function() {
                this.loading = true;
                this.$http.get(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/apps/", null).then((res) => {
                    this.apps = res.data;
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            },
            openNewAppModal: function() {
                let modalProps = {
                    kafkaBackendUrl: this.kafkaBackendUrl,
                    environmentId: this.selectedEnvironmentId,
                    mailFromToken: this.mailFromToken
                };

                const newAppModal = this.$buefy.modal.open({
                    parent: this,
                    component: NewApp,
                    hasModalCard: true,
                    trapFocus: true,
                    props: modalProps,
                    events: {
                        'kafka-new-app-created': (appName) => {
                            this.refreshToken(appName);
                        }
                    }
                });
            }
        }
    };
</script>