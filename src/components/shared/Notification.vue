<style>
    .notification {
        position: -webkit-sticky; /* Safari */
        position: sticky;
        top: 5px;
        z-index: 10;
    }
</style>
<template>
    <b-notification v-if="notification && notification.type"
               has-icon
               @close="resetState"
               :type="'is-' + notification.type">
        <span v-html="notification.message"></span>
    </b-notification>
</template>

<script>
  export default {
    computed: {
      notification() {
        return this.$store.state.notification;
      }
    },
    methods: {
      resetState() {
        this.$store.state.notification = "";
      }
    }
  };
</script>
