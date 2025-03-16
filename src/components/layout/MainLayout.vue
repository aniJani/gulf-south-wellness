<template>
    <div class="main-layout">
      <Sidebar />
      <div class="content">
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from './Sidebar.vue';
  export default {
    name: 'MainLayout',
    components: { Sidebar }
  }
  </script>
  
  <style scoped>
  .main-layout {
    display: flex;
  }
  .content {
    flex: 1;
    padding: 20px;
  }
  </style>
  