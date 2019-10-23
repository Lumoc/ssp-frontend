<style>
    .root {
        margin-bottom: .75rem;
    }
</style>
<template>
<div class="root">
    <b-field label="Cluster">
        <b-select v-model="cluster" required>
            <optgroup :label="v?v:'SBB (for everyone)'" v-for="(clustergroup, v) in groupedClusters">
                <option v-for="cluster in clustergroup"
                        :value="cluster"
                        :key="cluster.id">
                    {{ cluster.name }}
                </option>
            </optgroup>
        </b-select>
    </b-field>
    <b-message v-if="cluster.optgroup"  type="is-warning">
        This is a private cluster. Only select this cluster if you have permission to use it!
    </b-message>
</div>
</template>

<script>
  export default {
    name: 'cluster-select',
    props: ["clusterid","feature"],
    data() {
      return {
        clusters: [],
        cluster: {},
        loading: false
      };
    },
    watch: {
      cluster(c) {
        localStorage.clusterid = c.id;
        this.$emit('input', c.id);
      }
    },
    computed: {
      groupedClusters: function() {
        let grouped = this.clusters.reduce(function (r, a) {
          r[a.optgroup] = r[a.optgroup] || [];
          r[a.optgroup].push(a);
          return r;
        }, {});
        return Object.keys(grouped).sort().reduce((r, k) => (r[k] = grouped[k], r), {});
      }
    },
    mounted: function () {
        this.getClusters();
    },
    methods: {
      getClusters: function() {
        var sArg = "";
        if( typeof this._props.feature !== 'undefined' ) {
          sArg = "?feature="+this._props.feature;
        }
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/ose/clusters' + sArg, null).then((res) => {
          this.clusters = res.body;
          this.loading = false;
          this.setSelect();
        }, () => {
          this.loading = false;
        });
      },
      setSelect: function() {
        if (localStorage.clusterid) {
          for (let c of this.clusters) {
             if (c.id == localStorage.clusterid) {
                this.cluster = c
                break
             }
          }
        } else if (this.clusters.length > 0) {
          // Select first cluster that is not in a "group"
          this.cluster = this.groupedClusters[''][0]
        }
      }
    }
  };
</script>
