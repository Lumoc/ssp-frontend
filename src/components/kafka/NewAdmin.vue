<template>
  <form v-on:submit.prevent="addNewAdmin()">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">New Admin</p>
      </header>
      <section class="modal-card-body">
        <b-field label="E-Mail">
          <b-input type="email" v-model="email" :value="email" required></b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <b-button class="button" type="button" @click="$parent.close()">Close</b-button>
        <b-button type="is-primary" :loading="loading" native-type="submit">Add New Admin</b-button>
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
                email: ''   
            };
        },
        methods: {
            addNewAdmin: function() {
              if (this.email == null) {
                return;
              }
              this.loading = true;
              this.$http.post(this.kafkaBackendUrl + "/api/" + this.environmentId + "/admin/apps/" + this.appName + "/users/" + this.email, null).then((res) => {
                  this.$parent.close();       
                  
                  this.$store.commit('setNotification', {
                    notification: {
                        type: 'success',
                        message: 'New admin with e-mail ' + this.email + ' added.'
                    }
                  });

                  this.$emit("kafkaNewAdminAdded");
                  
                  this.loading = false;
              }, () => {
                  this.$parent.close();

                  this.$store.commit('setNotification', {
                    notification: {
                        type: 'danger',
                        message: 'Adding admin with email ' + this.email + ' failed. Please try again in a few minutes.'
                    }
                  });

                  this.loading = false;
              });
            }
        }
    };
</script>