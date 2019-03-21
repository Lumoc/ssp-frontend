<template>
    <div>
        <div class="hero is-light">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title"><i class="material-icons">list</i> OTC Objectstorage Bucket anzeigen</h1>
                </div>
                <h2 class="subtitle">
                    Hier werden alle deine OTC Objectstorage Buckets angezeigt.</h2>
            </div>
        </div>
        <br>
        <list-s3-buckets url="/api/otc/s3"></list-s3-buckets>
    </div>
</template>

<script>
  import ListS3Buckets from '../shared/s3/ListS3Buckets.vue'
  export default {
    components: {
        'list-s3-buckets': ListS3Buckets
    }
  };
</script>
