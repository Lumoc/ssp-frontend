<template>
<b-field label="Cluster">
    <b-select v-model="clusteridData" required>
        <option v-for="cluster in clusters"
                :value="cluster.id"
                :key="cluster.name">
            {{ cluster.name }}
        </option>
    </b-select>
</b-field>
</template>

<script>
  export default {
    name: 'cluster-select',
    props: ["clusterid"],
    data() {
      return {
        clusteridData: this.clusterid,
        clusters: [],
        loading: false
      };
    },
    watch: {
      clusteridData(val) {
        this.$emit('input', val)
      }
    },
    mounted: function () {
        this.getClusters();
    },
    methods: {
      getClusters: function() {
        console.log("getClusters")
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/ose/clusters', null).then((res) => {
            console.log(res.body)
          this.clusters = res.body;
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      },
    }
  };
</script>
