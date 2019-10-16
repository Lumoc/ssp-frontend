<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Tasks User Group</h1>
                </div>
                <h2 class="subtitle">
                    Here you can give yourself permissions again for task.sbb.ch</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Click here for the WZU self service portal documentation.</a></h3>
            </div>
        </div>
        <form v-on:submit.prevent="addToBackendTasks">
            <b-field label="Username (U/E/UE-Nr)"
                     :type="errors.has('Username') ? 'is-danger' : ''"
                     :message="errors.first('Username')"
                     ref="autofocus">
                <b-input v-model.trim="username"
                         name="Username"
                         v-validate.rules="{ required: true, regex:/^(u|U)([0-9]{6})$|^(ue|UE|Ue)([0-9]{5})$|^(e|E)([0-9]{6})$/}"
                         ref="autofocus">
                </b-input>
            </b-field>
            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">authorize
            </button>
        </form>
    </div>
</template>

<script>
    import { Validator } from 'vee-validate';

    const dictionary = {
        custom: {

            "Username": {
                required: "Please provide a username.",
                regex: "Please provide a valid U-,E- or Ue- number."
            }
        }
    };

    // Override and merge the dictionaries
    Validator.localize('de', dictionary);

    export default {
        data() {
            return {
                username:  '',
                loading: false
            };
        },
        methods: {
            addToBackendTasks: function() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;
                        this.$http.post(this.$store.state.wzuURL + '/api/tasks', {
                            username: this.username
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
