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
            <b-field label="Project"
                     :type="errors.has('Project') ? 'is-danger' : ''"
                     :message="errors.first('Project')">
                <b-input type="text"
                         v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9\-]+$/} }"
                         maxlength=6
                         minlength=2
                         name="Project"
                         v-model="extra_vars.unifiedos_project">
                </b-input>
            </b-field>

            <b-message type="is-info">
                Hinweis: Die ECS Instanz wird den Namen "{{ extra_vars.unifiedos_project | placeholder("&lt;project&gt;") }}-otc{{ extra_vars.unifiedos_availability_zone }}{{ stage }}-&lt;counter&gt;" tragen. Counter ist eine Laufnummer, falls es diesen Namen bereits gibt.
            </b-message>

            <b-field label="Stage"
                     :type="errors.has('Stage') ? 'is-danger' : ''"
                     :message="errors.first('Stage')">
                <b-select :loading="loading"
                          v-model="stage"
                          required>
                    <option value="p">Produktion</option>
                    <option value="t">Test</option>
                </b-select>
            </b-field>

            <b-field label="Availability Zone"
                     :type="errors.has('AZ') ? 'is-danger' : ''"
                     :message="errors.first('AZ')">

                <b-select :loading="loading"
                          v-model="extra_vars.unifiedos_availability_zone"
                          required>
                    <option>01</option>
                    <option>02</option>
                </b-select>
            </b-field>

            <b-field label="Image"
                    :type="errors.has('Image') ? 'is-danger' : ''"
                    :message="errors.first('Image')">

                <b-select :loading="loading"
                        v-model="image"
                        required>
                    <option
                            v-for="m in images"
                            :value="m"
                            :key="m.name">
                        {{ m.trimmedName }}
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

            <b-field label="Volume Type"
                    :type="errors.has('Volume Type') ? 'is-danger' : ''"
                    :message="errors.first('Volume Type')">

                <b-select :loading="loading"
                        v-model="extra_vars.provision_otc_default_volume_type"
                        required>
                    <option
                            v-for="volumeType in volumeTypes"
                            :value="volumeType.name"
                            :key="volumeType.name">
                        {{ volumeType.name }}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Data-Disk-Grösse"
                    :type="errors.has('Data-Disk-Grösse') ? 'is-danger' : ''"
                    :message="errors.first('Data-Disk-Grösse')">
                <b-input type="text"
                        v-validate="{ rules: { required: true, regex: /^[0-9]+$/} }"
                        name="Data-Disk-Grösse"
                        v-model.number="extra_vars.unifiedos_data_disk_size">
                </b-input>
            </b-field>

            <b-field>
                <b-checkbox v-model="advanced">
                    Fortgeschrittene Einstellungen
                </b-checkbox>
            </b-field>

            <template v-if="advanced">
                <b-field label="Root-Disk-Grösse"
                        :type="errors.has('Root-Disk-Grösse') ? 'is-danger' : ''"
                        :message="errors.first('Root-Disk-Grösse')">
                    <b-input type="text"
                            v-validate="{ rules: { required: true, regex: /^[0-9]+$/}, min_value: image.minDiskGigabytes }"
                            name="Root Disk GB"
                            v-model.number="extra_vars.provision_otc_root_size">
                    </b-input>
                </b-field>


                <b-message type="is-danger" v-if="image !== null && image.minDiskGigabytes > extra_vars.provision_otc_root_size">
                    Das gewählte Image benötigt eine mindestens {{ image.minDiskGigabytes }}GB grosse Root Disk.
                </b-message>
            </template>


            <b-message type="is-info">
                Das Filesystem Layout wird <a target="_blank" href="https://confluence.sbb.ch/x/3g6iQQ">hier</a> beschrieben.
            </b-message>

            <b-field label="SSH Public Key"
                     :type="errors.has('SSH Public Key') ? 'is-danger' : ''"
                     :message="errors.first('SSH Public Key')">
                <b-input type="textarea"
                         v-model="extra_vars.provision_otc_ssh_key"
                         v-validate="'required'"
                         name="SSH Public Key">
                </b-input>
            </b-field>

            <b-field label="LDAP Gruppe"
                     :type="errors.has('LDAP Gruppe') ? 'is-danger' : ''"
                     :message="errors.first('LDAP Gruppe')">
                <b-input type="text"
                         v-model="extra_vars.unifiedos_owner_group"
                         v-validate="'required'"
                         name="LDAP Gruppe">
                </b-input>
            </b-field>

            <b-field label="Email"
                     :type="errors.has('Email') ? 'is-danger' : ''"
                     :message="errors.first('Email')">
                <b-input type="text"
                         v-model="extra_vars.unifiedos_owner_email"
                         v-validate="'required'"
                         name="Email">
                </b-input>
            </b-field>
            <b-message type="is-info">
                Diese Email wird für die Kommunikation betreffend der VM verwendet. Es werden alle Monitoring-Alerts und andere technische Meldungen an diese Addresse geschickt. Die Inbox muss regelmässig geprüft werden. Wir behalten uns das Recht vor, eine VM herunter zu fahren, falls keine Antwort erfolgt.
            </b-message>

            <b-field label="Mega ID"
                     :type="errors.has('Mega ID') ? 'is-danger' : ''"
                     :message="errors.first('Mega ID')">
                <b-input type="text"
                         v-model="extra_vars.unifiedos_mega_id"
                         v-validate="'required'"
                         name="Mega ID">
                </b-input>
            </b-field>

            <b-field label="Kontierungsnummer"
                     :type="errors.has('Kontierungsnummer') ? 'is-danger' : ''"
                     :message="errors.first('Kontierungsnummer')">
                <b-input type="text"
                         v-model.number="extra_vars.provision_otc_accountingnr_tag"
                         v-validate="'required'"
                         name="Kontierungsnummer">
                </b-input>
            </b-field>

            <b-field label="SLA"
                    :type="errors.has('SLA') ? 'is-danger' : ''"
                    :message="errors.first('SLA')">

                <b-select v-model="extra_vars.unifiedos_service_level" required>
                    <option>best_effort</option>
                    <option>1b</option>
                    <option>2a</option>
                </b-select>
            </b-field>

            <b-field label="Servicezeit"
                    :type="errors.has('Servicezeit') ? 'is-danger' : ''"
                    :message="errors.first('Servicezeit')">

                <b-select v-model="extra_vars.unifiedos_service_time" required>
                    <option>5x12</option>
                    <option>7x12</option>
                    <option>7x24</option>
                </b-select>
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
  export default {
      components: {
          'job-stdout': JobStdout
      },
      data() {
          return {
              flavors: [],
              flavor: '',
              images: [],
              volumeTypes: [],
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
                unifiedos_service_time: '5x12',
                unifiedos_service_level: 'best_effort',
                unifiedos_availability_zone: '01',

                provision_otc_root_size: 10,
                provision_otc_ssh_key: '',
                provision_otc_default_volume_type: '',
                provision_otc_accountingnr_tag: '',
              },
          };
      },
      watch: {
        image: function(image, old_image) {
           let size = this.extra_vars.provision_otc_root_size
           // Set the minimum if the user hasn't changed the value or if the value is below minimum
           if (!old_image || size == old_image.minDiskGigabytes || size < image.minDiskGigabytes) {
                this.extra_vars.provision_otc_root_size = image.minDiskGigabytes
           }
        }
      },
      mounted: function () {
          this.getFlavors();
          this.getImages();
          this.getVolumeTypes();
      },
      filters: {
        placeholder: function (input, property) {
            return ( input === undefined || input === '' || input === null ) ? property : input;
        }
      },
      computed: {
        job_template: function() {
           return (this.stage == 'p') ? '19306' : '19296'
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
          getVolumeTypes: function () {
              this.loading = true;
              this.$http.get(this.$store.state.backendURL + '/api/otc/volumetypes').then((res) => {
                  let result = res.body.volumeTypes;
                  this.volumeTypes = result.sort();

                  this.extra_vars.provision_otc_default_volume_type = this.volumeTypes[0].name;

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

              if (this.extra_vars.provision_otc_root_size < this.image.minDiskGigabytes) {
                  return;
              }

              this.$validator.validateAll().then((result) => {
                  if (result) {
                      this.loading = true;

                      this.$http.post(this.$store.state.backendURL + '/api/tower/job_templates/19296/launch', {
                          extra_vars: {
                            unifiedos_owner_group: this.extra_vars.unifiedos_owner_group,
                            unifiedos_owner_email: this.extra_vars.unifiedos_owner_email,
                            unifiedos_image: this.image.name,
                            unifiedos_service_time: this.extra_vars.unifiedos_service_time,
                            unifiedos_service_level: this.extra_vars.unifiedos_service_level,
                            unifiedos_data_disk_size: this.extra_vars.unifiedos_data_disk_size,
                            unifiedos_mega_id: this.extra_vars.unifiedos_mega_id,

                            unifiedos_availability_zone: this.extra_vars.unifiedos_availability_zone,
                            provision_otc_instance_type: this.flavor.name,


                            provision_otc_root_size: this.extra_vars.provision_otc_root_size,
                            provision_otc_accountingnr_tag: '' + this.extra_vars.provision_otc_accountingnr_tag,
                            unifiedos_project: this.extra_vars.unifiedos_project,
                            provision_otc_ssh_key: this.extra_vars.provision_otc_ssh_key,
                            provision_otc_default_volume_type: this.extra_vars.provision_otc_default_volume_type,
                          }
                      }).then((resp) => {
                          console.log(resp)
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
