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
        localStorage.clusterid = val;
        this.$emit('input', val);
      }
    },
    mounted: function () {
        this.getClusters();
    },
    methods: {
      getClusters: function() {
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/ose/clusters', null).then((res) => {
          this.clusters = res.body;
          this.loading = false;
          this.setSelect();
        }, () => {
          this.loading = false;
        });
      },
      setSelect: function() {
        if (localStorage.clusterid) {
          this.clusteridData = localStorage.clusterid;
        } else if (this.clusters.length > 0) {
          this.clusteridData = this.clusters[0].id
        }
      }
    }
  };
</script>
