<template>
    <div class="card">
        <div class="card-header">
            <h1 class="card-header-title">{{ server.name }}</h1>
        </div>
        <div class="card-content">
            <b-field v-if="server.metadata">
                <template slot="label">
                    Accounting Number
                    <b-tooltip type="is-dark" multilined animated position="is-right" label="Accounting number (e.g 77606105), internal order (70029490) or PSP element including phase number (1157803.4-10.1)">
                        <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                    </b-tooltip>
                </template>
                <b-input v-model="server.metadata.sbb_accounting_number"
                         required
                         pattern="[0-9.-]*"
                         validation-message="Please enter a valid accounting number"></b-input>
            </b-field>
            <b-message type="is-info">
                Please only fill in correct information.
            </b-message>

            <b-field label="Mega ID" v-if="server.metadata">
                <b-input v-model="server.metadata.sbb_mega_id"
                         required
                         pattern="[a-zA-Z0-9]{16}"
                         validation-message="Please enter a valid Mega ID"></b-input>
            </b-field>
            <b-message type="is-info">
                Useful links for Mega ID: <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/85c6a9c748db00d1.htm">All Applications</a>, <a target="_blank" href="http://filer.sbb.ch/it1/ea_publikation/mega4/pages/a261aa7848d00c63.htm">Overview (e.g application creation form)</a>
            </b-message>
            <button class="button" @click="updateMetadata()">Update</button>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["server"],
        data() {
            return {
                loading: false,
            };
        },
        methods: {
            updateMetadata: function() {
                console.log(this.server)
                this.$parent.close();
            },
        }
    };
</script>
