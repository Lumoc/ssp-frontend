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
            <b-field label="Project/Product Name">
                <b-input type="text"
                         pattern="^[a-z][a-z0-9\-]+$"
                         validation-message="Project must be two characters long, start with a letter and only contain lowercase letters, numbers and dashes"
                         maxlength=6
                         minlength=2
                         required
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
                        <a target="_blank" href="https://confluence.sbb.ch/x/cQUFQQ#GrobkonzeptUnifiedOS-VerfügbareServiceLevels(SLA)">
                            <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                        </a>
                    </b-tooltip>
                </template>
                <b-select v-model="extra_vars.unifiedos_service_level" required>
                    <option value="best_effort">Best Effort</option>
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
                    <option v-for="m in filteredImages"
                            :value="m"
                            :key="m.name">
                        {{ m.pretty }}
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
                            v-for="flavor in filteredFlavors"
                            :value="flavor"
                            :key="flavor.name">
                        {{ flavor.name + " (VCPUs: " + flavor.vcpus + ", RAM: " + flavor.ram/1024 + "GB)" }}
                    </option>
                </b-select>
            </b-field>
            <b-message type="is-danger" v-if="image !== null && image.minRAMMegabytes > flavor.ram">
                The chossen image needs a minimum of {{ image.minRAMMegabytes/1024 }}GB RAM.
            </b-message>

            <b-field label="Disk Volume Storage Type">
                <b-select :loading="loading"
                        v-model="extra_vars.provision_otc_default_volume_type"
                        required>
                    <option value="SATA">SATA: regular speed, cheaper</option>
                    <option value="SSD">SSD: high speed, more expensive</option>
                </b-select>
            </b-field>

            <b-field>
                <template slot="label">
                    Persistent Data Size
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
                        Root Disk Size
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
                    The choosen image needs a minimum size of {{ image.minDiskGigabytes }}GB for the Root Disc.
                </b-message>
            </template>


            <b-message type="is-info">
                The filesystem layout is described <a target="_blank" href="https://confluence.sbb.ch/x/3g6iQQ">here</a>.
            </b-message>

            <b-message type="is-info">
                Your server will cost <b>CHF {{computedCosts | sumObject | round }}/day</b> (CHF {{computedCosts | sumObject | times30 | round }}/month)<br>
                - SLA: CHF {{ computedCosts.sla | round }}<br>
                - CPU: CHF {{ computedCosts.cpu }}<br>
                - RAM: CHF {{ computedCosts.ram }}<br>
                - Storage: CHF {{ computedCosts.volume }}
            </b-message>

            <ldap-groups v-model="extra_vars.unifiedos_owner_group" admingroup="DG_RBT_UOS_ADMINS" help="The Active Directory group name is used for instance ownership (e.g. login, admin permissions)."></ldap-groups>

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

            <b-field label="Mega ID">
                <b-input v-model="extra_vars.unifiedos_mega_id"
                         required
                         pattern="[a-zA-Z0-9]{16}"
                         validation-message="Please enter a valid Mega ID"></b-input>
            </b-field>
            <b-message type="is-info">
                Useful links for Mega ID: <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/85c6a9c748db00d1.htm">All Applications</a>, <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/a261aa7848d00c63.htm">Overview (e.g application creation form)</a>
            </b-message>

            <b-field v-if="windows">
                <template slot="label">
                    Windows Defender Excludes
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="Comma-separated file system paths that are excluded from Windows Defender malware scanner">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-input type="textarea" v-model.number="extra_vars.defender_exclude_path">
                </b-input>
            </b-field>
            <b-field>
                <b-checkbox required>
                    I confirm that my application meets the <a href="https://confluence.sbb.ch/x/W4JNPw" target="_blank">minimum operational requirements</a>
                </b-checkbox>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Order UnifiedOS Server
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
                  unifiedos_availability_zone: (Math.floor(Math.random() * 2) + 1).toString(), // returns a random integer from 1 to 2

                  unifiedos_root_disk_size: 10,
                  provision_otc_default_volume_type: 'SATA',
                  unifiedos_accounting_number: '',
                  defender_exclude_path: '',
              },
              costs: {
                  sla: {
                    windows: {
                      best_effort: 30/30,
                      '1b': 50/30,
                      '2a': 160/30,
                    },
                    linux: {
                      best_effort: 20/30,
                      '1b': 30/30,
                      '2a': 100/30,
                    }
                  },
                  cpu: 1.2,
                  ram: 0.3,
                  volume: {
                    SATA: 0.005,
                    SSD: 0.01,
                  }
              },
          };
      },
      watch: {
        image: function(image, old_image) {
            console.log(image)
           let size = this.extra_vars.unifiedos_root_disk_size
           // Set the minimum if the user hasn't changed the value or if the value is below minimum
           if (!old_image || size == old_image.minDiskGigabytes || size < image.minDiskGigabytes) {
                this.extra_vars.unifiedos_root_disk_size = image.minDiskGigabytes
           }
        },
        stage: function(s) {
            this.getFlavors();
        }
      },
      mounted: function () {
          this.getFlavors();
          this.getImages();
      },
      filters: {
        placeholder: function (input, property) {
            return ( input === undefined || input === '' || input === null ) ? property : input;
        },
        round: function(input) {
            return Math.round(input * 100) / 100
        },
        times30: function(input) {
            return input * 30
        },
        sumObject: function(input) {
            console.log(input)
            var total = 0;
            for (var p in input) {
                total += input[p]
            }
            console.log(total)
            return total
        }
      },
      computed: {
        computedCosts: function() {
            let sla
            if (this.isWindows(this.image)) {
                sla = this.costs.sla["windows"][this.extra_vars.unifiedos_service_level]
            } else {
                sla = this.costs.sla["linux"][this.extra_vars.unifiedos_service_level]
            }

            return {
                sla: sla,
                cpu: this.flavor.vcpus * this.costs.cpu,
                ram: (this.flavor.ram/1024) * this.costs.ram,
                volume: this.extra_vars.unifiedos_data_disk_size * this.costs.volume[this.extra_vars.provision_otc_default_volume_type],
            }
        },
        projectMaxLength: function() {
            return { maxlength: this.extra_vars.unifiedos_project.length == 6 }
        },
        job_template: function() {
           return (this.stage == 'p') ? '21541' : '21543' // '21541' : '21542'
        },
        windows: function() {
            return this.isWindows(this.image)
        },
        filteredFlavors: function() {
            return this.flavors.filter(function(flavor) {
                return flavor.ram >= 2048 && flavor.ram <= (32*1024) && flavor.vcpus <= 8 && flavor.name.startsWith("s3")
            }, this);
        },
        filteredImages: function() {
            // Add pretty name to object
            let filtered = this.images.map(function(image) {
                image.pretty = image.name.match("(?:.*)_(.*?)_(?:.*)")[1].replace("-", " ")
                return image
            })
            let cache = []
            // sort the array and only keep the first instance
            filtered = filtered.sort((a, b) => b.name.localeCompare(a.name)).filter(function(image) {
                if (cache.includes(image.pretty)) return false
                cache.push(image.pretty)
                return true
            })
            // Sort Linux before Windows
            return filtered.reverse()
        }
      },
      methods: {
          getFlavors: function () {
              this.loading = true;
              this.$http.get(this.$store.state.backendURL + '/api/otc/flavors', {
                    params: {
                        stage: this.stage
                    }
              }).then((res) => {
                  let result = res.body.flavors;
                  this.flavors = result.sort((a,b) => {
                      if (a.vcpus === b.vcpus) {
                          return (a.ram - b.ram)
                      } else {
                          return (a.vcpus - b.vcpus)
                      }
                  });

                  this.flavor = this.filteredFlavors[0];

                  this.loading = false;
              }, () => {
                  this.loading = false;
              });
          },
          isWindows: function(image) {
            return (image && image.name.toLowerCase().indexOf("windows") !== -1)
          },
          getImages: function () {
              this.loading = true;
              this.$http.get(this.$store.state.backendURL + '/api/otc/images').then((res) => {
                  this.images = res.body.images;

                  // Windows images have an incorrect minDiskGigabytes
                  for (let i = 0; i < this.images.length; i++) {
                      if (this.isWindows(this.images[i])) {
                         this.images[i].minDiskGigabytes = 60
                      }
                  }

                  this.image = this.filteredImages[0];

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
