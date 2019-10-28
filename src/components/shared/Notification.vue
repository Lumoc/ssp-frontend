<template>
    <b-message v-if="notification && notification.type"
               :title="notification.type === 'success' ? 'Success' : 'Failed'"
               :type="'is-' + notification.type"
               :closable="false">
        <span v-html="notification.message"></span>
    </b-message>
</template>

<script>
  export default {
    computed: {
      notification() {
        return this.$store.state.notification;
      }
    }
  };
</script>
