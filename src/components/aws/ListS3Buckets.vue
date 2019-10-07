<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">list</i>List AWS S3 buckets</h1>
                </div>
                <h2 class="subtitle">
                    All your AWS S3 buckets will be displayed here</h2>
            </div>
        </div>
        <br>
        <b-table :data="data"
                 v-bind:class="{'is-loading': loading}"
                 :narrowed="true">

            <template slot-scope="props">
                <b-table-column field="name" label="Bucket-Name">
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="account" label="SBB AWS Account">
                    {{ props.row.account }}
                </b-table-column>
            </template>

            <div slot="empty" class="has-text-centered">
                You don't seem to have any buckets
            </div>

        </b-table>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [],
        loading: false
      };
    },
    mounted: function() {
        this.listS3Buckets();
    },
    methods: {
      listS3Buckets: function() {
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/aws/s3').then((res) => {
          this.data = res.body.buckets;
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      }
    }
  };
</script>
