<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i>Create AWS S3 bucket</h1>
                </div>
                <h2 class="subtitle">
                    Here you can create an AWS S3 bucket. All orders will be logged and charged.</h2>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newS3Bucket">
            <b-field label="Project name"
                     :type="errors.has('Projekt-Name') ? 'is-danger' : ''"
                     :message="errors.first('Projekt-Name')">
                <b-input v-model.trim="project"
                         name="Projekt-Name"
                         ref="autofocus"
                         v-validate="'required'">
                </b-input>
            </b-field>

            <b-field label="Bucket name"
                     :type="errors.has('Bucket-Name') ? 'is-danger' : ''"
                     :message="errors.first('Bucket-Name')">
                <b-input type="text"
                         v-validate="{ rules: { required: true, regex: /^[a-zA-Z0-9\-]+$/} }"
                         name="Bucket-Name"
                         v-model.number="bucketname">
                </b-input>
            </b-field>
            <b-message type="is-info">
                The bucket name will be constructed as follows:
                <br/>sbb-[BucketName]-prod/nonprod
                <br/><br/>Beispiel: sbb-my-bucket-prod oder sbb-my-app-prod
            </b-message>

            <b-field label="Accounting number"
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
                    <span>Development</span>
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
                    <span>Production</span>
                </b-radio-button>
            </b-field>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Create S3 Bucket
            </button>
        </form>
    </div>
</template>

<script>
  export default {
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

            this.$http.post(this.$store.state.backendURL + '/api/aws/s3', {
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
