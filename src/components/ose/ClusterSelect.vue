<style>
    .root {
        margin-bottom: .75rem;
    }
</style>
<template>
<div class="root">
    <b-field label="Cluster">
        <b-select v-model="selectedCluster" :loading="loading" required>
            <template v-if="showPrivateClusters">
                <optgroup v-if="showPrivateClusters" :label="optgroup?optgroup:'SBB (for everyone)'" v-for="(clustergroup, optgroup) in groupedClusters">
                    <option v-for="c in clustergroup" :value="c"
                            :key="c.id">
                        {{ c.name }} ({{ c.id }})
                    </option>
                </optgroup>
            </template>
            <template v-else>
                <option v-for="c in groupedClusters['']" :value="c" :key="c.id">
                    {{ c.name }} ({{ c.id }})
                </option>
            </template>
        </b-select>
    </b-field>
    <b-checkbox v-model="showPrivateClusters">
        Advanced: show private clusters
    </b-checkbox>
    <b-message v-if="recommend && !selectedCluster.optgroup && haveRecommendations" type="is-info" >
        Based on available resource capacity, we recommend the following clusters:<br>
            <template v-if="c.recommended && c.production" v-for="c in groupedClusters['']">
                Prod: <a v-on:click="setSelect(c)">{{ c.name }}</a><br>
            </template>
            <template v-if="c.recommended && !c.production" v-for="c in groupedClusters['']">
                Non-Prod: <a v-on:click="setSelect(c)">{{ c.name }}</a><br>
            </template>
    </b-message>

    <b-message v-if="selectedCluster.optgroup" type="is-warning">
        This is a private cluster. Only select this cluster if you have permission to use it!
    </b-message>
</div>
</template>

<script>
  export default {
    name: 'cluster-select',
    props: {
        cluster: Object,
        feature: String,
        recommend: Boolean,
    },
    data() {
      return {
        clusters: [],
        selectedCluster: {},
        loading: false,
        showPrivateClusters: false,
      };
    },
    watch: {
      selectedCluster(c) {
        if (!c) return
        localStorage.clusterid = c.id;
        this.$emit('input', c);
      },
      showPrivateClusters(b) {
        // if the checkbox is deactivated and a private cluster is selected,
        // then reset the select box
        if (!b && this.selectedCluster.optgroup) {
            this.selectedCluster = this.groupedClusters[''][0]
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
      },
      haveRecommendations: function() {
          for (let c of this.clusters) {
             if (c.recommended) return true
          }
          return false
      }
    },
    mounted: function () {
        // load the checkbox from localStorage
        this.setShowPrivateClusters();
        this.getClusters();
    },
    methods: {
      getClusters: function() {
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/ose/clusters', { params: {
            feature: this.feature,
            recommend: this.recommend,
        }}).then((res) => {
          this.clusters = res.body;
          this.setSelect();
          this.loading = false;
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
      setSelect: function(c) {
        if (c) {
            this.selectedCluster = c
        } else if (localStorage.clusterid) {
          // search for cluster with this id
          for (let c of this.clusters) {
             if (c.id == localStorage.clusterid) {
                this.selectedCluster = c
                break
             }
          }
        } else {
          // Select first cluster that is not in a "group"
          this.selectedCluster = this.groupedClusters[''][0]
        }
      }
    }
  };
</script>
