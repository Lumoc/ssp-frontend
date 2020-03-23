<template>
  <form v-on:submit.prevent="addNewApp()">
    <div class="modal-card" style="width: 400px">
      <header class="modal-card-head">
        <p class="modal-card-title">New App</p>
      </header>
      <section class="modal-card-body">
        <b-field label="App Name">
          <b-input v-model="appName" required pattern="[a-z0-9-]*" validation-message="Only lower case letters, numbers and hyphens are allowed."></b-input>
        </b-field>
        <b-field label="First Admin's E-Mail">
          <b-input type="email" v-model="email" required></b-input>
        </b-field>
        <b-field label="Internal Order">
          <b-input v-model="internalOrder">
          </b-input>
        </b-field>
        <b-field label="PSP Number">
          <b-input v-model="pspNumber"></b-input>
        </b-field>
        <b-message title="Creating New App" :active.sync="infoIsActive">
            Please wait, app creation takes a while.
        </b-message>
      </section>
      <footer class="modal-card-foot">
        <b-button class="button" type="button" @click="$parent.close()">Close</b-button>
        <b-button type="is-primary" :loading="loading" native-type="submit">Add New App</b-button>
      </footer>
    </div>
  </form>
</template>

<script>
    export default {
        props: ["kafkaBackendUrl", "environmentId"],
        data() {
            return {
                loading: false,
                appName: '',
                email: '',
                internalOrder: '',
                pspNumber: '',
                infoIsActive: false
            };
        },
        methods: {
            addNewApp: function() {
              this.loading = true;
              this.infoIsActive = true;
              this.$http.post(this.kafkaBackendUrl + "/api/" + this.environmentId + "/apps", {
                "appName": this.appName,
                "userMails": [
                    this.email
                  ],
                "clients": [],
                "billingInformation": {
                  "pspElement" : this.pspNumber,
                  "innenAuftrag" : this.internalOrder
                }
              }).then(() => {
                  this.$parent.close();
                  
                  this.$store.commit('setNotification', {
                    notification: {
                        type: 'success',
                        message: 'New app ' + this.appName + ' created.'
                    }
                  });

                  this.$emit("kafka-new-app-created", this.appName);
                  
                  this.loading = false;
              }, () => {
                  this.$parent.close();

                  this.$store.commit('setNotification', {
                    notification: {
                        type: 'danger',
                        message: 'Creating app' + this.appName+ ' failed. Please try again in a few minutes.'
                    }
                  });

                  this.loading = false;
              });
            }
        }
    };
</script>