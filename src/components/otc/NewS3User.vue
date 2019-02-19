<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">perm_identity</i> OTC Objectstorage Bucket-Benutzer erstellen</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du einen Benutzer zu einem OTC Objectstorage Bucket erstellen. Alle Bestellungen werden geloggt &
                    verrechnet.</h2>
            </div>
        </div>
        <br>
        <new-s3-user url="/api/otc/objectstorage"></new-s3-user>
    </div>
</template>

<script>
    import NewS3User from '../shared/s3/NewS3User.vue'
    export default {
        components: {
            'new-s3-user': NewS3User
        }
    };
</script>
