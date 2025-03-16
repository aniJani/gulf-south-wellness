<template>
  <div class="app-container">
    <MainLayout />
  </div>
</template>

<script>
import MainLayout from './components/layout/MainLayout.vue';
import './style.css'; // Make sure styles are imported

export default {
  name: 'App',
  components: { MainLayout }
}
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
</style>