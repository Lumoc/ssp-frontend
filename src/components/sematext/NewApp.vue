<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">timeline</i> Create a Sematext Logsene App</h1>
                </div>
                <h2 class="subtitle">
                    You can create a Sematext Logsene app here
                </h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newLogseneApp">
            <b-field label="App Name">
                <b-input v-model.trim="appName"
                         required pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])$"
                         ref="autofocus"
                         placeholder="projekt">
                </b-input>
            </b-field>

            <b-message type="is-info">
                 Sematext plans: <a href="https://confluence.sbb.ch/x/AisiMg">Costs Log-Management</a><br/>
                - The "Daily Volume" should be just below your average expected log amount<br/>
                - The "Daily Volume" (capacity) is cheaper, but is always billed, even if you do not use it<br/>
                - Your log usage should be between the "Daily Volume" and the "Daily Volume Limit"<br/>
                - Sematext will reject logs if the usage increases above the "Daily Volume Limit"
            </b-message>

            <b-field label="Logsene-Plan">
                <b-select placeholder="Choose your new Sematext Logsene plan"
                          :loading="loading"
                          v-model="planId"
                          @input="updateLimit()"
                          required>
                    <option
                            v-for="plan in plans"
                            :value="plan.planId"
                            :key="plan.name">
                        {{ plan.name }}, {{ plan.pricePerMonth }}$, Default limit: {{ plan.defaultDailyMaxLimitSizeMb }}MB
                    </option>
                </b-select>
            </b-field>

            <b-field label="Daily Volume Limit">
                <b-field>
                    <b-input v-model.trim="limit" required>
                    </b-input>
                    <p class="control">
                        <span class="button is-static">MB</span>
                    </p>
                </b-field>
            </b-field>

            <b-field label="Project Name">
                <b-input v-model.trim="project" required>
                </b-input>
            </b-field>

            <b-field label="New Accounting Number">
                <b-input v-model.trim="billing" required>
                </b-input>
            </b-field>

            <b-field label="Discount Code">
                <b-input v-model.trim="discountcode">
                </b-input>
            </b-field>

            <button v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Logsene App erstellen
            </button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                plans: [],
                appName: '',
                project: '',
                planId: '',
                limit: '',
                billing: '',
                discountcode: '',
                loading: false
            };
        },
        mounted: function () {
            this.getAppPlans();
            this.getDiscountCode();
        },
        methods: {
            updateLimit: function() {
                if (this.planId) {
                    this.plans.forEach(p => {
                        if (p.planId === this.planId) {
                            this.limit = p.defaultDailyMaxLimitSizeMb;
                        }
                    });
                }
            },
            getDiscountCode: function() {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/sematext/discountcode').then((res) => {
                    this.loading = false;
                    this.discountcode = res.body;
                }, () => {
                    this.loading = false;
                });
            },
            getAppPlans: function () {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/sematext/plans').then((res) => {
                    this.loading = false;
                    this.plans = res.body;
                }, () => {
                    this.loading = false;
                });
            },
            newLogseneApp: function() {
                this.loading = true;

                this.$http.post(this.$store.state.backendURL + '/api/sematext/logsene', {
                    appName: this.appName,
                    billing: this.billing,
                    planId: this.planId,
                    limit: parseInt(this.limit),
                    discountCode: this.discountcode,
                    project: this.project
                }).then(() => {
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }
     	}
    };
</script>
