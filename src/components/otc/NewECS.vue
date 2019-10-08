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
                    <h1 class="title"><i class="material-icons">cloud</i> Create a UnifiedOS Server</h1>
                </div>
                <h2 class="subtitle">
                    Create a new UnifiedOS server. All orders are logged and will be billed.
                </h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newECS">
            <b-field label="Project">
                <b-input type="text"
                         pattern="^[a-zA-Z0-9\-]+$"
                         validation-message="Project must be two characters long and only contain letters, numbers and dashes"
                         maxlength=6
                         minlength=2
                         v-bind:class="projectMaxLength"
                         v-model="extra_vars.unifiedos_project">
                </b-input>
            </b-field>

            <b-message type="is-info">
                Note: The VM will be named: {{ extra_vars.unifiedos_project | placeholder("&lt;project&gt;") }}-otc{{ extra_vars.unifiedos_availability_zone }}-{{ stage }}&lt;counter&gt;. Counter will be incremented if the name already exists.
            </b-message>

            <b-field label="Stage">
                <b-select :loading="loading"
                          v-model="stage"
                          required>
                    <option value="p">Production</option>
                    <option value="t">Test</option>
                </b-select>
            </b-field>

            <b-field>
                <template slot="label">
                    Availability Zone
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="This is where the VM will be started. It is recommended to distribute your VMs across different data centers.">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-select :loading="loading"
                          v-model="extra_vars.unifiedos_availability_zone"
                          required>
                    <option value="1">Zollikofen</option>
                    <option value="2">Bern</option>
                </b-select>
            </b-field>

            <b-field>
                <template slot="label">
                    Service Level Agreement
                    <b-tooltip type="is-dark" animated position="is-right" label="Click for more information">
                        <a target="_blank" href="https://confluence.sbb.ch/display/UOS">
                            <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                        </a>
                    </b-tooltip>
                </template>
                <b-select v-model="extra_vars.unifiedos_service_level" required>
                    <option>best_effort</option>
                    <option>1b</option>
                    <option>2a</option>
                </b-select>
            </b-field>

            <b-field>
                <template slot="label">
                    Image
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="UnifiedOS disk image name. Currently supported are Red Hat Enterprise Linux 7 and Windows Server 2016.">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-select :loading="loading"
                        v-model="image"
                        required>
                    <option v-for="m in images"
                            :value="m"
                            :key="m.name">
                        {{ m.trimmedName }}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Flavor">
                <template slot="label">
                    Flavor
                    <b-tooltip type="is-dark" animated position="is-right" label="Click for more information">
                        <a target="_blank" href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1045005162">
                            <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                        </a>
                    </b-tooltip>
                </template>

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
            <b-message type="is-danger" v-if="image !== null && image.minRAMMegabytes > flavor.ram">
                Das gewählte Image benötigt mindestens {{ image.minRAMMegabytes/1024 }}GB RAM.
            </b-message>

            <b-field label="Disk volume storage type">
                <b-select :loading="loading"
                        v-model="extra_vars.provision_otc_default_volume_type"
                        required>
                    <option value="SATA">SATA: regular speed, cheaper</option>
                    <option value="SSD">SSD: high speed, more expensive</option>
                </b-select>
            </b-field>

            <b-field>
                <template slot="label">
                    Persistent data size
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="Disk size for persistent data (e.g. /var/data on Linux or D:\ on Windows)">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-field>
                    <b-input type="number" required v-model.number="extra_vars.unifiedos_data_disk_size"></b-input>
                    <p class="control">
                        <span class="button is-static">GB</span>
                    </p>
                </b-field>
            </b-field>

            <b-field>
                <b-checkbox v-model="advanced">
                    Advanced settings
                </b-checkbox>
            </b-field>

            <template v-if="advanced">
                <b-field>
                    <template slot="label">
                        Root disk size
                        <b-tooltip type="is-dark" multilined animated position="is-right" label="Disk size for operating system (Linux: min 10GB / Windows: min 60GB)">
                            <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                        </b-tooltip>
                    </template>
                    <b-field>
                        <b-input type="number"
                                 required
                                 :min="image.minDiskGigabytes"
                                 v-model.number="extra_vars.unifiedos_root_disk_size">
                        </b-input>
                        <p class="control">
                            <span class="button is-static">GB</span>
                        </p>
                    </b-field>
                </b-field>

                <b-message type="is-danger" v-if="image !== null && image.minDiskGigabytes > extra_vars.unifiedos_root_disk_size">
                    Das gewählte Image benötigt eine mindestens {{ image.minDiskGigabytes }}GB grosse Root Disk.
                </b-message>
            </template>


            <b-message type="is-info">
                The filesystem layout is described <a target="_blank" href="https://confluence.sbb.ch/x/3g6iQQ">here</a>.
            </b-message>

            <ldap-groups v-bind:project.sync="extra_vars.unifiedos_owner_group"></ldap-groups>

            <b-field>
                <template slot="label">
                    Email
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="Group mail for alerts and notifications">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-input type="email"
                         v-model="extra_vars.unifiedos_owner_email"
                         required>
                </b-input>
            </b-field>

            <b-field label="Mega ID">
                <b-input type="text"
                         v-model="extra_vars.unifiedos_mega_id"
                         required>
                </b-input>
            </b-field>

            <b-field label="Accounting number">
                <b-input type="text"
                         v-model.number="extra_vars.unifiedos_accounting_number"
                         required>
                </b-input>
            </b-field>

            <b-field v-if="windows">
                <template slot="label">
                    Windows Defender excludes
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="Comma-separated file system paths that are excluded from Windows Defender malware scanner">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-input type="textarea"
                         v-model.number="extra_vars.defender_exclude_path"
                         required>
                </b-input>
            </b-field>


            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">ECS erstellen
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
              images: [],
              loading: false,
              advanced: false,
              job: '',
              stage: 'p',
              image: '',
              extra_vars: {
                unifiedos_project: '',
                unifiedos_data_disk_size: 20,
                unifiedos_owner_group: '',
                unifiedos_owner_email: '',
                unifiedos_mega_id: '',
                unifiedos_service_level: 'best_effort',
                unifiedos_availability_zone: '1',

                unifiedos_root_disk_size: 10,
                provision_otc_default_volume_type: 'SATA',
                unifiedos_accounting_number: '',
                defender_exclude_path: '',
              },
          };
      },
      watch: {
        image: function(image, old_image) {
           let size = this.extra_vars.unifiedos_root_disk_size
           // Set the minimum if the user hasn't changed the value or if the value is below minimum
           if (!old_image || size == old_image.minDiskGigabytes || size < image.minDiskGigabytes) {
                this.extra_vars.unifiedos_root_disk_size = image.minDiskGigabytes
           }
        }
      },
      mounted: function () {
          this.getFlavors();
          this.getImages();
      },
      filters: {
        placeholder: function (input, property) {
            return ( input === undefined || input === '' || input === null ) ? property : input;
        }
      },
      computed: {
        projectMaxLength: function() {
            return { maxlength: this.extra_vars.unifiedos_project.length == 6 }
        },
        job_template: function() {
           return (this.stage == 'p') ? '19632' : '19632' // '19306' : '19296'
        },
        windows: function() {
            return (this.image && this.image.name.toLowerCase().indexOf("windows") !== -1)
        }
      },
      methods: {
          getFlavors: function () {
              this.loading = true;
              this.$http.get(this.$store.state.backendURL + '/api/otc/flavors').then((res) => {
                  let result = res.body.flavors;
                  this.flavors = result.sort((a,b) => {
                      if (a.vcpus === b.vcpus) {
                          return (a.ram - b.ram)
                      } else {
                          return (a.vcpus - b.vcpus)
                      }
                  });

                  this.flavor = this.flavors[0];

                  this.loading = false;
              }, () => {
                  this.loading = false;
              });
          },
          getImages: function () {
              this.loading = true;
              this.$http.get(this.$store.state.backendURL + '/api/otc/images').then((res) => {
                  let result = res.body.images;
                  this.images = result.sort();

                  this.image = this.images[0];

                  this.loading = false;
              }, () => {
                  this.loading = false;
              });
          },
          stopLoading: function() {
              this.loading = false;
          },
          newECS: function() {
              if (this.flavor.ram < this.image.minRAMMegabytes) {
                  return;
              }

              if (this.extra_vars.unifiedos_root_disk_size < this.image.minDiskGigabytes) {
                  return;
              }

              this.$validator.validateAll().then((result) => {
                  if (result) {
                      this.loading = true;

                      let ev = this.extra_vars
                      ev.unifiedos_image = this.image.name
                      ev.unifiedos_accounting_number = '' + this.extra_vars.unifiedos_accounting_number
                      ev.provision_otc_instance_type = this.flavor.name,

                      this.$http.post(this.$store.state.backendURL + '/api/tower/job_templates/' + this.job_template + '/launch', {
                            extra_vars: ev
                      }).then((resp) => {
                          let json = JSON.parse(resp.body)
                          this.job = json.job
                      }, () => {
                          this.loading = false;
                      });
                  }
              });
          }
      }
    };
</script>
