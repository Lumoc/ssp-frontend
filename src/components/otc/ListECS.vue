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
                <span>Aktionen</span>
                <b-icon icon="menu-down"></b-icon>
            </button>            

            <b-dropdown-item @click="stopECServers()" :disabled="!areAllServersStarted()">Stop</b-dropdown-item>
            <b-dropdown-item @click="startECServers()" :disabled="!areAllServersStopped()">Start</b-dropdown-item>
            <b-dropdown-item @click="rebootECServers()">Neustart</b-dropdown-item>
            <b-dropdown-item @click="deleteECServers()">Delete</b-dropdown-item>
        </b-dropdown>

        <button class="button is-danger" @click="listECServers()" v-bind:class="{'is-loading': loading}">
            <span>Aktualisieren</span>
        </button>
        
        <br><br>
        <b-table :data="data" v-bind:class="{'is-loading': loading}" :checked-rows.sync="checkedRows" :narrowed="true" checkable default-sort="name" :paginated="true" :per-page="20">
            <template slot-scope="props">
                <b-table-column field="name" label="Name" sortable>
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="ipv4" label="IPs" sortable>
                    <ul id="ips">
                        <li v-for="ip in props.row.ipv4" v-bind:key="ip">
                            {{ ip }}
                        </li>
                    </ul>                    
                </b-table-column>
                <b-table-column field="vcpus" label="VCPUs" sortable>
                    {{ props.row.vcpus }}
                </b-table-column>
                <b-table-column field="ram" label="RAM" sortable>
                    {{ props.row.ram/1024 }}GB
                </b-table-column>
                <b-table-column field="status" label="Status" sortable>
                    {{ props.row.status }}
                </b-table-column>
                <b-table-column field="imageName" label="Image" sortable>
                    {{ props.row.imageName }}
                </b-table-column>
                <b-table-column field="owner" label="Besitzer" sortable>
                    {{ props.row.owner }}
                </b-table-column>
                <b-table-column field="megaId" label="Mega ID" sortable>
                    {{ props.row.megaId }}
                </b-table-column>
                <b-table-column field="billing" label="Kontierungsnummer" sortable>
                    {{ props.row.billing }}
                </b-table-column>
                <b-table-column field="created" label="Erstellt" sortable>
                    {{ new Date(props.row.created).toLocaleString("de-CH") }}
                </b-table-column>
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
        methods: {
            listECServers: function() {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/otc/ecs').then((res) => {
                    console.log(res.body)
                    this.data = res.body.ecServers
                    this.checkedRows = []
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }, stopECServers: function() {
                this.$dialog.confirm({
                    title: 'Server Stoppen',
                    message: 'Die ausgewählten Server wirklich stoppen?',
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
                    message: 'Die ausgewählten Server wirklich starten?',
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
                    message: 'Die ausgewählten Server wirklich neustarten?',
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
                    message: 'Die ausgewählten Server wirklich löschen?',
                    confirmText: 'Löschen',
                    type: 'is-danger',
                    hasIcon: true,
                    cancelText: 'Abbrechen',
                    onConfirm: () => {
                        console.log({ "ecServers" : this.checkedRows })
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
                var started = true
                this.checkedRows.forEach(function(item) {
                    if (item.status !== 'ACTIVE') {
                        started = false
                    }
                });
                return started
            }, areAllServersStopped: function() {
                var stopped = true
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