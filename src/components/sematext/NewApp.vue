<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">timeline</i>Create a Sematext Logsene application
                </div>
                <h2 class="subtitle">
                    You can create a Sematext logsene application here</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newLogseneApp">
            <b-field label="App-Name"
                     :type="errors.has('App-Name') ? 'is-danger' : ''"
                     :message="errors.first('App-Name')">
                <b-input v-model.trim="appName"
                         name="App-Name"
                         v-validate="{ rules: { required: true, regex: /^[a-z0-9]([-a-z0-9]*[a-z0-9])$/} }"
                         ref="autofocus"
                         placeholder="projekt">
                </b-input>
            </b-field>

            <b-message type="is-info">
                Sematext Logsene koncepts: <a href="https://confluence.sbb.ch/x/AisiMg">Costs Log-Management</a><br/>
                -Max MB depends on the plan.<br/>
		-You should need a good plan so your logsize is just below the "default MB"<br/>
		-Expand the daily MB-Limit just so its below the Puffer<br/>
		-Reason: What you planned is what you pay even if there is leftover capacity.<br/>
            </b-message>

            <b-field label="Logsene-Plan"
                     :type="errors.has('Logsene-Plan') ? 'is-danger' : ''"
                     :message="errors.first('Logsene-Plan')">

                <b-select placeholder="Choose your new Sematext logsene plan"
                          :loading="loading"
                          v-model="planId"
                          @input="updateLimit()"
                          required>
                    <option
                            v-for="plan in plans"
                            :value="plan.planId"
                            :key="plan.name">
                        {{ plan.name }}, {{ plan.pricePerMonth }}$, Default MB: {{ plan.defaultDailyMaxLimitSizeMb }}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Daily MB-Limit"
                     :type="errors.has('Limite') ? 'is-danger' : ''"
                     :message="errors.first('Limite')">
                <b-input v-model.trim="limit"
                         name="Limite"
                         v-validate="'required'">
                </b-input>
            </b-field>

            <b-field label="Name of the project"
                     :type="errors.has('Projekt') ? 'is-danger' : ''"
                     :message="errors.first('Projekt')">
                <b-input v-model.trim="project"
                         name="Projekt"
                         v-validate="'required'">
                </b-input>
            </b-field>

            <b-field label="New account assignment number"
                     :type="errors.has('Kontierungsnummer') ? 'is-danger' : ''"
                     :message="errors.first('Kontierungsnummer')">
                <b-input v-model.trim="billing"
                         name="Kontierungsnummer"
                         v-validate="'required'">
                </b-input>
            </b-field>

            <b-field label="Discount Code">
                <b-input v-model.trim="discountcode"
                         name="Discountcode">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
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
                this.$validator.validateAll().then((result) => {
                    if (result) {
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
                });
            }
     	}
    }:
