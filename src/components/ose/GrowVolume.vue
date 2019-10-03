<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">cloud_upload</i>expand persistent volume</h1>
                </div>
                <h2 class="subtitle">
                    You can expand the persistent volume here</h2>
            </div>
        </div>
        <br>
        <b-message type="is-danger">
            After expanding openshift will still show the size before the change. This is unfortunately unchangable for the moment.
        </b-message>

        <form v-on:submit.prevent="growVolume">
            <cluster-select v-model="clusterid"></cluster-select>
            <b-field label="Persistent volume name"
                     :type="errors.has('PV-Name') ? 'is-danger' : ''"
                     :message="errors.first('PV-Name')">
                <b-input v-model.trim="pvName"
                         name="PV-Name"
                         v-validate="'required'">
                </b-input>
            </b-field>
            <b-message type="is-info">
                Not the name of PVC, instead which is written in Openshift under "Storage" > cloumn "Status" > <strong>fat</strong>
            </b-message>

            <b-field label="New size"
                     :type="errors.has('Grösse') ? 'is-danger' : ''"
                     :message="errors.first('Grösse')">
                <b-input v-model.trim="newSize"
                         placeholder="100M"
                         name="Grösse"
                         v-validate="{ rules: { required: true, regex: /^[0-9]+[GM]$/}}">
                </b-input>
            </b-field>
            <b-message type="is-info">
                The volume is getting resized to the provided size. Downsizing is not possible.e.g 100M or 5G
            </b-message>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Expand persistent volume
            </button>
        </form>
    </div>
</template>

<script>
  import ClusterSelect from './ClusterSelect.vue'
  export default {
    components: {
      'cluster-select': ClusterSelect
    },
    data() {
      return {
        clusterid: '',
        project: '',
        pvName: '',
        newSize: '',
        loading: false
      };
    },
    methods: {
      growVolume: function() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;

            this.$http.post(this.$store.state.backendURL + '/api/ose/volume/grow', {
              clusterid: this.clusterid,
              project: this.project,
              newSize: this.newSize,
              pvName: this.pvName
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
</scriptersistent volume>
