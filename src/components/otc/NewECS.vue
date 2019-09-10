<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cloud</i> Elastic Cloud Server erstellen</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du einen Elastic Cloud Server in der OTC erstellen. Alle Bestellungen werden geloggt & verrechnet.</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newECS">
            <b-field label="ECS Name"
                     :type="errors.has('ECS Name') ? 'is-danger' : ''"
                     :message="errors.first('ECS Name')">
                <b-input type="text"
                         v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9\-]+$/} }"
                         name="ECS Name"
                         v-model.number="ecsname">
                </b-input>
            </b-field>

            <b-message type="is-info">
                Hinweis: Die ECS Instanz wird den Namen "sbb-[ECS Name]" tragen.
            </b-message>

            <b-field label="Availability Zone"
                     :type="errors.has('AZ') ? 'is-danger' : ''"
                     :message="errors.first('AZ')">

                <b-select :loading="loading"
                          v-model="availabilityZone"
                          required>
                    <option
                            v-for="az in availabilityZones"
                            :value="az"
                            :key="az">
                        {{ az }}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Image"
                    :type="errors.has('Image') ? 'is-danger' : ''"
                    :message="errors.first('Image')">

                <b-select :loading="loading"
                        v-model="image"
                        required>
                    <option
                            v-for="image in images"
                            :value="image.name"
                            :key="image.name">
                        {{ image.trimmedName }}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Flavor"
                     :type="errors.has('Flavor') ? 'is-danger' : ''"
                     :message="errors.first('Flavor')">

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

            <template v-if="advanced">
                <b-field grouped>
                    <b-field label="Root Disk"
                            :type="errors.has('Root Disk') ? 'is-danger' : ''"
                            :message="errors.first('Root Disk')">

                        <b-select :loading="loading"
                                v-model="rootVolumeType"
                                required>
                            <option
                                    v-for="volumeType in volumeTypes"
                                    :value="volumeType.name"
                                    :key="volumeType.name">
                                {{ volumeType.name }}
                            </option>
                        </b-select>
                    </b-field>

                    <b-field label="GB"
                            :type="errors.has('Root Disk GB') ? 'is-danger' : ''"
                            :message="errors.first('Root Disk GB')">
                        <b-input type="text"
                                v-validate="{ rules: { required: true, regex: /^[0-9]+$/}, min_value: image.minDiskGigabytes }"
                                name="Root Disk GB"
                                v-model.number="rootDiskSize">
                        </b-input>
                    </b-field>

                </b-field>

                <b-message type="is-danger" v-if="image !== null && image.minDiskGigabytes > rootDiskSize">
                    Das gewählte Image benötigt eine mindestens {{ image.minDiskGigabytes }}GB grosse Root Disk.
                </b-message>
            </template>

            <b-field grouped>

                <b-field label="System Disk"
                        :type="errors.has('System Disk') ? 'is-danger' : ''"
                        :message="errors.first('System Disk')">

                    <b-select :loading="loading"
                            v-model="systemVolumeType"
                            required>
                        <option
                                v-for="volumeType in volumeTypes"
                                :value="volumeType.name"
                                :key="volumeType.name">
                            {{ volumeType.name }}
                        </option>
                    </b-select>
                </b-field>

                <b-field label="GB" v-if="advanced"
                        :type="errors.has('System Disk GB') ? 'is-danger' : ''"
                        :message="errors.first('System Disk GB')">
                    <b-input type="text"
                            v-validate="{ rules: { required: true, regex: /^[0-9]+$/}, min_value: image.minDiskGigabytes }"
                            name="System Disk GB"
                            v-model.number="systemDiskSize">
                    </b-input>
                </b-field>

            </b-field>


            <b-field grouped>
                <b-field label="Daten Disk"
                        :type="errors.has('Data Disk') ? 'is-danger' : ''"
                        :message="errors.first('Data Disk')">

                    <b-select :loading="loading"
                            v-model="dataVolumeType"
                            required>
                        <option
                                v-for="volumeType in volumeTypes"
                                :value="volumeType.name"
                                :key="volumeType.name">
                            {{ volumeType.name }}
                        </option>
                    </b-select>
                </b-field>

                <b-field label="GB"
                        :type="errors.has('Data Disk GB') ? 'is-danger' : ''"
                        :message="errors.first('Data Disk GB')">
                    <b-input type="text"
                            v-validate="{ rules: { required: true, regex: /^[0-9]+$/} }"
                            name="Data Disk GB"
                            v-model.number="dataDiskSize">
                    </b-input>
                </b-field>

            </b-field>

            <b-field>
                <b-checkbox v-model="advanced">
                    Fortgeschrittene Einstellungen
                </b-checkbox>
            </b-field>
            <b-message type="is-info">
                Das Filesystem Layout wird <a target="_blank" href="https://confluence.sbb.ch/x/3g6iQQ">hier</a> beschrieben.
            </b-message>

            <b-field label="SSH Public Key"
                     :type="errors.has('SSH Public Key') ? 'is-danger' : ''"
                     :message="errors.first('SSH Public Key')">
                <b-input type="textarea"
                         v-model="publicKey"
                         v-validate="'required'"
                         name="SSH Public Key">
                </b-input>
            </b-field>

            <b-field label="LDAP Gruppe"
                     :type="errors.has('LDAP Gruppe') ? 'is-danger' : ''"
                     :message="errors.first('LDAP Gruppe')">
                <b-input type="text"
                         v-model="ldapGroup"
                         v-validate="'required'"
                         name="LDAP Gruppe">
                </b-input>
            </b-field>

            <b-field label="Mega ID"
                     :type="errors.has('Mega ID') ? 'is-danger' : ''"
                     :message="errors.first('Mega ID')">
                <b-input type="text"
                         v-model="megaId"
                         v-validate="'required'"
                         name="Mega ID">
                </b-input>
            </b-field>

            <b-field label="Kontierungsnummer"
                     :type="errors.has('Kontierungsnummer') ? 'is-danger' : ''"
                     :message="errors.first('Kontierungsnummer')">
                <b-input type="text"
                         v-model.number="billing"
                         v-validate="'required'"
                         name="Kontierungsnummer">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">ECS erstellen
            </button>
        </form>
        <job-stdout :job="job"></job-stdout>
    </div>
</template>
<script>
  import JobStdout from '../tower/JobStdout.vue'
  export default {
      components: {
          'job-stdout': JobStdout
      },
      data() {
          return {
              ecsname: '',
              flavors: [],
              flavor: '',
              images: [],
              volumeTypes: [],
              availabilityZones: [],
              image: '',
              rootVolumeType: '',
              rootDiskSize: 10,
              systemVolumeType: '',
              systemDiskSize: 10,
              dataVolumeType: '',
              dataDiskSize: 20,
              billing: '',
              availabilityZone: '',
              publicKey: '',
              ldapGroup: '',
              megaId: '',
              loading: false,
              advanced: false,
              job: '',
          };
      },
      mounted: function () {
          this.getFlavors();
          this.getImages();
          this.getVolumeTypes();
          this.getAvailabilityZones();
      },
      methods: {
          getAvailabilityZones: function () {
              this.loading = true;
              this.$http.get(this.$store.state.backendURL + '/api/otc/availabilityzones').then((res) => {
                  let result = res.body.availabilityZones;
                  this.availabilityZones = result.sort();

                  this.availabilityZone = this.availabilityZones[0];

                  this.loading = false;
              }, () => {
                  this.loading = false;
              });
          },
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
          getVolumeTypes: function () {
              this.loading = true;
              this.$http.get(this.$store.state.backendURL + '/api/otc/volumetypes').then((res) => {
                  let result = res.body.volumeTypes;
                  this.volumeTypes = result.sort();

                  this.systemVolumeType = this.volumeTypes[0].name;
                  this.rootVolumeType = this.volumeTypes[0].name;
                  this.dataVolumeType = this.volumeTypes[0].name;

                  this.loading = false;
              }, () => {
                  this.loading = false;
              });
          },
          getImages: function () {
              this.loading = true;
              this.$http.get(this.$store.state.backendURL + '/api/otc/images').then((res) => {
                  let result = res.body.images;
                  this.images = result.sort().reverse();

                  this.image = this.images[0];

                  this.loading = false;
              }, () => {
                  this.loading = false;
              });
          },
          newECS: function() {
              if (this.flavor.ram < this.image.minRAMMegabytes) {
                  return;
              }

              if (this.rootDiskSize < this.image.minDiskGigabytes) {
                  return;
              }

              this.$validator.validateAll().then((result) => {
                  if (result) {
                      this.loading = true;

                      this.$http.post(this.$store.state.backendURL + '/api/tower/job_templates/launch', {
                          extra_vars: {
                            provision_otc_image: this.image,
                            provision_otc_accountingnr_tag: '' + this.billing,
                            data_disk_volume_size: this.dataDiskSize,
                            provision_otc_megaid_tag: this.megaId,
                            provision_otc_project_tag: this.ecsname,
                            provision_otc_instance_type: this.flavor.name,
                            provision_otc_ssh_key: this.publicKey,
                            provision_otc_root_size: this.rootDiskSize,
                            iam_pamd_projectadmingroup: this.ldapGroup,

                            provision_otc_default_volume_type: this.dataVolumeType,
                            provision_otc_rz_zone: this.availabilityZone.slice(-2),
                            provision_otc_service_time_tag: "5x12",
                            provision_otc_sla_tag: "best_effort",


                            rootVolumeType: this.rootVolumeType,
                            systemVolumeType: this.systemVolumeType,
                            systemDiskSize: this.systemDiskSize,
                          }
                      }).then((resp) => {
                          let json = JSON.parse(resp.body)
                          this.job = json.job
                          this.loading = false;
                      }, () => {
                          this.loading = false;
                      });
                  }
              });
          }
      }
    };
</script>
