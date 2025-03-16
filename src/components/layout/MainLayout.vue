<template>
  <div class="layout">
    <Sidebar />
    <main class="main-content">
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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import Sidebar from './Sidebar.vue';
  
export default {
  name: 'MainLayout',
  components: { Sidebar },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    onMounted(() => {
      // Check if user is authenticated
      if (!authStore.isAuthenticated) {
        router.push('/auth');
      }
    });
    
    return {};
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
</style>