<template>
    <form v-on:submit.prevent="newS3Bucket">
        <b-field label="Projekt-Name"
                 :type="errors.has('Projekt-Name') ? 'is-danger' : ''"
                 :message="errors.first('Projekt-Name')">
            <b-input v-model.trim="project"
                     name="Projekt-Name"
                     ref="autofocus"
                     v-validate="'required'">
            </b-input>
        </b-field>

        <b-field label="Bucket-Name"
                 :type="errors.has('Bucket-Name') ? 'is-danger' : ''"
                 :message="errors.first('Bucket-Name')">
            <b-input type="text"
                     v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9\-]+$/} }"
                     name="Bucket-Name"
                     v-model.number="bucketname">
            </b-input>
        </b-field>
        <b-message type="is-info">
            Der Name des S3-Buckets wird mit deinen Angaben wie folgt zusammengestellt:
            <br/>sbb-[BucketName]-prod/nonprod
            <br/><br/>Beispiel: sbb-my-bucket-prod oder sbb-my-app-prod
        </b-message>

        <b-field label="Kontierungsnummer"
                 :type="errors.has('Kontierungsnummer') ? 'is-danger' : ''"
                 :message="errors.first('Kontierungsnummer')">
            <b-input type="text"
                     v-model.number="billing"
                     v-validate="{ rules: { required: true, max: 128, regex: /^[a-zA-Z0-9+\-=._:/]+$/} }"
                     name="Kontierungsnummer">
            </b-input>
        </b-field>

        <label class="label">SBB AWS Account</label>
        <b-field>
            <b-radio-button v-model="stage"
                            native-value="dev"
                            type="is-success">
                <span>Entwicklung</span>
            </b-radio-button>
            <b-radio-button v-model="stage"
                            native-value="test"
                            type="is-success">
                <span>Test</span>
            </b-radio-button>
            <b-radio-button v-model="stage"
                            native-value="int"
                            type="is-success">
                <span>Integration</span>
            </b-radio-button>
            <b-radio-button v-model="stage"
                            native-value="prod"
                            type="is-info">
                <span>Produktion</span>
            </b-radio-button>
        </b-field>

        <button :disabled="errors.any()"
                v-bind:class="{'is-loading': loading}"
                class="button is-primary">S3 Bucket erstellen
        </button>
    </form>
</template>

<script>
  export default {
    name: 'new-s3-bucket',
    props: ['url'],
    data() {
      return {
        project: '',
        bucketname: '',
        billing: '',
        stage: 'dev',
        loading: false
      };
    },
    methods: {
      newS3Bucket: function() {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.loading = true;

            this.$http.post(this.$store.state.backendURL + this.url, {
              project: this.project,
              bucketname: this.bucketname,
              billing: '' + this.billing,
              stage: '' + this.stage
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
