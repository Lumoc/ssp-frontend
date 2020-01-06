<template>
    <div>
        <b-field>
            <b-radio-button v-for="option in apps" v-bind:key="option" v-model="app"
                :native-value="option">
                <span>{{ option }}</span>
            </b-radio-button>
        </b-field>

        <br>
        <b-table :data="users" v-bind:class="{'is-loading': usersLoading}" narrowed>
            <template slot-scope="props">            
                <b-table-column field="firstName" label="First Name">
                    {{ props.row.firstName }}
                </b-table-column>
                <b-table-column field="lastName" label="Last Name">
                    {{ props.row.lastName }}
                </b-table-column>                
                <b-table-column field="username" label="Username">
                    {{ props.row.username }}
                </b-table-column>
                <b-table-column field="email" label="E-Mail">
                    {{ props.row.email }}
                </b-table-column>
            </template>
        </b-table>

        <br>
        <b-table :data="clients" v-bind:class="{'is-loading': clientsLoading}" detailed narrowed>
            <template slot-scope="props">            
                <b-table-column field="clientId" label="Client ID">
                    {{ props.row.clientId }}
                </b-table-column>
                <b-table-column field="grantType" label="Grant Type">
                    {{ props.row.grantType }}
                </b-table-column>
                <b-table-column field="description" label="Description">
                    {{ props.row.description }}
                </b-table-column>
            </template>
            
            <template slot="detail" slot-scope="props">
                <div class="columns">                    
                    <div class="column">
                        <table>
                            <div class="column">
                                <table>
                                    <tr v-for="scope in props.row.scopes" v-bind:key="scope">
                                        
                                        <td>{{ scope }}</td>
                                    </tr>
                                </table>
                            </div>
                        </table>
                    </div>
                </div>
            </template>
        </b-table>
    </div>
</template>

<script>
    export default {
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
            }
        }
    };
</script>