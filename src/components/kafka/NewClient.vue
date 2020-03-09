<template>
  <form v-on:submit.prevent="addNewClient()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">New Client</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Client ID">
          <b-input type="text" v-model="clientId" :value="clientId" required></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button class="button" type="button" @click="$parent.close()">Close</b-button>
        <b-button type="is-primary" :loading="loading" native-type="submit">Add New Client</b-button>
      </footer>
    </div>
  </form>
</template>

<script>
    export default {
        props: ["kafkaBackendUrl", "environmentId", "appName"],
        data() {
            return {
                loading: false,
                clientId: ''
            };
        },
        methods: {
            addNewClient: function() {
              if (this.clientId == null) {
                return;
              }
              this.loading = true;
              this.$http.post(this.kafkaBackendUrl + "/api/" + this.environmentId + "/admin/clients/" + this.clientId + "/" + this.appName, null).then(() => {
                  this.$parent.close();
                  
                  this.$store.commit('setNotification', {
                    notification: {
                        type: 'success',
                        message: 'New client with ID ' + this.clientId + ' added.'
                    }
                  });

                  this.$emit("kafka-new-client-added");
                  
                  this.loading = false;
              }, () => {
                  this.$parent.close();

                  this.$store.commit('setNotification', {
                    notification: {
                        type: 'danger',
                        message: 'Adding client with ID ' + this.clientId + ' failed. Please try again in a few minutes.'
                    }
                  });

                  this.loading = false;
              });
            }
        }
    };
</script>