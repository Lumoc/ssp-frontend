<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cloud</i> Elastic Cloud Server anzeigen</h1>
                </div>
                <h2 class="subtitle">
                    Hier werden deine Elastic Cloud Server aus OTC angezeigt.</h2>
            </div>
        </div>
        <br>
        <b-table :data="data" v-bind:class="{'is-loading': loading}" :narrowed="true">
            <template slot-scope="props">
                <b-table-column field="name" label="Name">
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="vcpus" label="VCPUs">
                    {{ props.row.vcpus }}
                </b-table-column>
                <b-table-column field="ram" label="RAM">
                    {{ props.row.ram/1024 }}GB
                </b-table-column>
                <b-table-column field="status" label="Status">
                    {{ props.row.status }}
                </b-table-column>
                <b-table-column field="image" label="Image">
                    {{ props.row.imageName }}
                </b-table-column>
                <b-table-column field="owner" label="Besitzer">
                    {{ props.row.owner }}
                </b-table-column>
                <b-table-column field="billing" label="Kontierungsnummer">
                    {{ props.row.billing }}
                </b-table-column>
                <b-table-column field="created" label="Erstellt">
                    {{ props.row.created }}
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
                loading: false
            };
        },
        mounted: function() {
            this.listECServer();
        },
        methods: {
            listECServer: function() {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/otc/ecs').then((res) => {
                    console.log(res.body.ecServers)
                    this.data = res.body.ecServers
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }
        }
    };
</script>