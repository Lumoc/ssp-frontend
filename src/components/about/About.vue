<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        <i class="material-icons">opacity</i> About Cloud Selfservice Portal
                    </h1>
                </div>
                <div class="container">
                    <h2 class="subtitle">
                        <p>ssp-frontend version: {{ frontendVersion }}</p>
                        <p>ssp-backend version: {{ backendVersion }}</p>
                    </h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                frontendVersion: 'SSP_FRONTEND_VERSION',
                backendVersion: 'SSP_BACKEND_VERSION',
                loading: false
            };
        },
        mounted: function () {
            this.getVersions();
        },
        methods: {
            getVersions: function () {
                this.loading = true;
                this.frontendVersion = this.$store.state.version;
                if (this.frontendVersion == 'latest') {
                    this.frontendVersion = this.frontendVersion + ' (git-commit: ' + this.$store.state.gitCommit + ')';
                }
                this.$http.get(this.$store.state.backendURL + '/version').then((res) => {
                    this.backendVersion = res.body.version;
                    if (this.backendVersion == 'latest') {
                        this.backendVersion = this.backendVersion + ' (git-commit: ' + res.body.gitCommit + ')';
                    }
                    this.loading = false;
                }, () => {
                    this.loading = false;
                });
            }
        }
    };
</script>
