<template>
    <div>
        <h2 class="subtitle">Admins</h2>
        <b-button type="is-primary" v-if="app.length" @click="openNewAdminModal">New Admin</b-button>
        <br><br>
        <b-table :data="admins" :loading="loading" narrowed>
            <template slot-scope="props">
                <b-table-column field="firstName" label="First Name" sortable>
                    {{ props.row.firstName }}
                </b-table-column>
                <b-table-column field="lastName" label="Last Name" sortable>
                    {{ props.row.lastName }}
                </b-table-column>
                <b-table-column field="username" label="Username" sortable>
                    {{ props.row.username }}
                </b-table-column>
                <b-table-column field="email" label="E-Mail" sortable>
                    {{ props.row.email }}
                </b-table-column>
                <b-table-column field="delete">
                    <b-button type="is-danger" @click="deleteAdmin(props.row.email)">Delete</b-button>
                </b-table-column>
            </template>
            <div slot="empty" class="has-text-centered">
                The admins table is empty.
            </div>
        </b-table>
    </div>
</template>

<script>
    import NewAdmin from './NewAdmin.vue';

    export default {
        components: {
          NewAdmin
        },
        props: ["kafkaBackendUrl", "selectedEnvironmentId", "app", "isInAdminConsole"],
        data() {
            return {
                admins: [],
                loading: false
            };
        },
        watch: {
          selectedEnvironmentId: function() {
                if (this.kafkaBackendUrl.length) {
                    this.admins = [];
                    this.app = '';
                }
            },
            app: function() {
              if (this.kafkaBackendUrl.length && this.app.length) {
                  this.fetchAdmins(this.app);
              } else {
                  this.admins = [];
              }
            }
        },
        methods: {
            refreshToken: function(fetchApps) {
                // this magic number is one hour which forces the token to refresh
                // the token expires after 30 minutes so 1 hour should be safe
                this.$keycloak.updateToken(3600).success(() => {
                    if (fetchApps) {
                        this.$root.$emit("fetch-apps");
                    }
                }).error(() => {
                    keycloak.clearToken()
                });
            },
            fetchAdmins: function(appName) {
                this.loading = true;
                this.$http.get(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/admin/apps/" + appName + "/users", null).then((res) => {
                    this.admins = res.data;
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            },
            openNewAdminModal: function() {
                let modalProps = {
                    kafkaBackendUrl: this.kafkaBackendUrl,
                    environmentId: this.selectedEnvironmentId,
                    appName: this.app
                };

                const newAdminModal = this.$buefy.modal.open({
                    parent: this,
                    component: NewAdmin,
                    hasModalCard: true,
                    trapFocus: true,
                    props: modalProps,
                    events: {
                        'kafka-new-admin-added': (value) => {
                            this.refreshToken(false);
                            this.fetchAdmins(this.app);
                        }
                    }
                });
            },
            deleteAdmin: function(email) {
                this.$buefy.dialog.confirm({
                    title: 'Warning: Deleting Admin',
                    message: email === this.$keycloak.tokenParsed.email ? 
                    'Sure you want to delete yourself as admin? You won\'t be able to manage the app anymore.' : 'Are you sure you want to delete admin with e-mail ' + email + '?',
                    type: 'is-danger',
                    hasIcon: true,
                    cancelText: 'No',
                    confirmText: 'Yes',
                    onConfirm: () => {
                        this.$http.delete(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/apps/" + this.app + "/users/" + email, null).then((res) => {

                            this.$store.commit('setNotification', {
                                notification: {
                                    type: 'success',
                                    message: 'Admin with e-mail ' + email + ' deleted.'
                                }
                            });

                            if (email === this.$keycloak.tokenParsed.email && !this.isInAdminConsole) {
                                // user removes himself from admin role
                                this.refreshToken(true);
                            } else {
                                this.refreshToken(false);
                                this.fetchAdmins(this.app);
                            }
                        });
                    }
                });
            }
        }
    };
</script>