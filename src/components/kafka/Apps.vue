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
        <b-button type="is-danger" v-if="app.length" @click="deleteApp(app)">Delete {{ app }}</b-button>
        <br><br>
        <admins :kafkaBackendUrl="kafkaBackendUrl" :selectedEnvironmentId="selectedEnvironmentId" :app="app" v-show="app.length" />
        <br>
        <clients :kafkaBackendUrl="kafkaBackendUrl" :selectedEnvironmentId="selectedEnvironmentId" :app="app"  v-show="app.length" />

    </div>
</template>

<script>
    import Admins from './Admins.vue';
    import Clients from './Clients.vue';
    import NewApp from './NewApp.vue';

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
            },
            openNewAppModal: function() {

                let modalProps = {
                    kafkaBackendUrl: this.kafkaBackendUrl,
                    environmentId: this.selectedEnvironmentId
                };

                const newAdminModal = this.$buefy.modal.open({
                    parent: this,
                    component: NewApp,
                    hasModalCard: true,
                    trapFocus: true,
                    props: modalProps,
                    events: {
                        'kafka-new-app-created': (appName) => {
                            this.fetchApps();
                            this.app = appName;
                        }
                    }
                });
            }, deleteApp: function(app) {
                this.$buefy.dialog.confirm({
                    title: 'Warning: Deleting App',
                    message: 'Are you sure you want to delete app ' + app + '?',
                    cancelText: 'No, stop right now!',
                    confirmText: 'Yes, delete this app!',
                    onConfirm: () => {
                        this.$http.delete(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/admin/apps/" + this.app, null).then((res) => {

                            this.app = '';
                            this.apps = [];

                            this.$store.commit('setNotification', {
                                notification: {
                                    type: 'success',
                                    message: 'App ' + app + ' deleted.'
                                }
                            });

                            this.fetchApps();
                        });
                    }
                });
            }
        }
    };
</script>