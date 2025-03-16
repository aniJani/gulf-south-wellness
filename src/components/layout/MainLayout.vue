<template>
    <div class="layout">
      <Sidebar />
      <main class="main-content">
        <header class="header">
          <div class="header-left">
            <button class="menu-button" @click="toggleSidebar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div class="breadcrumb">
              <span>{{ currentRoute }}</span>
            </div>
          </div>
          <div class="header-right">
            <div class="user-menu" @click="toggleUserMenu" ref="userMenuRef">
              <div class="user-avatar">{{ userInitials }}</div>
              <span class="user-name">{{ userName }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              
              <div v-if="userMenuOpen" class="dropdown-menu">
                <router-link to="/profile" class="dropdown-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Profile</span>
                </router-link>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" @click="logout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import Sidebar from './Sidebar.vue';
  
  export default {
    name: 'MainLayout',
    components: { Sidebar },
    setup() {
      const router = useRouter();
      const route = useRoute();
      const authStore = useAuthStore();
      const sidebarOpen = ref(true);
      const userMenuOpen = ref(false);
      const userMenuRef = ref(null);
      
      const userName = computed(() => {
        return authStore.user?.full_name || 'User';
      });
      
      const userInitials = computed(() => {
        if (!authStore.user || !authStore.user.full_name) return 'U';
        
        const nameParts = authStore.user.full_name.split(' ');
        if (nameParts.length > 1) {
          return `${nameParts[0][0]}${nameParts[1][0]}`;
        }
        return nameParts[0].substring(0, 2);
      });
      
      const currentRoute = computed(() => {
        return route.name || 'Dashboard';
      });
      
      const toggleSidebar = () => {
        sidebarOpen.value = !sidebarOpen.value;
        document.body.classList.toggle('sidebar-collapsed', !sidebarOpen.value);
      };
      
      const toggleUserMenu = () => {
        userMenuOpen.value = !userMenuOpen.value;
      };
      
      const closeUserMenu = (e) => {
        if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
          userMenuOpen.value = false;
        }
      };
      
      const logout = () => {
        authStore.logout();
        router.push('/auth');
      };
      
      onMounted(() => {
        document.addEventListener('click', closeUserMenu);
        
        // Check if user is authenticated
        if (!authStore.isAuthenticated) {
          router.push('/auth');
        }
      });
      
      onUnmounted(() => {
        document.removeEventListener('click', closeUserMenu);
      });
      
      return {
        sidebarOpen,
        userMenuOpen,
        userMenuRef,
        userName,
        userInitials,
        currentRoute,
        toggleSidebar,
        toggleUserMenu,
        logout
      };
    }
  };
  </script>
  
  <style scoped>
  .layout {
    display: flex;
    min-height: 100vh;
    background-color: var(--bg-primary);
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    transition: margin-left var(--transition-normal);
  }
  
  .header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .menu-button {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: 0.5rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .menu-button:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .breadcrumb {
    font-weight: 500;
    font-size: 1.1rem;
  }
  
  .user-menu {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    position: relative;
    transition: background-color var(--transition-fast);
  }
  
  .user-menu:hover {
    background-color: var(--bg-tertiary);
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    background-color: var(--accent-primary);
    color: #121212;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .user-name {
    font-weight: 500;
  }
  
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    width: 200px;
    background-color: var(--bg-card);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px var(--shadow-color);
    overflow: hidden;
    z-index: 100;
    animation: fadeIn 0.2s ease;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: var(--text-primary);
    text-decoration: none;
    transition: background-color var(--transition-fast);
    cursor: pointer;
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    font-size: 0.875rem;
  }
  
  .dropdown-item:hover {
    background-color: var(--bg-tertiary);
  }
  
  .dropdown-divider {
    height: 1px;
    background-color: var(--border-color);
    margin: 0.25rem 0;
  }
  
  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  
  /* Transitions */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  @media (max-width: 768px) {
    .user-name {
      display: none;
    }
  }
  </style>