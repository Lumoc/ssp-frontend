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
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button class="button is-primary">Add New Admin</button>
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
              if (typeof this.email === 'undefined' || this.email === null) {
                return;
              }

              this.$http.post(this.kafkaBackendUrl + "/api/" + this.environmentId + "/admin/apps/" + this.appName + "/users/" + this.email, null, {
                  headers: {
                      Accept: "*/*"
                  }
              }).then((res) => {
                  this.$parent.close();

                  this.$buefy.toast.open({
                    duration: 5000,
                    message: 'New admin with e-mail ' + this.email + ' added.',
                    position: 'is-bottom',
                    type: 'is-success'
                  });

                  this.$parent.$parent.fetchUsers(this.appName);

              }, () => {
                  this.$parent.close();

                  this.$buefy.toast.open({
                    duration: 3000,
                    message: 'Adding admin with email ' + this.email + ' failed. Please try again in a few minutes.',
                    type: 'is-danger',
                    position: 'is-bottom'
                  });
              });
            }
        }
    };
</script>