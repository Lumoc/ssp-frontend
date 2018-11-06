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
            
            <b-field grouped>
  
                <b-field label="System Disk"
                        :type="errors.has('System Disk') ? 'is-danger' : ''"
                        :message="errors.first('System Disk')">

                    <b-select :loading="loading"
                            v-model="systemVolumeType"
                            required>
                        <option
                                v-for="volumeType in volumeTypes"
                                :value="volumeType"
                                :key="volumeType.name">
                            {{ volumeType.name }}
                        </option>
                    </b-select>
                </b-field>
            
                <b-field label="GB"
                        :type="errors.has('System Disk GB') ? 'is-danger' : ''"
                        :message="errors.first('System Disk GB')">
                    <b-input type="text"
                            v-validate="{ rules: { required: true, regex: /^[0-9]+$/} }"
                            name="System Disk GB"
                            v-model.number="systemDiskSize">
                    </b-input>
                </b-field>
                
                <b-field label="Image"
                     :type="errors.has('Image') ? 'is-danger' : ''"
                     :message="errors.first('Image')">

                    <b-select :loading="loading"
                            v-model="image"
                            required>
                        <option
                                v-for="image in images"
                                :value="image"
                                :key="image.name">
                            {{ image.name }}
                        </option>
                    </b-select>
                </b-field>

            </b-field>

            <b-field label="Zusätzliche Daten Disks">
                <button type="button" class="button is-dark" @click="addDataDisk()" :disabled="dataDisks.length>=5">Hinzufügen</button>
            </b-field>

            <b-field grouped v-for="(dataDisk, key) in dataDisks" :key="key">
                <b-field label="Daten Disk">
                    <b-select :loading="loading"
                            v-model="dataDisks[key].volumeTypeId"
                            required>
                        <option
                                v-for="volumeType in volumeTypes"
                                :value="volumeType.id"
                                :key="volumeType.name">
                            {{ volumeType.name }}
                        </option>
                    </b-select>
                </b-field>

                <b-field label="GB"
                        :type="errors.has('Daten Disk GB' + key) ? 'is-danger' : ''"
                        :message="errors.first('Daten Disk GB' + key)">
                    <b-input type="text"
                            v-validate="{ rules: { required: true, regex: /^[0-9]+$/} }"
                            name="Daten Disk GB {key}"
                            v-model.number="dataDisks[key].diskSize">
                    </b-input>
                    
                </b-field>

                <b-field label="Löschen">
                    <button type="button" class="button is-dark" @click="deleteDataDisk(key)">X</button>
                </b-field>
            </b-field>

            <b-field label="SSH Public Key"
                     :type="errors.has('SSH Public Key') ? 'is-danger' : ''"
                     :message="errors.first('SSH Public Key')">
                <b-input type="textarea"
                         v-model="publicKey"
                         v-validate="'required'"
                         name="SSH Public Key">
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
    </div>
</template>
<script>
    export default {
        data() {
            return {
                ecsname: '',
                flavors: [],
                flavor: '',
                images: [],
                volumeTypes: [],
                availabilityZones: [],
                dataDisks: [],
                image: '',
                systemVolumeType: '',
                systemDiskSize: 1,
                billing: '',
                availabilityZone: '',
                publicKey: '',
                loading: false
            };
        },
        mounted: function () {
            this.getFlavors();
            this.getImages();
            this.getVolumeTypes();
            this.getAvailabilityZones();
        },
        methods: {
            addDataDisk: function() {
                this.dataDisks.push({ volumeTypeId: '', diskSize: 1});
                this.dataDisks[this.dataDisks.length-1].volumeTypeId = this.volumeTypes[0].id;
            },
            deleteDataDisk: function(key) {
                this.dataDisks.splice(key, 1);
            },
            getAvailabilityZones: function () {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/otc/availabilityzones').then((res) => {
                    let result = res.body.availabilityZones;                    
                    this.availabilityZones = result.sort((a,b) => (a > b) ? 1 : ((b > a) ? -1 : 0));

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
                    this.volumeTypes = result.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

                    this.systemVolumeType = this.volumeTypes[0];

                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            },
            getImages: function () {
                this.loading = true;
                this.$http.get(this.$store.state.backendURL + '/api/otc/images').then((res) => {
                    let result = res.body.images;
                    this.images = result.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

                    this.image = this.images[0];

                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            },
            newECS: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;

                        this.$http.post(this.$store.state.backendURL + '/api/otc/ecs', {
                            ecsName: this.ecsname,
                            availabilityZone: this.availabilityZone,
                            flavorName: this.flavor.name,
                            imageId: this.image.id,
                            billing: '' + this.billing,
                            publicKey: this.publicKey,
                            dataDisks: this.dataDisks,
                            systemVolumeTypeId: this.systemVolumeType.id,
                            systemDiskSize: this.systemDiskSize
                        }).then(() => {
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