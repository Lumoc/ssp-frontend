<template>
    <div>
        <h2 class="subtitle">Clients</h2>
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
    export default {
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
            }
        }
    };
</script>