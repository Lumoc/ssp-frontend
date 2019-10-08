<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cloud</i> Elastic Cloud Server anzeigen</h1>
                </div>
                <h2 class="subtitle">Hier werden deine Elastic Cloud Server aus OTC angezeigt.</h2>
            </div>
        </div>
        <br>

        <b-dropdown :disabled="!checkedRows.length"  class="media-left">
            <button class="button is-danger" slot="trigger" v-bind:class="{'is-loading': loading}">
                <span>Actions</span>
                <b-icon icon="menu-down"></b-icon>
            </button>

            <b-dropdown-item @click="stopECServers()" :disabled="!areAllServersStarted()">Stop</b-dropdown-item>
            <b-dropdown-item @click="startECServers()" :disabled="!areAllServersStopped()">Start</b-dropdown-item>
            <b-dropdown-item @click="rebootECServers()">Reboot</b-dropdown-item>
            <!--<b-dropdown-item @click="deleteECServers()">Delete</b-dropdown-item>-->
        </b-dropdown>

        <button class="button is-danger" @click="listECServers()" v-bind:class="{'is-loading': loading}">
            <span>Aktualisieren</span>
        </button>

        <br><br>
        <b-table :data="data" v-bind:class="{'is-loading': loading}" :checked-rows.sync="checkedRows" :narrowed="true" checkable default-sort="name" :paginated="true" :per-page="10" detailed detail-key="id">
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
                                Erstellt:
                            </td><td>
                                {{ moment(props.row.created).format('LLL') }}
                            </td></tr>
                        </table>
                    </div>
                    <div class="column">
                        <table>
                            <tr v-for="(value, key) in props.row.metadata">
                                <td>{{ key | replaceUnderscores }}:</td>
                                <td>{{ value }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </template>
            <div slot="empty" class="has-text-centered">
                Solltest du ECS Instanzen besitzen, werden diese hier angezeigt.
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
        filters: {
            replaceUnderscores: function (value) {
                if (!value) return ''
                return value.replace("_", " ")
            }
        },
        methods: {
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
            listECServers: function() {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/otc/ecs').then((res) => {
                    this.data = res.body.ecServers;
                    this.checkedRows = [];
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }, stopECServers: function() {
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
                        this.$http.post(this.$store.state.backendURL + '/api/otc/stopecs', { "ecServers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            }, startECServers: function() {
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
                        this.$http.post(this.$store.state.backendURL + '/api/otc/startecs', { "ecServers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            }, rebootECServers: function() {
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
                        this.$http.post(this.$store.state.backendURL + '/api/otc/rebootecs', { "ecServers" : this.checkedRows }
                        ).then((res) => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                })
            }, deleteECServers: function() {
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
