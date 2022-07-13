<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="text-center">
        <h6>“Lo que no se mide, no se puede controlar” – De Marco</h6>
      </div>
      <div class="copyright">
        &copy; {{ year }}, Hecho con <i class="tim-icons icon-heart-2"></i> por
        
        <a
          href="https://iotser.cl"
          target="_blank"
          rel="noopener"
          >IoT SER</a
        >
        para una mejor web.
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style></style>
