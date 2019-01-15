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
                        <router-link to="/ose/editquotas" class="navbar-item"> Quotas anpassen</router-link>
                        <router-link to="/ose/newproject" class="navbar-item">Projekt anlegen</router-link>
                        <router-link to="/ose/newtestproject" class="navbar-item">Test-Projekt anlegen</router-link>
                        <router-link to="/ose/adminlist" class="navbar-item">Projekt Admins anzeigen</router-link>
                        <router-link to="/ose/updatebilling" class="navbar-item">Kontierungsnummer anzeigen/ändern</router-link>
                        <router-link to="/ose/billing" class="navbar-item">Kostenverrechnung</router-link>
                        <router-link to="/ose/newserviceaccount" class="navbar-item">Service-Account anlegen</router-link>
                        <router-link to="/ose/newpullsecret" class="navbar-item">Docker Pull-Secret anlegen</router-link>
                        <hr class="navbar-divider">
                        <router-link to="/ose/volume/new" class="navbar-item">
                            Persistent Volume anlegen
                        </router-link>
                        <router-link to="/ose/volume/grow" class="navbar-item">
                            Persistent Volume vergrössern
                        </router-link>
                        <router-link to="/ose/volume/fixgluster" class="navbar-item">
                            Gluster Objekte neu anlegen lassen
                        </router-link>
                    </div>
                </div>
                <div v-if="user && features.ddc.enabled" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        DDC
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/ddc/billing" class="navbar-item">DDC Kostenverrechnung</router-link>
                    </div>
                </div>
                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        AWS
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/aws/lists3buckets" class="navbar-item">AWS S3 Buckets anzeigen</router-link>
                        <router-link to="/aws/news3bucket" class="navbar-item">AWS S3 Bucket erstellen</router-link>
                        <router-link to="/aws/news3user" class="navbar-item">AWS S3 Bucket Benutzer erstellen
                        </router-link>
                        <router-link to="/aws/listec2instances" class="navbar-item">AWS EC2 Instanzen anzeigen
                        </router-link>
                    </div>
                </div>
                <div v-if="user && features.ddc.enabled" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        OTC
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/otc/listecs" class="navbar-item">Elastic Cloud Server anzeigen</router-link>
                        <router-link to="/otc/newecs" class="navbar-item">Elastic Cloud Server erstellen</router-link>
                    </div>
                </div>
                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        Sematext
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/sematext/applist" class="navbar-item">Logsene-Apps anzeigen</router-link>
                        <router-link to="/sematext/newapp" class="navbar-item">Logsene-Apps erstellen</router-link>
                        <router-link to="/sematext/changeplan" class="navbar-item">Logsene-Apps Plan & Limite ändern
                        </router-link>
                        <router-link to="/sematext/changebilling" class="navbar-item">Logsene-Apps Projekt &
                            Kontierungsnummer
                            ändern
                        </router-link>
                    </div>
                </div>

                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        WZU-Dienste
                    </a>
                    <div class="navbar-dropdown">
                        <router-link to="/wzu/artifactory" class="navbar-item">Artifactory</router-link>
                        <router-link to="/wzu/bitbucket" class="navbar-item">Bitbucket Projekt</router-link>
                        <router-link to="/wzu/bitbucketrepo" class="navbar-item">Bitbucket Repository</router-link>
                        <router-link to="/wzu/confluence" class="navbar-item">Confluence</router-link>
                        <router-link to="/wzu/devproxy" class="navbar-item">DevProxy-Token erstellen</router-link>
                        <router-link to="/wzu/jenkinscredentials" class="navbar-item">Jenkins Credentials</router-link>
                        <router-link to="/wzu/jira" class="navbar-item">JIRA</router-link>
                    </div>
                </div>

                <div v-if="user" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        WZU-Gruppenmanagement
                    </a>
                    <div class="navbar-dropdown">
                        <!--<router-link to="/ActiveDirectory/ADGroup" class="navbar-item">AD Gruppe erstellen</router-link>
                        <router-link to="/ActiveDirectory/Adminaddordelete" class="navbar-item">AD Gruppen Admin</router-link>
                        <router-link to="/ActiveDirectory/UpdateUserGroup" class="navbar-item">AD Gruppen User</router-link>-->
                        <router-link to="/wzu/alm" class="navbar-item">ALM User Berechtigung</router-link>
                        <router-link to="/wzu/tasksuser" class="navbar-item">Tasks User Berechtigung</router-link>
                    </div>
                </div>
            </div>

            <div class="navbar-end">
                <router-link v-if="!user" to="/login" class="navbar-item">
                    <b-icon icon="face"></b-icon>
                    &nbsp; Login
                </router-link>
                <a v-if="user" class="navbar-item" v-on:click="logout">
                    <b-icon icon="face"></b-icon>
                    &nbsp; Hallo {{user.name }} - Logout
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
                    }
                }
            }
        },
        created: function () {
            this.$http.get(this.$store.state.backendURL + '/features').then(res => this.features = res.body)
        },
        methods: {
            logout() {
                this.$store.commit('setUser', {user: null});
                this.$toast.open({
                    type: 'is-success',
                    message: 'Du wurdest ausgeloggt'
                });
                this.$router.push({path: '/login'})
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
