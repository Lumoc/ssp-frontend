<template>
    <nav class="navbar ">
        <div class="navbar-brand">
            <router-link to="/" class="navbar-item">
                <b-icon icon="opacity"></b-icon>&nbsp;
                Cloud SSP
            </router-link>
            <div class="navbar-burger burger" data-target="navMain">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <div id="navMain" class="navbar-menu">
            <div class="navbar-start">
                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        OpenShift
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/ose/editquotas" class="navbar-item">Adjust quotas</router-link>
                        <router-link to="/ose/newproject" class="navbar-item">Create project</router-link>
                        <router-link to="/ose/newtestproject" class="navbar-item">Create trial project</router-link>
                        <router-link to="/ose/adminlist" class="navbar-item">Show project admins</router-link>
                        <router-link to="/ose/project" class="navbar-item">Show/adjust project informations</router-link>
                        <router-link to="/ose/newserviceaccount" class="navbar-item">Create service account</router-link>
                        <router-link to="/ose/newpullsecret" class="navbar-item">Create docker pull secret</router-link>
                        <hr class="navbar-divider">
                        <router-link to="/ose/volume/new" class="navbar-item">
                            Create persistent volume
                        </router-link>
                        <router-link to="/ose/volume/grow" class="navbar-item">
                            Expand persistent volume
                        </router-link>
                        <router-link to="/ose/volume/fixgluster" class="navbar-item">
                            Generate new GlusterFS Objects
                        </router-link>
                    </div>
                </div>
                <div v-if="user && features.ddc.enabled" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        DDC
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/ddc/billing" class="navbar-item">DDC Cost calculation</router-link>
                    </div>
                </div>
                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        AWS
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/aws/lists3buckets" class="navbar-item">Show AWS S3 Buckets</router-link>
                        <router-link to="/aws/news3bucket" class="navbar-item">Create AWS S3 Bucket</router-link>
                        <router-link to="/aws/news3user" class="navbar-item">Create AWS S3 Bucket User
                        </router-link>
                        <router-link to="/aws/listec2instances" class="navbar-item">Show AWS EC2 Instances
                        </router-link>
                    </div>
                </div>
                <div v-if="user && features.otc.enabled" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        OTC
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/otc/listecs" class="navbar-item">Show Elastic Cloud Server</router-link>
                        <router-link to="/otc/newecs" class="navbar-item">Create Elastic Cloud Server</router-link>
                    </div>
                </div>
                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        Sematext
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/sematext/applist" class="navbar-item">Show Logsene-Apps</router-link>
                        <router-link to="/sematext/newapp" class="navbar-item">Create Logsene-Apps</router-link>
                        <router-link to="/sematext/changeplan" class="navbar-item">Change Logsene-Apps plan & limit
                        </router-link>
                        <router-link to="/sematext/changebilling" class="navbar-item">Update Logsene App project &
                            accounting number
                            
                        </router-link>
                    </div>
                </div>

                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        WZU Services
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/wzu/artifactory" class="navbar-item">Artifactory</router-link>
                        <router-link to="/wzu/bitbucket" class="navbar-item">Bitbucket Project</router-link>
                        <router-link to="/wzu/bitbucketrepo" class="navbar-item">Bitbucket Repository</router-link>
                        <router-link to="/wzu/confluence" class="navbar-item">Confluence</router-link>
                        <router-link to="/wzu/devproxy" class="navbar-item">Create DevProxy-Token</router-link>
                        <router-link to="/wzu/jenkinscredentials" class="navbar-item">Jenkins Credentials</router-link>
                        <router-link to="/wzu/jira" class="navbar-item">JIRA</router-link>
                    </div>
                </div>

                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        WZU-Groupmanagement
                    </a>
                    <div class="navbar-dropdown">
                        <!--<router-link to="/ActiveDirectory/ADGroup" class="navbar-item">Create AD group</router-link>
                        <router-link to="/ActiveDirectory/Adminaddordelete" class="navbar-item">AD group admin</router-link>
                        <router-link to="/ActiveDirectory/UpdateUserGroup" class="navbar-item">AD group User</router-link>-->
                        <router-link to="/wzu/alm" class="navbar-item">ALM User permissions</router-link>
                        <router-link to="/wzu/tasksuser" class="navbar-item">Tasks User permissions</router-link>
                    </div>
                </div>
            </div>

            <div class="navbar-end">
                <a v-if="user" class="navbar-item">
                    <b-icon icon="face"></b-icon>
                    &nbsp; Hello {{ user.firstname }}!
                </a>
            </div>
        </div>
    </nav>
</template>

<style>
    #navMain {
        background-color: #222;
    }
</style>

<script>
    export default {
        computed: {
            user() {
                return this.$store.state.user;
            }
        },
        data: function () {
            return {
                features: {
                    ddc: {
                        enabled: false
                    },
                    otc: {
                        enabled: false
                    }
                }
            }
        },
        created: function () {
            this.$http.get(this.$store.state.backendURL + '/features').then(res => this.features = res.body)
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Get all "navbar-burger" elements
        var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
        // Check if there are any nav burgers
        if ($navbarBurgers.length > 0) {
            // Add a click event on each of them
            $navbarBurgers.forEach(function ($el) {
                $el.addEventListener('click', function () {
                    // Get the target from the "data-target" attribute
                    var target = $el.dataset.target;
                    var $target = document.getElementById(target);
                    // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                    $el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');
                });
            });
        }
    });
</script>
