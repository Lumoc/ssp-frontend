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
        <b-table :data="data"
                 v-bind:class="{'is-loading': loading}"
                 :narrowed="true">

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
            this.listECS();
        },
        methods: {
            listECS: function() {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/otc/ecs').then((res) => {

                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }
        }
    };
</script>