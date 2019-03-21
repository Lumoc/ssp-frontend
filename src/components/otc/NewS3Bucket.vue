<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">edit</i> OTC Objectstorage Bucket erstellen</h1>
                </div>
                <h2 class="subtitle">
                    Hier kannst du einen OTC Objectstorage Bucket erstellen. Alle Bestellungen werden geloggt & verrechnet.</h2>
            </div>
        </div>
        <br>
        <new-s3-bucket url="/api/otc/s3"></new-s3-bucket>
    </div>
</template>

<script>
  import NewS3Bucket from '../shared/s3/NewS3Bucket.vue'
  export default {
    components: {
        'new-s3-bucket': NewS3Bucket
    }
  };
</script>
