<style>
    .root {
        margin-bottom: .75rem;
    }
</style>
<template>
<div class="root">
    <b-field label="Cluster">
        <b-select v-model="cluster" required>
            <optgroup v-if="showPrivateClusters" :label="v?v:'SBB (for everyone)'" v-for="(clustergroup, v) in groupedClusters">
                <option v-for="cluster in clustergroup"
                        :value="cluster"
                        :key="cluster.id">
                    {{ cluster.name }}
                </option>
            </optgroup>
            <option v-if="!showPrivateClusters" v-for="cluster in groupedClusters['']"
                    :value="cluster"
                    :key="cluster.id">
                {{ cluster.name }}
            </option>
        </b-select>
    </b-field>
    <b-checkbox v-model="showPrivateClusters">
        Advanced: show private clusters
    </b-checkbox>
    <b-message v-if="cluster.optgroup" type="is-warning">
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
        loading: false,
        showPrivateClusters: false,
      };
    },
    watch: {
      cluster(c) {
        if (!c) return
        localStorage.clusterid = c.id;
        this.$emit('input', c.id);
      },
      showPrivateClusters(b) {
        // if the checkbox is deactivated and a private cluster is selected,
        // then reset the select box
        if (!b && this.cluster.optgroup) {
            this.cluster = this.groupedClusters[''][0]
        }
        // save the value in localstorage
        localStorage.showprivateclusters = b
      }
    },
    computed: {
      groupedClusters: function() {
        // group by optgroup and return a new object
        let grouped = this.clusters.reduce(function (r, a) {
          r[a.optgroup] = r[a.optgroup] || [];
          r[a.optgroup].push(a);
          return r;
        }, {});
        // sort by group (if no group is set then the empty string is sorted to the beginning)
        return Object.keys(grouped).sort().reduce((r, k) => (r[k] = grouped[k], r), {});
      }
    },
    mounted: function () {
        // load the checkbox from localStorage
        this.setShowPrivateClusters();
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
      setShowPrivateClusters: function() {
        if (localStorage.showprivateclusters) {
            // set the value from localStorage
            // convert from string to boolean
            this.showPrivateClusters = (localStorage.showprivateclusters == 'true')
        }
      },
      setSelect: function() {
        if (localStorage.clusterid) {
          // search for cluster with this id
          for (let c of this.clusters) {
             if (c.id == localStorage.clusterid) {
                // if an optgroup is set (private cluster) and showPrivateClusters is false,
                // then reset the select
                if (c.optgroup && !this.showPrivateClusters) {
                    this.cluster = this.groupedClusters[''][0]
                } else {
                    this.cluster = c
                }
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
