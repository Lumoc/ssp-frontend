<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Bitbucket Projekt</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du ein Bitbucket Projekt erstellen</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="addToBackendBitbucket">
            <b-field label="Projekt Name (nur alphanummerische Zeichen)"
                     :type="errors.has('Projekt Name') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Name')">
                <b-input v-model.trim="bitprojectname"
                         name="Projekt Name"
                         v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9öäüÖÄÜ\s]+$/} }">
                </b-input>
            </b-field>

            <b-field label="Projekt Key (nur Grossbuchstaben beginnend mit Domänen Modell)"
                     :type="errors.has('Projekt Key') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Key')">
                <b-input v-model.trim="bitprojectkey"
                         name="Projekt Key"
                         v-validate="{ rules: { required: true, regex: /^(((KS|SC|PV|PN|MV|ZF|INV|BP|AM|ERP|KD|KI|MVC|MVG|MVP|OM|PT|PZ|RSW|USER|TEST|TA|FT)_?.*))$/} }">
                </b-input>
            </b-field>

            <b-field label="Projekt Beschreibung (kein Pflichtfeld)"
                     :type="errors.has('Projekt Beschreibung') ? 'is-danger' : ''"
                     :message="errors.first('Projekt Beschreibung')">
                <b-input v-model.trim="bitprojectdescription"
                         name="Projekt Beschreibung">
                </b-input>
            </b-field>

            <b-field label="Bestellung für anderen User (kein Pflichtfeld)"
                     :type="errors.has('Bestellung für anderen User') ? 'is-danger' : ''"
                     :message="errors.first('Bestellung für anderen User')">
                <b-input v-model.trim="bitprojectowner"
                         name="Bestellung für anderen User"
                         v-validate="{ rules: { required: false, regex:/^(u|U)([0-9]{6})$|^(ue|UE|Ue)([0-9]{5})$/ } }">
                </b-input>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Projekt erstellen
            </button>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                bitprojectname:  '',
                bitprojectkey: '',
                bitprojectdescription: '',
                bitprojectowner: '',
                loading: false
            };
        },
        methods: {
            addToBackendBitbucket: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        // @TODO switch to WZU backend
                        this.$http.post(this.$store.state.wzuURL + '/api/bitbucket', {
                            bitprojectname: this.bitprojectname,
                            bitprojectkey: this.bitprojectkey,
                            bitprojectdescription:  this.bitprojectdescription,
                            bitprojectowner: this.bitprojectowner
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
