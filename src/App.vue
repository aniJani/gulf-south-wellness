<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { initializeTheme } from './utils/theme';

onMounted(() => {
  initializeTheme();
});
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
</style>