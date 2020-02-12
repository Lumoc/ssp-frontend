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
                        <router-link to="/ose/editquotas" class="navbar-item">Adjust Project Quotas</router-link>
                        <router-link to="/ose/newproject" class="navbar-item">Create Project</router-link>
                        <router-link to="/ose/newtestproject" class="navbar-item">Create Trial Project</router-link>
                        <router-link to="/ose/adminlist" class="navbar-item">Show Project Admins</router-link>
                        <router-link to="/ose/project" class="navbar-item">Display/Update Project Details</router-link>
                        <router-link to="/ose/newserviceaccount" class="navbar-item">Create Service Account</router-link>
                        <router-link to="/ose/newpullsecret" class="navbar-item">Create Docker Pull-Secret</router-link>
                        <hr class="navbar-divider">
                        <router-link to="/ose/volume/new" class="navbar-item">
                            Create Persistent Volume
                        </router-link>
                        <router-link to="/ose/volume/grow" class="navbar-item">
                            Expand Persistent Volume
                        </router-link>
                        <router-link to="/ose/volume/fixgluster" class="navbar-item">
                            Recreate GlusterFS Configuration
                        </router-link>
                    </div>
                </div>
               <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        AWS
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/aws/lists3buckets" class="navbar-item">List AWS S3 Buckets</router-link>
                        <router-link to="/aws/news3bucket" class="navbar-item">Create AWS S3 Bucket</router-link>
                        <router-link to="/aws/news3user" class="navbar-item">Create AWS S3 Bucket User
                        </router-link>
                        <router-link to="/aws/listec2instances" class="navbar-item">List AWS EC2 Instances
                        </router-link>
                    </div>
                </div>
                <div v-if="user && features.otc.enabled" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        UOS
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/otc/listecs" class="navbar-item">Your UnifiedOS Servers</router-link>
                        <router-link to="/otc/newecs" class="navbar-item">Create a UnifiedOS Server</router-link>
                    </div>
                </div>
                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        Sematext
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/sematext/applist" class="navbar-item">Show Logsene Apps</router-link>
                        <router-link to="/sematext/newapp" class="navbar-item">Create Logsene App</router-link>
                        <router-link to="/sematext/changeplan" class="navbar-item">Change Logsene App Daily Volume & Limit
                        </router-link>
                        <router-link to="/sematext/changebilling" class="navbar-item">Change Logsene App Project &
                            Accounting Number
                        </router-link>
                    </div>
                </div>


                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        WZU Services
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/wzu/artifactory" class="navbar-item">Artifactory Repository</router-link>
                        <router-link to="/wzu/bitbucket" class="navbar-item">Bitbucket Project</router-link>
                        <router-link to="/wzu/bitbucketrepo" class="navbar-item">Bitbucket Repository</router-link>
                        <router-link to="/wzu/confluence" class="navbar-item">Confluence Space</router-link>
                        <router-link to="/wzu/devproxy" class="navbar-item">Create DevProxy-Token</router-link>
                        <router-link to="/wzu/jenkinscredentials" class="navbar-item">Create Jenkins Credentials</router-link>
                        <router-link to="/wzu/jira" class="navbar-item">JIRA Project</router-link>
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
                        <router-link to="/wzu/tasksuser" class="navbar-item">Tasks User permissions</router-link>
                    </div>
                </div>

                <div v-if="user && features.kafka.enabled" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        Kafka
                    </a>
                    <div class="navbar-dropdown">
                        <router-link v-if="userIsKafkaServiceOwner()" to="/kafka/adminconsole" class="navbar-item">Admin Console</router-link>
                        <router-link to="/kafka/listtopics" class="navbar-item">Topic List</router-link>
                    </div>
                </div>
            </div>

            <div v-if="user" class="navbar-end">
                <router-link v-if="features.otc.enabled" to="/tower/jobs" class="navbar-item">Jobs</router-link>
                <a class="navbar-item">
                    <b-icon icon="face"></b-icon>
                    &nbsp; Hello {{ user.firstName }}!
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
                    otc: {
                        enabled: false
                    },
                    kafka: {
                        enabled: false
                    }
                }
            }
        },
        created: function () {
            this.$http.get(this.$store.state.backendURL + '/features').then(res => this.features = res.body)
        },
        methods: {
            userIsKafkaServiceOwner: function() {
                if (!this.$store.state.user.tokenParsed.resource_access.hasOwnProperty("apim-kafka_automation_api-prod-aws")) {
                    return false;
                }
                return this.$store.state.user.tokenParsed.resource_access["apim-kafka_automation_api-prod-aws"].roles.includes("service-owner");
            }
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
