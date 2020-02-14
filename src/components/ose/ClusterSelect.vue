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
    <b-message type="is-info" v-if="stage && recommended && (selectedCluster.id != recommended.id) && !selectedCluster.optgroup">
        Recommended cluster: <a v-on:click="setSelect(recommended)">{{ recommended.name }}</a> (based on available resource capacity)
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
        stage: String,
        stages: Array,
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
      stage(s) {
        this.getClusters();
      },
      selectedCluster(c) {
        if (!c) return
        this.$emit('input', c);
      },
      showPrivateClusters(b) {
        // if the checkbox is deactivated and a private cluster is selected,
        // then reset the select box
        if (!b && this.selectedCluster.optgroup) this.setSelect()
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
      recommended: function() {
          for (let c of this.clusters) {
             if (c.recommended) return c
          }
          return null
      }
    },
    mounted: function () {
        this.getClusters();
    },
    methods: {
      getClusters: function() {
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/ose/clusters', { params: {
            stage: this.stage,
        }}).then((res) => {
          this.clusters = res.body;
          this.setSelect();
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      },
      setSelect: function(c) {
        if (c) {
            this.selectedCluster = c
            return
        }

        // if selectedCluster is already set it means the stage changed
        if (this.selectedCluster.id) {
          for (let c of this.clusters) {
             if (c.id == this.selectedCluster.id) {
                // set the new cluster, because variables could have changed (recommended etc)
                console.log("Updated cluster because stage changed")
                this.selectedCluster = c
                return
             }
          }
        }

        // Set the recommended cluster
        for (let c of this.clusters) {
            if (c.recommended) {
                console.log("Set first recommended cluster")
                this.selectedCluster = c
                return
            }
        }

        // Fallback if the cluster still isn't set
        console.log("Set first cluster")
        this.selectedCluster = this.groupedClusters[''][0]
      }
    }
  };
</script>
