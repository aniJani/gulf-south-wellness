<template>
    <div class="main-layout">
      <Sidebar />
      <div class="content">
        <div class="content-wrapper">
          <router-view />
        </div>
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
    min-height: 100vh;
    background-color: var(--bg-primary);
  }
  
  .content {
    flex: 1;
    padding: 0;
    overflow-x: hidden;
  }
  
  .content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  @media (max-width: 768px) {
    .content-wrapper {
      padding: 1rem;
    }
  }
  </style>