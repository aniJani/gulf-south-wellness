<template>
    <aside class="sidebar">
      <nav>
        <ul>
          <li><router-link to="/">Dashboard</router-link></li>
          <li><router-link to="/challenges">Challenges</router-link></li>
          <li><router-link to="/teams">Teams</router-link></li>
          <li><router-link to="/profile">Profile</router-link></li>
          <li><a href="#" @click.prevent="logout">Logout</a></li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script>
  import { useAuthStore } from '../../store/auth'
  export default {
    name: 'Sidebar',
    setup() {
      const authStore = useAuthStore()
      const logout = () => {
        authStore.logout()
        // After logout, redirect to Auth page
        window.location.href = '/auth'
      }
      return { logout }
    }
  }
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background: #f8f9fa;
    padding: 20px;
  }
  nav ul {
    list-style: none;
    padding: 0;
  }
  nav li {
    margin-bottom: 15px;
  }
  nav a {
    text-decoration: none;
    color: #333;
  }
  nav a.router-link-active {
    font-weight: bold;
    color: #007bff;
  }
  </style>
  