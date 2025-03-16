<template>
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">GS</div>
          <h2 v-if="!isCollapsed">Gulf South</h2>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path v-if="isCollapsed" d="M13 17l5-5-5-5M6 17l5-5-5-5"></path>
            <path v-else d="M11 17l-5-5 5-5M18 17l-5-5 5-5"></path>
          </svg>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span v-if="!isCollapsed">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/challenges" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              <span v-if="!isCollapsed">Challenges</span>
            </router-link>
          </li>
          <li>
            <router-link to="/teams" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span v-if="!isCollapsed">Teams</span>
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span v-if="!isCollapsed">Profile</span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <button class="logout-btn" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span v-if="!isCollapsed">Logout</span>
        </button>
      </div>
    </aside>
  </template>
    
  <script>
  import { ref } from 'vue';
import { useAuthStore } from '../../store/auth';
  
  export default {
    name: 'Sidebar',
    setup() {
      const authStore = useAuthStore();
      const isCollapsed = ref(false);
      
      const toggleSidebar = () => {
        isCollapsed.value = !isCollapsed.value;
        localStorage.setItem('sidebarCollapsed', isCollapsed.value);
      };
      
      const logout = () => {
        authStore.logout();
        window.location.href = '/auth';
      };
      
      // Check if sidebar was collapsed in previous session
      if (localStorage.getItem('sidebarCollapsed') === 'true') {
        isCollapsed.value = true;
      }
      
      return { logout, isCollapsed, toggleSidebar };
    }
  };
  </script>
    
  <style scoped>
  .sidebar {
    width: 250px;
    background: var(--bg-secondary);
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
    overflow: hidden;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }
  
  .sidebar-collapsed {
    width: 70px;
  }
  
  .sidebar-header {
    padding: 1.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-color);
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .logo-icon {
    width: 36px;
    height: 36px;
    background: var(--accent-primary);
    color: #121212;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
  }
  
  .logo h2 {
    margin: 0;
    font-size: 1.25rem;
    white-space: nowrap;
  }
  
  .collapse-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .collapse-btn:hover {
    color: var(--text-primary);
    background: transparent;
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 1.5rem 0;
    overflow-y: auto;
  }
  
  .sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
  }
  
  .nav-link:hover, .nav-link.router-link-active {
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border-left-color: var(--accent-primary);
  }
  
  .sidebar-collapsed .nav-link {
    justify-content: center;
    padding: 0.75rem;
  }
  
  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
  }
  
  .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    color: var(--text-secondary);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .sidebar-collapsed .logout-btn {
    justify-content: center;
  }
  
  .logout-btn:hover {
    background: var(--bg-tertiary);
    color: var(--accent-warning);
  }
  </style>