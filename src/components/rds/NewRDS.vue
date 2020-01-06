<style>
    .b-tooltip.is-right.is-multiline:after {
        text-align: left;
    }
    .maxlength .counter {
        font-weight: bold;
        transition: all .5s ease-in-out;
    }
</style>
<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cloud</i> Create a Managed Database</h1>
                </div>
                <h2 class="subtitle">
                    Create a new managed database. All orders are logged and will be billed.
                </h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newRDS">
            <b-field label="Instance Name">
                <b-input type="text"
                         required
                         v-model="extra_vars.otc_rds_instance_db_password">
                </b-input>
            </b-field>

            <b-field label="Version">
                <b-select :loading="loading" v-model="version" required></b-select>
            </b-field>

            <b-field>
                <template slot="label">
                    Availability Zone
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="This is where the VM will be started. It is recommended to distribute your VMs across different data centers.">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-select :loading="loading"
                          v-model="extra_vars.otc_rds_instance_availability_zones"
                          required>
                    <option value="eu-ch-01">Zollikofen</option>
                    <option value="eu-ch-02">Bern</option>
                </b-select>
            </b-field>

            <b-field label="Flavor">
                <b-select :loading="loading"
                          v-model="flavor"
                          required>
                    <option
                            v-for="flavor in flavors"
                            :value="flavor"
                            :key="flavor.name">
                        {{ flavor.name + " (VCPUs: " + flavor.vcpus + ", RAM: " + flavor.ram/1024 + "GB)" }}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Volume Type">
                <b-select :loading="loading"
                        v-model="extra_vars.otc_rds_instance_volume_type"
                        required>
                    <option value="COMMON">SATA: regular speed, cheaper</option>
                    <option value="ULTRAHIGH">SSD: high speed, more expensive</option>
                </b-select>
            </b-field>

            <b-field label="Volume Size">
                <b-field>
                    <b-input type="number"
                            required
                            min="40"
                            max="4000"
                            v-model.number="extra_vars.otc_rds_instance_volume_type">
                    </b-input>
                    <p class="control">
                        <span class="button is-static">GB</span>
                    </p>
                </b-field>
            </b-field>

            <b-field label="Mega ID">
                <b-input v-model="extra_vars.unifiedos_mega_id"
                         required
                         pattern="[a-zA-Z0-9]{16}"
                         validation-message="Please enter a valid Mega ID"></b-input>
            </b-field>
            <b-message type="is-info">
                Useful links for Mega ID: <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/85c6a9c748db00d1.htm">All Applications</a>, <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/a261aa7848d00c63.htm">Overview (e.g application creation form)</a>
            </b-message>

            <b-field>
                <template slot="label">
                    Accounting Number
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="Accounting number (e.g 77606105), internal order (70029490) or PSP element including phase number (1157803.4-10.1)">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-input v-model="extra_vars.unifiedos_accounting_number"
                         required
                         pattern="[0-9.-]*"
                         validation-message="Please enter a valid accounting number"></b-input>
            </b-field>
            <b-message type="is-info">
                Please only fill in correct information.
            </b-message>

            <b-field>
                <template slot="label">
                    Contact Email
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="Group mail for alerts and notifications">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-input type="email"
                         v-model="extra_vars.unifiedos_owner_email"
                         required>
                </b-input>
            </b-field>

            <ldap-groups v-model="extra_vars.otc_rds_tag_rds_group" help="The Active Directory group name is used for instance ownership (e.g. login, admin permissions)."></ldap-groups>


            <b-field label="Keep Backup">
                <b-field>
                    <b-input type="number"
                            required
                            min="3"
                            max="30"
                            v-model.number="extra_vars.otc_rds_instance_volume_type">
                    </b-input>
                    <p class="control">
                        <span class="button is-static">days</span>
                    </p>
                </b-field>
            </b-field>

            <b-field label="Backup Start Time">
                <b-field>
                    <b-timepicker
                            icon="clock"
                            required
                            :default-minutes="default_minutes"
                            v-model.number="backup_start_time">
                    </b-timepicker>
                </b-field>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Order Database
            </button>
        </form>
        <job-stdout :job="job" v-on:finished="stopLoading"></job-stdout>
    </div>
</template>
<script>
  import JobStdout from '../tower/JobStdout.vue'
  import LDAPGroups from '../shared/LDAPGroups.vue'
  export default {
      components: {
          'job-stdout': JobStdout,
          'ldap-groups': LDAPGroups,
      },
      data() {
          return {
              flavors: [],
              flavor: '',
              loading: false,
              job: '',
              version: '',
              backup_start_time: undefined,
              default_minutes: 0,
              extra_vars: {
                  otc_rds_instance_name: '',
                  otc_rds_instance_volume_size: 20,
                  otc_rds_tag_rds_group: '',
                  otc_rds_tag_sbb_contact: '',
                  otc_rds_tag_sbb_mega_id: '',
                  otc_rds_instance_availability_zones: 'eu-ch-0' + (Math.floor(Math.random() * 2) + 1).toString(), // returns a random integer from 1 to 2

                  otc_rds_instance_volume_type: 'COMMON',
                  otc_rds_tag_sbb_accounting_number: '',
              },
          };
      },
      mounted: function () {
          this.getFlavors();
      },
      computed: {
        job_template: function() {
           return (this.stage == 'p') ? '19632' : '19632' // '19306' : '19296'
        },
      },
      methods: {
          getFlavors: function () {
              this.loading = true;
              this.$http.get(this.$store.state.backendURL + '/api/rds/flavors').then((res) => {
                  let result = res.body.flavors;
                  this.flavor = resp.body.flavors[0];

                  this.loading = false;
              }, () => {
                  this.loading = false;
              });
          },
          stopLoading: function() {
            this.loading = false;
          },
          newRDS: function() {
              this.loading = true;

              let ev = this.extra_vars

              this.$http.post(this.$store.state.backendURL + '/api/tower/job_templates/' + this.job_template + '/launch', {
                    extra_vars: ev
              }).then((resp) => {
                  let json = JSON.parse(resp.body)
                  this.job = json.job
              }, () => {
                  this.loading = false;
              });
          }
      }
    };
</script>
