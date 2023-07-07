<template>
  <b-footer class="footer mt-2">
    <div class="container">
      <br>
      <br>
      <br>
      <br>
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="copyright text-center">
            &copy; {{ year }}, Hecho con <i class="tim-icons icon-heart-2"></i> por
            <a href="https://iotser.cl" target="_blank" rel="noopener">IoT SER</a>
            para una mejor web.
          </div>
        </div>
        <div class="col-md-4">
          <div class="footer-address text-center">
            <p><i class="tim-icons icon-square-pin"></i> Camino Carampangue, Parcela 44, Talagante.</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="footer-email text-center">
            <p><i class="tim-icons icon-email-85"></i> <a href="mailto:iotdevinnovations@gmail.com">iotdevinnovations@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  </b-footer>
</template>

<script>

import { BFooter } from 'bootstrap-vue'

export default {
  components: {
    BFooter
  },
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>

.footer-address i, .footer-email i {
  margin-right: 10px;
}

.footer-address p, .footer-email p {
  display: inline-block;
  vertical-align: middle;
}
</style>
