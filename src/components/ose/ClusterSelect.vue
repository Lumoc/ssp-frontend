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
      clusters(c) {
        this.setSelect();
        this.getRecommendedCluster();
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
      },
      getRecommendedCluster: function() {
        console.log(this.clusters)
        let promises = [];
        for (let cluster of this.clusters) {
            promises.push(this.getClusterCapacity(cluster.id))
        }
        Promise.all(promises).then(function(allData) {
            console.log(allData)
        }).catch(function(err) {
            console.log(err)
        })
      },
      getClusterCapacity: function(clusterid) {
        return new Promise((resolve, reject) => {
            this.loading = true;
            let capacity = 0;
            this.$http.get(this.$store.state.backendURL + '/api/ose/prometheus/query', {
                    params: {
                        query: 'sum(kube_pod_container_resource_requests_cpu_cores) / sum(node:node_num_cpu:sum)',
                        clusterid: clusterid,
                    }
            }).then((res) => {
                try {
                    let json = JSON.parse(res.body)
                    capacity = json.data.result[0].value[1]
                } catch(e) {}
                this.loading = false;
                resolve({ clusterid: clusterid, capacity: capacity})
            }, () => {
                this.loading = false;
                console.log("An error has occured while calling /api/ose/prometheus/query for cluster: "+clusterid)
                resolve(0)
            });
        });

      },
    }
  };
</script>
