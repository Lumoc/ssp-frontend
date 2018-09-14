<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Confluence Space</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du ein Confluence Space erstellen</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendConfluence">
            <b-field label="Space Name"
                     :type="errors.has('Space Name') ? 'is-danger' : ''"
                     :message="errors.first('Space Name')">
                <b-input v-model.trim="spacename"
                         name="Space Name"
                         v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9\s]+$/} }">
                </b-input>
            </b-field>
            <b-field label="Space Key"
                     :type="errors.has('Space Key') ? 'is-danger' : ''"
                     :message="errors.first('Space Key')">
                <b-input v-model.trim="spacekey"
                         name="spacekey"
                         v-validate="{ rules: { required: true, regex: /^[A-Z]{0,10}$/} }">
                </b-input>
            </b-field>
            <b-field label="Space Beschreibung"
                     :type="errors.has('Space Beschreibung') ? 'is-danger' : ''"
                     :message="errors.first('Space Beschreibung')">
                <b-input v-model.trim="spacedescription"
                         name="spacedescription">
                </b-input>
            </b-field>
            <b-field label="Bestellung für anderen User"
                     :type="errors.has('Bestellung für anderen User') ? 'is-danger' : ''"
                     :message="errors.first('Bestellung für anderen User')">
                <b-input v-model.trim="spaceowner"
                         name="Bestellung für anderen User"
                         v-validate="{ rules: { required: false, regex:/^(u|U)[0-9]{6}|(e|E)[0-9]{6}|(ue|Ue|UE)[0-9]{5}$/} }">
                </b-input>
            </b-field>

        <button :disabled="errors.any()"
                v-bind:class="{'is-loading': loading}"
                class="button is-primary">Space erstellen
        </button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                spacename:  '',
                spacekey: '',
                spacedescription: '',
                spaceowner: '',
                loading: false
            };
        },
        methods: {
            addToBackendConfluence: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        // @TODO switch to WZU backend
                        this.$http.post(this.$store.state.wzuURL + '/api/confluence', {
                            spacename: this.spacename,
                            spacekey: this.spacekey,
                            spacedescription: '' + this.spacedescription,
                            spaceowner: '' + this.spaceowner
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

