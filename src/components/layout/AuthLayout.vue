<template>
    <div class="auth-layout">
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'AuthLayout'
  }
  </script>
  
  <style scoped>
  .auth-layout {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-primary);
    padding: 2rem;
  }
  </style>
  