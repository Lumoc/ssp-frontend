<template>
<b-field label="OpenShift Projekt"
                     :type="errors.has('Projekt-Name') ? 'is-danger' : ''"
                     :message="errors.first('Projekt-Name')">
    <b-autocomplete
        v-model="projectData"
        :data="filteredDataArray"
        :loading="loading"
        @select="option => projectData = option"
        name="Projekt-Name"
        ref="autofocus"
        placeholder="project-name"
        v-validate="{ rules: { required: true, regex: /^[a-z0-9]([-a-z0-9]*[a-z0-9])$/} }">
        <template slot="empty">Keine Projekte gefunden</template>
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
        localStorage.openshiftproject = val;
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
      getProjects: function() {
        if (!this.clusterid) return
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/ose/projects', {
            params: {
              clusterid: this.clusterid
            }
        }).then((res) => {
          console.log(res.body)
          this.projects = res.body;
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      },
      setProject: function() {
        if (localStorage.openshiftproject) {
          this.project = localStorage.openshiftproject;
        }
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
