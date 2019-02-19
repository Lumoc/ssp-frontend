<template>
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
            Hier werden deine Buckets angezeigt wenn du welche hast
        </div>

    </b-table>
</template>

<script>
  export default {
    name: 'list-s3-buckets',
    props: ['url'],
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
        this.$http.get(this.$store.state.backendURL + this.url).then((res) => {
          this.data = res.body.buckets;
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      }
    }
  };
</script>
