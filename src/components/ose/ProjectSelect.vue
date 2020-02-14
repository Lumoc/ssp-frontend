<template>
<b-field label="OpenShift Project">
    <b-autocomplete
        v-model="projectData"
        :data="filteredDataArray"
        :loading="loading"
        @input="inputChanged"
        name="Projekt-Name"
        ref="autofocus"
        placeholder="project-name"
        required
        data-patternMismatch="The project name may only include lower case letters, numbers and dashes"
        pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])$">
        <template slot="empty">No projects found </template>
    </b-autocomplete>
</b-field>
</template>

<script>
  export default {
    name: 'project-select',
    props: ["project", "clusterid"],
    data() {
      return {
        projectData: this.project,
        clusteridData: this.clusterid,
        projects: [],
        loading: false
      };
    },
    watch: {
      projectData(val) {
        this.$emit('update:project', val);
      },
      clusterid(val) {
        this.getProjects();
      }
    },
    mounted: function () {
        this.getProjects();
    },
    methods: {
      inputChanged: function(val) {
        if (this.projects.indexOf(val) > -1) {
            this.$emit('selected', val)
        }
      },
      getProjects: function() {
        if (!this.clusterid) return
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/ose/projects', {
            params: {
              clusterid: this.clusterid
            }
        }).then((res) => {
          this.projects = res.body;
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      },
    },
    computed: {
      filteredDataArray() {
        if (!this.projects) return
        return this.projects.filter((option) => {
          return option
            .toString()
            .toLowerCase()
            .indexOf(this.projectData.toLowerCase()) >= 0
        })
      }
    }
  };
</script>
