<template>
<b-field>
    <template slot="label">
        Active Directory group name
        <b-tooltip type="is-dark" multilined animated position="is-right" label="The Active directory group name is used for instance ownership (e.g. login, admin permissions).">
            <b-icon size="is-small" icon="help-circle-outline"></b-icon>
        </b-tooltip>
    </template>
    <b-autocomplete
        v-model="selectedGroup"
        :data="filteredDataArray"
        :loading="loading"
        open-on-focus
        @input="inputChanged"
        required>
        <template slot="empty">No groups found</template>
    </b-autocomplete>
</b-field>
</template>

<script>
  export default {
    name: 'ldap-groups',
    data() {
      return {
        selectedGroup: '',
        groups: [],
        loading: false
      };
    },
    watch: {
      selectedGroup(val) {
        this.$emit('update:group', val);
      },
    },
    mounted: function () {
        this.getGroups();
    },
    methods: {
      inputChanged: function(val) {
        if (this.groups.indexOf(val) > -1) {
            localStorage.ldapgroup = val;
            this.$emit('selected', val)
        }
      },
      getGroups: function() {
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/ldap/groups', null).then((res) => {
          this.groups = res.body;
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      },
      setGroup: function() {
        if (localStorage.ldapgroup) {
          this.selectedGroup = localStorage.ldapgroup;
        }
      },
    },
    computed: {
      filteredDataArray() {
        if (!this.groups) return
        return this.groups.filter((option) => {
          return option
            .toString()
            .toLowerCase()
            .indexOf(this.selectedGroup.toLowerCase()) >= 0
        })
      }
    }
  };
</script>
