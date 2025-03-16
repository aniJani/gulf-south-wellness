<template>
    <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">GS</div>
          <h1 class="logo-text">Gulf South</h1>
        </div>
        <button class="collapse-button" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>
      
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <router-link to="/dashboard" class="nav-item" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span class="nav-text">Dashboard</span>
          </router-link>
          
          <router-link to="/challenges" class="nav-item" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span class="nav-text">Challenges</span>
          </router-link>
          
          <router-link to="/teams" class="nav-item" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span class="nav-text">Teams</span>
          </router-link>
          
          <router-link to="/profile" class="nav-item" active-class="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="nav-text">Profile</span>
          </router-link>
        </nav>
      </div>
      
      <div class="sidebar-footer">
        <div class="theme-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <span class="nav-text">Dark Mode</span>
        </div>
      </div>
    </aside>
  </template>
  
  <script>
  import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
  
  export default {
    name: 'Sidebar',
    setup() {
      const isCollapsed = ref(false);
      const route = useRoute();
      
      const toggleSidebar = () => {
        isCollapsed.value = !isCollapsed.value;
        document.body.classList.toggle('sidebar-collapsed', isCollapsed.value);
        
        // Save preference to localStorage
        localStorage.setItem('sidebarCollapsed', isCollapsed.value);
      };
      
      // Close sidebar on mobile when route changes
      watch(() => route.path, () => {
        if (window.innerWidth < 768) {
          isCollapsed.value = true;
          document.body.classList.add('sidebar-collapsed');
        }
      });
      
      onMounted(() => {
        // Check saved preference
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
          isCollapsed.value = true;
          document.body.classList.add('sidebar-collapsed');
        }
        
        // Auto-collapse on mobile
        if (window.innerWidth < 768) {
          isCollapsed.value = true;
          document.body.classList.add('sidebar-collapsed');
        }
      });
      
      return {
        isCollapsed,
        toggleSidebar
      };
    }
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 260px;
    height: 100vh;
    background-color: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    transition: all var(--transition-normal);
    z-index: 20;
  }
  
  .sidebar.collapsed {
    width: 70px;
  }
  
  .sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    overflow: hidden;
  }
  
  .logo-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: var(--accent-primary);
    color: #121212;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .logo-text {
    font-size: 1.25rem;
    font-weight: 600;
    white-space: nowrap;
    transition: opacity var(--transition-normal);
  }
  
  .collapsed .logo-text {
    opacity: 0;
    width: 0;
  }
  
  .collapse-button {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--text-secondary);
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .collapse-button:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .collapsed .collapse-button svg {
    transform: rotate(180deg);
  }
  
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
  }
  
  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: var(--radius-md);
    margin: 0 0.5rem;
    transition: all var(--transition-fast);
    position: relative;
  }
  
  .nav-item:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .nav-item.active {
    background-color: rgba(187, 134, 252, 0.15);
    color: var(--accent-primary);
  }
  
  .nav-item.active::before {
    content: '';
    position: absolute;
    left: -0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background-color: var(--accent-primary);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  }
  
  .nav-text {
    white-space: nowrap;
    transition: opacity var(--transition-normal);
  }
  
  .collapsed .nav-text {
    opacity: 0;
    width: 0;
  }
  
  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
  }
  
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .theme-toggle:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      left: 0;
      transform: translateX(0);
      box-shadow: 0 0 15px var(--shadow-color);
    }
    
    .sidebar.collapsed {
      transform: translateX(-100%);
    }
  }
  </style>