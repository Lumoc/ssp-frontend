<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">list</i>show  AWS EC2 instances</h1>
                </div>
                <h2 class="subtitle">
                    All AWS EC2 instances will be displayed here.</h2>
            </div>
        </div>
        <br>
        <b-table :data="data" v-bind:class="{'is-loading': loading}" detailed narrowed>
            <template slot-scope="props">
                <b-table-column field="name" label="name">
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column field="account" label="SBB AWS Account">
                    {{ props.row.account }}
                </b-table-column>
                <b-table-column field="snapshots" label="Snapshots">
                    <a v-on:click="listEC2Snapshots(props.row)">
                    {{ (props.row.snapshots) ? props.row.snapshots.length : 0 }}
                    </a>
                </b-table-column>
                <b-table-column field="state" label="State">
                    <b-tooltip :label="getStateLabel(props.row)">
                        <a v-on:click="toggleState(props.row)">
                            <b-icon :icon="getStateIcon(props.row)"
                                    :type="getStateType(props.row)">
                            </b-icon>
                            {{ props.row.state }}
                        </a>
                    </b-tooltip>
                </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
                <div class="columns">
                    <div class="column">
                        <table>
                            <tr><td>
                               ImageId:
                            </td><td>
                               {{ props.row.imageId }}
                            </td></tr>
                            <tr><td>
                                ImageName:
                            </td><td>
                                {{ props.row.imageName }}
                            </td></tr>
                            <tr><td>
                                LaunchTime:
                            </td><td>
                                {{ moment(props.row.launchTime).format('LLL') }}
                            </td></tr>
                            <tr><td>
                                InstanceType:
                            </td><td>
                                {{ props.row.instanceType }}
                            </td></tr>
                            <tr><td>
                                PrivateIpAddress:
                            </td><td>
                                {{ props.row.privateIpAddress }}
                            </td></tr>
                         </table>
                    </div>
                    <div class="column">
                        <table>
                            <tr v-for="tag in props.row.tags">
                                <td>{{ tag.Key }}:</td>
                                <td>{{ tag.Value }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </template>
            <div slot="empty" class="has-text-centered">
                The instances which you own will be displayed here.
            </div>
        </b-table>
        <!-- use the modal component, pass in the prop -->
        <b-modal :active.sync="showModal" @close="closeModal">
            <div class="card">
                <div class="card-header">
                    <h1 class="card-header-title">{{ modalData.name }} ({{ modalData.state }}) </h1>
                </div>
                <div class="card-content">
                    <b-table :data="modalData.snapshots"
                            v-bind:class="{'is-loading': snapshotLoading}"
                            :default-sort="['startTime', 'desc']"
                            narrowed>
                        <template slot-scope="props">
                            <b-table-column field="description" label="Descriptio" sortable>
                                {{ props.row.Description }}
                            </b-table-column>
                            <b-table-column field="startTime" label="Date" sortable>
                                <b-tooltip :label="moment(props.row.StartTime).calendar()">
                                {{ moment(props.row.StartTime).fromNow() }}
                                </b-tooltip>
                            </b-table-column>
                            <b-table-column field="disk" label="Disk" sortable>
                                {{ getTag(props.row, "devicename") }}
                            </b-table-column>
                            <b-table-column field="delete" label="Löschen">
                                <a @click="deleteSnapshot(props.row)">
                                x
                                </a>
                            </b-table-column>
                        </template>
                        <div slot="empty" class="has-text-centered">
                            Keine Snapshots vorhanden
                        </div>
                    </b-table>
                </div>
                <footer class="card-footer">
                    <b-select v-model="snapshotVolume">
                        <option value="*">Alle</option>
                        <option v-for="volume in modalData.volumes" :value="volume.volumeId" :key="volume.deviceName">
                            {{ volume.deviceName }}
                        </option>
                    </b-select>
                    <b-input v-model="snapshotDescription" name="description" placeholder="description"></b-input>
                    <button class="button" @click="createSnapshot(modalData)">Create snapshot</button>
                </footer>
            </div>
        </b-modal>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [],
        showModal: false,
        loading: false,
        snapshotLoading: false,
        snapshotVolume: "",
        snapshotDescription: "",
        modalData: {},
      };
    },
    mounted: function() {
        this.listEC2Instances();
    },
    methods: {
      listEC2Instances: function() {
        this.loading = true;
        this.$http.get(this.$store.state.backendURL + '/api/aws/ec2').then((res) => {
          this.data = res.body.instances;
        console.log(this.data)
          this.loading = false;
        }, () => {
          this.loading = false;
        });
      },
      listEC2Snapshots: function(row) {
        this.modalData = row
        this.showModal = true
      },
      closeModal: function() {
        this.showModal = false
        this.resetSnapshotForm()
      },
      getTag(row, tag) {
          tag = row.Tags.find(o => o.Key == tag);
          if (tag) {
            return tag.Value;
          }
          return "Unknown"
      },
      createSnapshot: function(row) {
        if (this.snapshotDescription == "" || this.snapshotVolume == "") {
            this.$toast.open({
                message: 'Please fill out all the blanks',
                type: 'is-danger',
                duration: 7500
            })
            return
        }
        this.snapshotInputInvalid = false
        this.snapshotLoading = true;
        if (this.snapshotVolume == "*") {
            for (var i = 0; i < this.modalData.volumes.length; i++) {
              this.$http.post(this.$store.state.backendURL + '/api/aws/snapshots', { instanceId: row.instanceId, volumeId: this.modalData.volumes[i].volumeId, description: this.snapshotDescription, account: row.account }).then((res) => {
                this.modalData.snapshots.unshift(res.body.snapshot)
              }, () => {
                this.snapshotLoading = false;
              });
            }
            this.snapshotLoading = false;
            this.resetSnapshotForm()
        } else {
          this.$http.post(this.$store.state.backendURL + '/api/aws/snapshots', { instanceId: row.instanceId, volumeId: this.snapshotVolume, description: this.snapshotDescription, account: row.account }).then((res) => {
            this.modalData.snapshots.unshift(res.body.snapshot)
            this.snapshotLoading = false;
            this.resetSnapshotForm()
          }, () => {
            this.snapshotLoading = false;
          });
        }
        console.log("creating snapshot for instance: "+row.instanceId)
      },
      deleteSnapshot: function(row) {
        if (confirm("Do you really want to remove this snapshot?\n" + row.Description + " ("+row.SnapshotId+")")) {
            this.snapshotLoading = true;
            this.$http.delete(this.$store.state.backendURL + '/api/aws/snapshots/' + this.modalData.account + '/' + row.SnapshotId).then((res) => {
                // remove snapshot from list
                this.modalData.snapshots.splice(this.modalData.snapshots.indexOf(row), 1)
                this.snapshotLoading = false;
            }, () => {
                this.snapshotLoading = false;
            });
            console.log("deleting snapshot: "+row.snapshotId)
        }
      },
      resetSnapshotForm: function() {
        // reset form data
        this.snapshotDescription = ""
        this.snapshotVolume = ""
        this.snapshotInputInvalid = false
      },
      toggleState: function(row) {
        var nextState;

        // check if instance is already changing state
        if (row.state == 'pending' || row.state == 'stopping' || row.state == 'terminated') {
          return
        }

        // use running as conditional! the 'else' case should not be stop
        nextState = (row.state == 'running') ? 'stop' : 'start';

        if (nextState == 'start' || confirm("Do you really want the instance to be stopped\n" + row.name)) {
          // change state so that user interface is responsive
          row.state = (row.state == 'running') ? 'stopping' : 'pending';
          this.$http.post(this.$store.state.backendURL + '/api/aws/ec2/' + row.instanceId + '/' + nextState).then((res) => {
            row.state = res.body.state;
          }, () => {
            row.state = 'unknown';
          });
        }
      },
      getStateIcon: function(row) {
        switch (row.state) {
          case 'stopped':
            return 'circle-outline'
          case 'running':
            return 'circle';
          case 'stopping':
            return 'arrow-down-drop-circle-outline';
          case 'pending':
            return 'arrow-up-drop-circle';
          default:
            return 'alert-circle-outline';
        }
      },
      getStateType: function(row) {
        switch (row.state) {
          case 'stopped':
          case 'stopping':
            return 'is-danger';
          case 'running':
          case 'pending':
            return 'is-success';
          default:
            return 'is-danger';
        }
      },
      getStateLabel: function(row) {
        if (row.state == 'running') {
          return 'stop';
        } else if (row.state == 'stopped') {
          return 'start';
        } else {
          // disable tooltip if state is changing
          return '';
        }
      }
    }
  }
</script>
