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
                image: '',
                billing: '',
                loading: false
            };
        },
        mounted: function () {
            this.getFlavors();
            this.getImages();
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
                            flavorName: this.flavor.name,
                            imageId: this.image.id,
                            billing: '' + this.billing
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