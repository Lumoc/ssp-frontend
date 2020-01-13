<template>
    <div>
        <h2 class="subtitle">Clients</h2>
        <b-button type="is-primary" v-if="app.length" @click="openNewClientModal">New Client</b-button>
        <br><br>
        <b-table :data="clients" :loading="loading" detailed narrowed>
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
                <b-table-column field="delete">
                    <b-button type="is-danger" @click="deleteClient(props.row.clientId)">Delete</b-button>
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
    import NewClient from './NewClient.vue';

    export default {
        components: {
          NewClient
        },
        props: ["kafkaBackendUrl", "selectedEnvironmentId", "app"],
        data() {
            return {
                clients: [],
                loading: false
            };
        },
        watch: {
          selectedEnvironmentId: function() {
                if (this.kafkaBackendUrl.length) {
                    this.clients = [];
                    this.app = '';
                }
            },
            app: function() {
                if (this.kafkaBackendUrl.length && this.app.length) {
                    this.fetchClients(this.app);
                }
            }
        },
        methods: {
            fetchClients: function(appName) {
                this.loading = true;
                this.$http.get(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/admin/apps/" + appName + "/clients", null).then((res) => {
                    this.clients = res.data;
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            },
            openNewClientModal: function() {
                let modalProps = {
                    kafkaBackendUrl: this.kafkaBackendUrl,
                    environmentId: this.selectedEnvironmentId,
                    appName: this.app
                };

                const newClientModal = this.$buefy.modal.open({
                    parent: this,
                    component: NewClient,
                    hasModalCard: true,
                    trapFocus: true,
                    props: modalProps,
                    events: {
                        'kafka-new-client-added': (value) => {
                            this.fetchClients(this.app);
                        }
                    }
                });
            },
            deleteClient: function(clientId) {
                this.$buefy.dialog.confirm({
                    title: 'Warning: Deleting Client',
                    message: 'Are you sure you want to delete client with ID ' + clientId + '?',
                    cancelText: 'No, stop right now!',
                    confirmText: 'Yes, delete this client!',
                    onConfirm: () => {
                        this.$http.delete(this.kafkaBackendUrl + "/api/" + this.selectedEnvironmentId + "/admin/clients/" + clientId + "/" + this.app, null).then(() => {

                            this.$store.commit('setNotification', {
                                notification: {
                                    type: 'success',
                                    message: 'Client with id ' + clientId + ' deleted.'
                                }
                            });

                            this.fetchClients(this.app);
                        });
                    }
                });
            }
        }
    };
</script>