<script>
export default {
  name: 'IndexPage',
  middleware({ redirect }) {
    console.log('Redireccionando a /home');
    redirect('/home');
  }
}
</script>
