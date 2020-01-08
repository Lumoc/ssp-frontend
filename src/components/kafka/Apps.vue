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
        <h2 class="subtitle">Admins</h2>
        <b-button type="is-primary" v-if="app.length > 0" @click="openNewAdminModal">New Admin</b-button>
        <br><br>
        <b-table :data="users" v-bind:class="{'is-loading': usersLoading}" narrowed>
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
                <b-table-column field="delete" label="Delete" sortable>
                    <b-button type="is-danger" @click="deleteAdmin(props.row.email)">Delete</b-button>
                </b-table-column>
            </template>
            <div slot="empty" class="has-text-centered">
                The users table is empty.
            </div>
        </b-table>

        <br>
        <h2 class="subtitle">Clients</h2>
        <b-table :data="clients" v-bind:class="{'is-loading': clientsLoading}" detailed narrowed>
            <template slot-scope="props">            
                <b-table-column field="clientId" label="Client ID" sortable>
                    {{ props.row.clientId }}
                </b-table-column>
                <b-table-column field="grantType" label="Grant Type" sortable>
                    {{ props.row.grantType }}
                </b-table-column>
                <b-table-column field="description" label="Description" sortable>
                    {{ props.row.description }}
                </b-table-column>
            </template>
            
            <template slot="detail" slot-scope="props">
                <div class="columns">                    
                    <div class="column">
                        <table>
                            <div class="column">
                                <table>
                                    <th>Scope</th>
                                    <tr v-for="scope in props.row.scopes" v-bind:key="scope">
                                        <td>{{ scope }}</td>
                                    </tr>
                                </table>
                            </div>
                        </table>
                    </div>
                </div>
            </template>
            <div slot="empty" class="has-text-centered">
                The clients table is empty.
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
        props: ["kafkaBackendUrl", "selectedEnvironmentId"],
        data() {
            return {
                apps: [],
                app: '',
                clients: [],
                users: [],
                loading: false,
                clientsLoading: false,
                usersLoading: false
            };
        },
        watch: {
            selectedEnvironmentId: function() {
                if (this.kafkaBackendUrl.length > 0) {

                    this.clients = [];
                    this.users = [];
                    this.apps = [];
                    this.app = '';

                    this.fetchApps();
                }
            },
            app: function() {
                if (this.kafkaBackendUrl.length > 0 && this.app.length > 0) {
                    this.fetchUsers(this.app);
                    this.fetchClients(this.app);
                }
            }
        },
        methods: {
            fetchUsers: function(appName) {
                this.usersLoading = true;
                this.$http.get(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/admin/apps/" + appName + "/users", null, {
                    headers: {
                        Accept: "*/*"
                    }
                }).then((res) => {
                    this.users = res.data;
                    this.usersLoading = false;
                }, () => {
                    this.usersLoading = false;
                });
            },
            fetchClients: function(appName) {
                this.clientsLoading = true;
                this.$http.get(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/admin/apps/" + appName + "/clients", null, {
                    headers: {
                        Accept: "*/*"
                    }
                }).then((res) => {
                    this.clients = res.data;
                    this.clientsLoading = false;
                }, () => {
                    this.clientsLoading = false;
                });
            },
            fetchApps: function() {
                this.loading = true;
                this.$http.get(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/admin/apps/", null, {
                    headers: {
                        Accept: "*/*"
                    }
                }).then((res) => {
                    this.apps = res.data;
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
                }

                const newAdminModal = this.$buefy.modal.open({
                    parent: this,
                    component: NewAdmin,
                    hasModalCard: true,
                    trapFocus: true,
                    props: modalProps
                });
            },
            deleteAdmin: function(email) {
                this.$buefy.dialog.confirm({
                    title: 'Warning: Deleting Admin',
                    message: 'Are you sure you want to delete admin with e-mail ' + email + '?',
                    cancelText: 'No, stop right now!',
                    confirmText: 'Yes, delete this admin.',
                    onConfirm: () => {
                        this.$http.delete(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/admin/apps/" + this.app + "/users/" + email, null, {
                            headers: {
                                Accept: "*/*"
                            }
                        }).then((res) => {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: 'Admin with e-mail ' + email + ' deleted.',
                                type: 'is-success'
                            });

                            this.fetchUsers(this.app);
                        });
                    }
                });
            }
        }
    };
</script>