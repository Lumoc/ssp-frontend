<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i> Artifactory Repository</h1>
                </div>
                <h2 class="subtitle">
                    Click here to create an Artifactory repository</h2>
                <h3 class="has-text-link"><a href="https://confluence.sbb.ch/pages/viewpage.action?pageId=1072072404"> Click here to see the WZU self service portal documentation</a></h3>
            </div>
        </div>
        <br>
        <form v-on:submit.prevent="newArtifactoryRepository">
            <b-field label="Repository Name (can only contain lower case letters and numbers). The repository type be will automatically appended on creation like .mvn or .go"
                     :type="errors.has('RepositoryName') ? 'is-danger' : ''"
                     :message="errors.first('RepositoryName')">
                <b-input v-model.trim="repository"
                         name="RepositoryName"
                         ref="autofocus"
                         :message="errors.first('RepositoryName')"
                         v-validate.rules="{ required: true, regex: /^([0-9a-zA-Z]{1,}|[0-9a-zA-Z]{1,}-[0-9a-zA-Z]{1,})$/}">
                </b-input>
            </b-field>
            <label class="label">Repository Type</label>
            <b-field>
                <b-radio-button v-model="type"
                                native-value="maven"
                                type="is-success">
                    <span>Maven (Java)</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="docker"
                                type="is-success">
                    <span>Docker</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="npm"
                                type="is-success">
                    <span>NPM</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="generic"
                                type="is-success">
                    <span>Generic</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="ios"
                                type="is-success">
                    <span>ios</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="rpm"
                                type="is-success">
                    <span>RPM</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="ivy"
                                type="is-success">
                    <span>Ivy</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="helm"
                                type="is-success">
                    <span>Helm</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="conan"
                                type="is-success">
                    <span>Conan</span>
                </b-radio-button>
                <b-radio-button v-model="type"
                                native-value="pip"
                                type="is-success">
                    <span>Pip (Python)</span>
                </b-radio-button>
            </b-field>

            <b-notification v-if="type == 'helm'" aria-close-label="Close notification">
                When ordering a Helm repository, two repositories are created. The name you enter in the "Repository Name" field will be the name of the virtual repository pointing to a local Helm repository with the same name and the ending ".local".
                The usage of a virtual repository is required by artifactory <a href="https://www.jfrog.com/confluence/display/JFROG/Helm+Chart+Repositories#HelmChartRepositories-ResolvingHelmCharts"> Artifactory Documentation</a>
            </b-notification>

            <button :disabled="errors.any()"
                    v-bind:class="{'is-loading': loading}"
                    class="button is-primary">Create Repository
            </button>
        </form>
    </div>
</template>

<script>
    import { Validator } from 'vee-validate';

    const dictionary = {
        custom: {

            "RepositoryName": {
                required: "Please type in a repository name",
                regex: "The repository name can only contain alphanumeric characters and max. one "-""
            }
        }
    };

    // Override and merge the dictionaries
    Validator.localize('en', dictionary);

    export default {
        data() {
            return {
                repository: '',
                type: '',
                loading: false
            };
        },
        methods: {
            newArtifactoryRepository: function () {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.loading = true;

                        this.$http.post(this.$store.state.wzuURL + '/api/artifactory/createRepository', {
                            repositoryKey: this.repository,
                            repositoryType: this.type
                        }).then(() => {
                            this.loading = false;
                        }, () => {
                            this.loading = false;
                        });
                    }
                });
            }
        }
    }
</script>
