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
                    <h1 class="title"><i class="material-icons">cloud</i> Your UnifiedOS Servers</h1>
                </div>
                <h2 class="subtitle">Your UnifiedOS servers will be listed here.</h2>
            </div>
        </div>
        <br>

        <b-field grouped>
            <b-dropdown :disabled="!checkedRows.length">
                <b-button type="is-danger" slot="trigger" icon-right="menu-down" :loading="loading">
                    Actions
                </b-button>

                <b-dropdown-item @click="stopServers()" :disabled="!areAllServersStarted()">Stop</b-dropdown-item>
                <b-dropdown-item @click="startServers()" :disabled="!areAllServersStopped()">Start</b-dropdown-item>
                <b-dropdown-item @click="rebootServers()">Reboot</b-dropdown-item>
                <!--<b-dropdown-item @click="deleteServers()">Delete</b-dropdown-item>-->
            </b-dropdown>

            <b-button type="is-danger" @click="listServers()" :loading="loading">Refresh</b-button>
            <b-taginput
                expanded
                v-model="tags"
                :loading="loading"
                :data="filteredMetadata"
                autocomplete
                :allow-new="false"
                :open-on-focus="true"
                icon="label"
                placeholder="Filter by tag"
                @typing="getFilteredMetadata"
                @input="getFilteredData">
            </b-taginput>
            <b-checkbox :disabled="loading" v-if="isAdmin" v-model="showall">Show all</b-checkbox>
        </b-field>
        <b-table :data="filteredData"
                 :loading="loading"
                 :checked-rows.sync="checkedRows"
                 :narrowed="false"
                 checkable
                 default-sort="name"
                 :paginated="true"
                 :per-page="20"
                 detailed
                 detail-key="id"
                 @details-open="getMoreDetails">
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
                                Flavor:
                            </td><td>
                                {{ props.row.flavor.id }}
                            </td></tr>
                            <tr><td>
                                IP address:
                            </td><td>
                                <ul id="ips">
                                    <li v-for="address in props.row.addresses">
                                        {{ address[0].addr }}
                                    </li>
                                </ul>
                            </td></tr>
                            <tr><td>
                                Created:
                            </td><td>
                                {{ moment(props.row.created).format('LLL') }}
                            </td></tr>
                        </table>
                    </div>
                    <div class="column">
                        <table>
                            <tr v-for="(value, key) in filterLegacy(props.row.metadata)">
                                <td>{{ key }}:</td>
                                <td>{{ value }}</td>
                            </tr>
                        </table>
                        <a v-on:click="editMetadata(props.row)">Edit</a>
                    </div>
                </div>
            </template>
            <div slot="empty" class="has-text-centered">
                If you have ECS instances they will be listed here.
            </div>
        </b-table>
        Servers are shown based on your Active Directory groups. You are in the following groups: <div class="groups">{{ groups }}</div>
    </div>
</template>
<script>
    import EditMetadataModal from './EditMetadataModal.vue';
    export default {
        components: {
            EditMetadataModal
        },
        data() {
            return {
                data: [],
                filteredData: [],
                checkedRows: [],
                loading: false,
                showall: false,
                groups: '',
                tags: [],
                filteredMetadata: [],
                metadata: [],
            };
        },
        mounted: function() {
            this.listServers();
            this.getADGroups();
        },
        filters: {
            replaceUnderscores: function (value) {
                if (!value) return ''
                return value.replace("_", " ")
            }
        },
        watch: {
            showall: function(val) {
                this.listServers();
            }
        },
        methods: {
            getFilteredData: function() {
                this.filteredData = this.data.filter(function(value) {
                    let res = true
                    for (let tag of this.tags) {
                       var kv = tag.split("=")
                       if (value.metadata[kv[0]] != kv[1]) {
                            res = false
                            break
                        }
                    }
                    return res
                }, this)
            },
            getMetadata: function() {
                let result = new Set()
                this.data.forEach(function(d) {
                    for (var key in d.metadata) {
                        result.add(key +"="+d.metadata[key])
                    }
                })
                return [...result].sort()
            },
            filterLegacy: function(metadata) {
                let legacy = ["Accounting_Number","Contact","Creator","Group","Mega_ID","OS","Owner","Project","SLA","Stage"]
                for (let m of legacy) {
                    delete metadata[m]
                }
                return metadata
            },
            getFilteredMetadata: function(text) {
                this.filteredMetadata = this.metadata.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0
                })
            },
            editMetadata: function(row) {
                let modalProps = {
                    server: row
                };
                this.$buefy.modal.open({
                    parent: this,
                    component: EditMetadataModal,
                    hasModalCard: true,
                    trapFocus: true,
                    props: modalProps,
                    events: {
                        'metadata-updated': (value) => {
                            // refresh
                        }
                    }
                });
            },
            getFirstId: function() {
                if (this.data.length > 0) {
                    return [this.data[0].id];
                } else {
                    return [];
                }
            },
            getCheckedServerNames: function() {
                return this.checkedRows.map(function(row) {
                    return row.name
                })
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
            listServers: function() {
                this.loading = true;
                this.tags = [];
                this.$http.get(this.$store.state.backendURL + '/api/otc/ecs', {
                                    params: {
                                        showall: this.showall
                                    }}).then((res) => {
                    this.data = res.body.servers;
                    // filteredData is not computed and only updated when a tag is added or removed
                    this.filteredData = this.data;
                    this.metadata = this.getMetadata();
                    // filteredMetadata is not computed and only updated when the user types something in the taginput
                    this.filteredMetadata = this.metadata;
                    this.checkedRows = [];
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            },
            stopServers: function() {
                let message = "Do you really want to stop the following servers?<br><br>"
                message += this.getCheckedServerNames().join('<br>')
                this.$buefy.dialog.confirm({
                    title: 'Shutdown Server',
                    message: message,
                    confirmText: 'Shutdown',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.loading = true;
                        this.$http.post(this.$store.state.backendURL + '/api/otc/stopecs', { "servers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            },
            startServers: function() {
                let message = 'Do you really want to start the following servers?'
                message += this.getCheckedServerNames().join('<br>')
                this.$buefy.dialog.confirm({
                    title: 'Start Servers',
                    message: message,
                    confirmText: 'Start',
                    type: 'is-info',
                    hasIcon: true,
                    onConfirm: () => {
                        this.loading = true;
                        this.$http.post(this.$store.state.backendURL + '/api/otc/startecs', { "servers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            },
            rebootServers: function() {
                let message = 'Do you really want to reboot the following servers?'
                message += this.getCheckedServerNames().join('<br>')
                this.$buefy.dialog.confirm({
                    title: 'Reboot Servers',
                    message: message,
                    confirmText: 'Reboot',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.loading = true;
                        this.$http.post(this.$store.state.backendURL + '/api/otc/rebootecs', { "servers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            },
            deleteServers: function() {
                let message = 'Do you really want to delete the following servers?'
                message += this.getCheckedServerNames().join('<br>')
                this.$buefy.dialog.confirm({
                    title: 'Delete Servers',
                    message: message,
                    confirmText: 'Delete',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.loading = true;
                        this.$http.post(this.$store.state.backendURL + '/api/otc/deleteecs', { "servers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            },
            areAllServersStarted: function() {
                var started = true;
                this.checkedRows.forEach(function(item) {
                    if (item.status !== 'ACTIVE') {
                        started = false
                    }
                });
                return started
            },
            areAllServersStopped: function() {
                var stopped = true;
                this.checkedRows.forEach(function(item) {
                    if (item.status !== 'SHUTOFF') {
                        stopped = false
                    }
                });
                return stopped
            },
            getMoreDetails: function(row, index) {
                console.log(row)
            },
            getADGroups: function() {
                this.$http.get(this.$store.state.backendURL + '/api/ldap/groups', null).then((res) => {
                    this.groups = res.body.sort().join(", ");
                }, () => {
                    // error
                });
            }
        },
        computed: {
            isAdmin() {
                if (this.groups.indexOf("DG_RBT_UOS_ADMINS") > -1) return true
                return false
            },
        }
    };
</script>
