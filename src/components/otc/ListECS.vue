<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cloud</i> Show Elastic Cloud Server</h1>
                </div>
                <h2 class="subtitle">Your Elastic Cloud Servers will be listed here.</h2>
            </div>
        </div>
        <br>
       
        <b-dropdown :disabled="!checkedRows.length"  class="media-left">
            <button class="button is-danger" slot="trigger" v-bind:class="{'is-loading': loading}">
                <span>Aktionen</span>
                <b-icon icon="menu-down"></b-icon>
            </button>            

            <b-dropdown-item @click="stopECServers()" :disabled="!areAllServersStarted()">Stop</b-dropdown-item>
            <b-dropdown-item @click="startECServers()" :disabled="!areAllServersStopped()">Start</b-dropdown-item>
            <b-dropdown-item @click="rebootECServers()">Neustart</b-dropdown-item>
            <b-dropdown-item @click="deleteECServers()">Delete</b-dropdown-item>
        </b-dropdown>

        <button class="button is-danger" @click="listECServers()" v-bind:class="{'is-loading': loading}">
            <span>Update</span>
        </button>
        
        <br><br>
        <b-table :data="data" v-bind:class="{'is-loading': loading}" :checked-rows.sync="checkedRows" :narrowed="true" checkable default-sort="name" :paginated="true" :per-page="10" detailed detail-key="id" 
            :opened-detailed="getFirstId()">
            <template slot-scope="props">
                <b-table-column field="name" label="Name" sortable>
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="owner" label="Owner" sortable>
                    {{ props.row.owner }}
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
                                RAM:
                            </td><td>
                                {{ props.row.ram/1024 }}GB
                            </td></tr>
                            <tr><td>
                                vCPUs:
                            </td><td>
                                {{ props.row.vcpus }}
                            </td></tr>
                            <tr><td>
                                Image:
                            </td><td>
                                {{ props.row.imageName }}
                            </td></tr>                            
                            <tr><td>
                                IP Adressen:
                            </td><td>
                                <ul id="ips">
                                    <li v-for="ip in props.row.ipv4" v-bind:key="ip">
                                        {{ ip }}
                                    </li>
                                </ul>
                            </td></tr>
                            <tr><td>
                                Created:
                            </td><td>
                                {{ new Date(props.row.created).toLocaleString("de-CH") }}
                            </td></tr>
                            <tr><td>
                                Mega ID:
                            </td><td>
                                {{ props.row.megaId }}
                            </td></tr>
                            <tr><td>
                                Accounting number:
                            </td><td>
                                {{ props.row.billing }}
                            </td></tr>
                        </table>
                    </div>
                </div>
            </template>
            <div slot="empty" class="has-text-centered">
                If you have ECS instances they will be listed here.
            </div>
        </b-table>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                data: [],
                checkedRows: [],
                loading: false
            };
        },
        mounted: function() {
            this.listECServers();
        },
        methods: {
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
            listECServers: function() {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/otc/ecs').then((res) => {
                    this.data = res.body.ecServers.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
                    this.checkedRows = [];
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }, stopECServers: function() {
                this.$dialog.confirm({
                    title: 'Server Stoppen',
                    message: 'Do you really want the selected servers to be stopped?',
                    confirmText: 'Stoppen',
                    type: 'is-danger',
                    hasIcon: true,
                    cancelText: 'Abbrechen',
                    onConfirm: () => { 
                        this.loading = true;
                        this.$http.post(this.$store.state.backendURL + '/api/otc/stopecs', { "ecServers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            }, startECServers: function() {
                this.$dialog.confirm({
                    title: 'Server Starten',
                    message: 'Do you really want the selected server to be started?',
                    confirmText: 'Storten',
                    type: 'is-danger',
                    hasIcon: true,
                    cancelText: 'Abbrechen',
                    onConfirm: () => { 
                        this.loading = true;
                        this.$http.post(this.$store.state.backendURL + '/api/otc/startecs', { "ecServers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            }, rebootECServers: function() {
                this.$dialog.confirm({
                    title: 'Server Neustorten',
                    message: 'Do you really want the selected servers to be restarted?',
                    confirmText: 'Neustorten',
                    type: 'is-danger',
                    hasIcon: true,
                    cancelText: 'Abbrechen',
                    onConfirm: () => { 
                        this.loading = true;
                        this.$http.post(this.$store.state.backendURL + '/api/otc/rebootecs', { "ecServers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            }, deleteECServers: function() {
                this.$dialog.confirm({
                    title: 'Server Löschen',
                    message: 'Do you really want the selected server to be deleted?',
                    confirmText: 'Löschen',
                    type: 'is-danger',
                    hasIcon: true,
                    cancelText: 'Abbrechen',
                    onConfirm: () => {
                        this.loading = true;
                        this.$http.post(this.$store.state.backendURL + '/api/otc/deleteecs', { "ecServers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            }, areAllServersStarted: function() {
                var started = true;
                this.checkedRows.forEach(function(item) {
                    if (item.status !== 'ACTIVE') {
                        started = false
                    }
                });
                return started
            }, areAllServersStopped: function() {
                var stopped = true;
                this.checkedRows.forEach(function(item) {
                    if (item.status !== 'SHUTOFF') {
                        stopped = false
                    }
                });
                return stopped
            }
        }
    };
</script>
