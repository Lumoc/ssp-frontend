<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">attach_money</i> Change Sematext Logsene Accounting Number
                    </h1>
                </div>
                <h2 class="subtitle">
                    You can adjust your Sematext Logsene app accounting number here</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="updateSematextBilling">
            <b-field label="Logsene-App">
                <b-select placeholder="Choose your app"
                          :loading="loading"
                          v-model="appId"
                          required>
                    <option
                            v-for="app in apps"
                            :value="app.appId"
                            :key="app.name">
                        {{ app.name }}, Aktuelle Kontierung: {{ app.billingInfo }}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Project Name">
                <b-input v-model.trim="project"
                         name="Projekt"
                         required>
                </b-input>
            </b-field>

            <b-field label="New Accounting Number">
                <b-input v-model.trim="billing" required>
                </b-input>
            </b-field>

            <button v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Change accounting number
            </button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                apps: [],
                appId: '',
                billing: '',
                project: '',
                loading: false
            };
        },
        mounted: function () {
            this.getUsersApps();
        },
        methods: {
            getUsersApps: function () {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/sematext/logsene').then((res) => {
                    this.loading = false;
                    this.apps = res.body;
                }, () => {
                    this.loading = false;
                });
            },
            updateSematextBilling: function () {
                this.loading = true;

                this.$http.post(this.$store.state.backendURL + '/api/sematext/logsene/' + this.appId, {
                    project: this.project,
                    billing: this.billing
                }).then(() => {
                    this.loading = false;
                    this.getUsersApps();
                }, () => {
                    this.loading = false;
                });
            }
        }
    };
</script>
