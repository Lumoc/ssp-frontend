<style>
    .groups {
        color: #888;
    }
    .field.is-grouped > div, .field.is-grouped > button {
        margin: 0 5px;
    }
</style>
<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cloud</i> Your Databases</h1>
                </div>
                <h2 class="subtitle">Your Databases will be listed here.</h2>
            </div>
        </div>
        <br>

        <b-field grouped>
            <b-button type="is-danger" @click="listRDS()" :loading="loading">Refresh</b-button>
        </b-field>
        <b-table :data="data" :loading="loading" :narrowed="false" checkable default-sort="name" :paginated="true" :per-page="10" detailed detail-key="id">
            <template slot-scope="props">
                <b-table-column field="name" label="Name" sortable>
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="status" label="Status" sortable>
                    {{ props.row.status }}
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div class="columns">
                    <div class="column">
                        <table>
                            <tr><td>
                                Created:
                            </td><td>
                                {{ moment(props.row.created).format('LLL') }}
                            </td></tr>
                            <tr><td>
                                IP:
                            </td><td>
                                {{ props.row.private_ips[0] }}
                            </td></tr>
                            <tr><td>
                                Port:
                            </td><td>
                                {{ props.row.port }}
                            </td></tr>
                            <tr><td>
                                Type:
                            </td><td>
                                {{ props.row.type }}
                            </td></tr>
                            <tr><td>
                                Database:
                            </td><td>
                                {{ props.row.datastore.type }} {{ props.row.datastore.version }}
                            </td></tr>
                            <tr><td>
                                Flavor:
                            </td><td>
                                {{ props.row.flavor_ref }}
                            </td></tr>
                            <tr><td>
                                Volume:
                            </td><td>
                                {{ props.row.volume.size }}GB
                            </td></tr>
                            <tr><td>
                                Backup:
                            </td><td>
                                {{ props.row.backup_strategy.start_time }} keep {{ props.row.backup_strategy.keep_days }} days
                            </td></tr>

                        </table>

                    </div>
                    <div class="column">
                        <table>
                            <tr v-for="(value, key) in props.row.Tags">
                                <td>{{ key }}:</td>
                                <td>{{ value }}</td>
                            </tr>
                        </table>

                    </div>
                </div>
            </template>
            <div slot="empty" class="has-text-centered">
                If you have RDS instances they will be listed here.
            </div>
        </b-table>
        Databases are shown based on your Active Directory groups. You are in the following groups: <div class="groups">{{ groups }}</div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                data: [],
                filteredData: [],
                loading: false,
                groups: '',
                tags: [],
                filteredMetadata: [],
                metadata: [],
            };
        },
        mounted: function() {
            this.listRDS();
            this.getADGroups();
        },
        methods: {
            getMetadata: function() {
                let result = new Set()
                this.data.forEach(function(d) {
                    for (var key in d.metadata) {
                        result.add(key +"="+d.metadata[key])
                    }
                })
                return [...result].sort()
            },
            getFilteredMetadata: function(text) {
                this.filteredMetadata = this.metadata.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0
                })
            },
            getFirstId: function() {
                if (this.data.length > 0) {
                    return [this.data[0].id];
                } else {
                    return [];
                }
            },
            getDeviceName: function(volume, serverId) {
                var device = '';
                volume.attachments.forEach(function(attachment) {
                    if (attachment.server_id === serverId) {
                        device = attachment.device;
                    }
                });
                return device;
            },
            listRDS: function() {
                console.log("listRDS")
                this.loading = true;
                this.tags = [];
                this.$http.get(this.$store.state.backendURL + '/api/otc/rds/instances').then((res) => {
                    console.log(res)
                    this.data = res.body;
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            },
            getADGroups: function() {
                this.$http.get(this.$store.state.backendURL + '/api/ldap/groups', null).then((res) => {
                    this.groups = res.body.sort().join(", ");
                }, () => {
                    // error
                });
            }
        }
    };
</script>
