<template>
    <div class="card">
        <div class="card-header">
            <h1 class="card-header-title">{{ server.name }}</h1>
        </div>
        <div class="card-content">
            <b-field v-if="server.metadata">
                <template slot="label">
                    Accounting Number
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="Accounting number (e.g 77606105), internal order (70029490) or PSP element including phase number (1157803.4-10.1)">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-input v-model="server.metadata.sbb_accounting_number"
                         required
                         pattern="[0-9.-]*"
                         validation-message="Please enter a valid accounting number"></b-input>
            </b-field>
            <b-message type="is-info">
                Please only fill in correct information.
            </b-message>

            <b-field label="Mega ID" v-if="server.metadata">
                <b-input v-model="server.metadata.sbb_mega_id"
                         required
                         pattern="[a-zA-Z0-9]{16}"
                         validation-message="Please enter a valid Mega ID"></b-input>
            </b-field>
            <b-message type="is-info">
                Useful links for Mega-ID: <a target="_blank" href="https://sbb.sharepoint.com/teams/mega-publikationen/EADB/pages/85c6a9c748db00d1.aspx">All applications</a>, <a target="_blank" href="https://sbb.sharepoint.com/teams/mega-publikationen/EADB/pages/a261aa7848d00c63.aspx">Overview (e.g application creation form)</a>
            </b-message>
            <button class="button" @click="updateMetadata()">Update</button>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["server"],
        data() {
            return {
                loading: false,
            };
        },
        methods: {
            updateMetadata: function() {
                console.log(this.server)
                this.$parent.close();

                let job_template = ""

                // SBB_RZ_T_001
                if (this.server.tenant_id == "40a69db965224733ae2075a9c9973ff2") {
                    job_template = "568"
                }
                // SBB_RZ_P_001
                if (this.server.tenant_id == "7266b78d57064468bfeaa6c8443844e8") {
                    job_template = "567"
                }
                if (job_template == "") {
                    this.$store.commit('setNotification', {
                      notification: {
                          type: 'danger',
                          message: 'This tenant does not support server modification yet',
                      }
                    });
                    console.log('Tenant ' +this.server.tenant_id+' does not support server modification')
                    return
                }
                this.loading = true;
                this.$http.post(this.$store.state.backendURL + '/api/tower/job_templates/' + job_template + '/launch', {
                      extra_vars: {
                        unifiedos_hostname: this.server.name,
                        unifiedos_mega_id: this.server.metadata.sbb_mega_id,
                        unifiedos_accounting_number: this.server.metadata.sbb_accounting_number
                      }
                }).then((resp) => {
                    let json = JSON.parse(resp.body)
                    this.loading = false;
                    this.$store.commit('setNotification', {
                      notification: {
                          type: 'success',
                          message: 'The server ' + this.server.name + ' has been updated. Check the progress <a href="/tower/jobs/' + json.job + '">here</a>',
                      }
                    });
                }, () => {
                    this.loading = false;
                });
            }
        }
    };
</script>
