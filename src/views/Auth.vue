<template>
  <div class="auth-container">
    <div class="auth-card card">
      <div class="auth-header">
        <div class="logo">
          <div class="logo-icon">GS</div>
          <h1 class="app-title">Gulf South Wellness</h1>
        </div>
        <p class="auth-subtitle">{{ isLogin ? 'Sign in to your account' : 'Create a new account' }}</p>
      </div>
      
      <div class="auth-tabs">
        <button 
          :class="{ active: isLogin }" 
          @click="isLogin = true"
        >
          Login
        </button>
        <button 
          :class="{ active: !isLogin }" 
          @click="isLogin = false"
        >
          Sign Up
        </button>
      </div>
      
      <form @submit.prevent="submitForm" class="auth-form">
        <div class="form-error" v-if="errorMessage">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>
        
        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-with-icon">
            <input 
              v-model="formData.username" 
              type="text" 
              id="username" 
              required 
              placeholder="Enter your username"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        
        <div class="form-group" v-if="!isLogin">
          <label for="email">Email</label>
          <div class="input-with-icon">
            <input 
              v-model="formData.email" 
              type="email" 
              id="email" 
              required 
              placeholder="Enter your email"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </div>
        
        <div class="form-group" v-if="!isLogin">
          <label for="full_name">Full Name</label>
          <div class="input-with-icon">
            <input 
              v-model="formData.full_name" 
              type="text" 
              id="full_name" 
              placeholder="Enter your full name"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-with-icon">
            <input 
              v-model="formData.password" 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              required 
              placeholder="Enter your password"
            />
            <svg 
              @click="showPassword = !showPassword"
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              class="clickable"
            >
              <path v-if="!showPassword" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line v-if="!showPassword" x1="1" y1="1" x2="23" y2="23"></line>
              <path v-if="showPassword" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle v-if="showPassword" cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        </div>
        
        <button type="submit" class="primary auth-button" :disabled="isLoading">
          <span v-if="!isLoading">{{ isLogin ? 'Login' : 'Sign Up' }}</span>
          <span v-else class="button-loader"></span>
        </button>
        
        <div class="auth-toggle">
          <span>{{ isLogin ? "Don't have an account?" : "Already have an account?" }}</span>
          <a href="#" @click.prevent="isLogin = !isLogin">
            {{ isLogin ? "Sign up" : "Login" }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUser, loginUser } from '../services/api';
import { useAuthStore } from '../store/auth';

export default {
  name: 'Auth',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const isLogin = ref(true);
    const showPassword = ref(false);
    const errorMessage = ref('');
    const isLoading = ref(false);
    
    const formData = reactive({
      username: '',
      email: '',
      full_name: '',
      password: ''
    });
    
    const submitForm = async () => {
      errorMessage.value = '';
      isLoading.value = true;
      
      try {
        if (isLogin.value) {
          const response = await loginUser(formData.username, formData.password);
          authStore.setUser(response.data);
          router.push({ name: 'Dashboard' });
        } else {
          const response = await createUser({
            username: formData.username,
            email: formData.email,
            full_name: formData.full_name,
            password: formData.password
          });
          authStore.setUser(response.data);
          router.push({ name: 'Dashboard' });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        errorMessage.value = error.response?.data?.message || 'Authentication failed. Please try again.';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      isLogin,
      formData,
      showPassword,
      submitForm,
      errorMessage,
      isLoading
    };
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 1.5rem;
  border-radius: 12px;
  /* Removed box-shadow */
  border: 1px solid var(--border-color);
  background: var(--bg-card);
}

.auth-header {
  text-align: center;
  margin-bottom: 1rem; /* Reduced from 1.25rem */
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem; /* Reduced from 0.75rem */
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: var(--accent-primary);
  color: #121212;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  /* Removed box-shadow */
}

.app-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, var(--accent-primary) 0%, #03dac6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  user-select: none;
}

.auth-subtitle {
  color: var(--text-secondary);
  margin-top: 0.25rem;
  font-size: 0.9rem;
  user-select: none;
}

.auth-tabs {
  display: flex;
  margin-bottom: 1rem; /* Reduced from 1.25rem */
  border-bottom: 1px solid var(--border-color);
}

.auth-tabs button {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.5rem;
  color: var(--text-secondary);
  position: relative;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.auth-tabs button:hover {
  color: var(--text-primary);
}

.auth-tabs button.active {
  color: var(--accent-primary);
}

.auth-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent-primary);
  border-radius: 2px 2px 0 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.form-error {
  background-color: rgba(207, 102, 121, 0.1);
  color: var(--accent-error, #cf6679);
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  user-select: none;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.15rem; /* Reduced from 0.25rem */
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
  user-select: none;
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  width: 100%;
  padding: 0.6rem 0.75rem; /* Slightly reduced */
  padding-right: 2.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-primary);
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.input-with-icon input:focus {
  border-color: var(--accent-primary);
  /* Reduced shadow */
  box-shadow: 0 0 0 1px rgba(187, 134, 252, 0.15);
  outline: none;
}

.input-with-icon input::placeholder {
  color: var(--text-tertiary);
}

.input-with-icon svg {
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.input-with-icon:focus-within svg {
  color: var(--accent-primary);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: var(--accent-primary) !important;
}

.auth-button {
  margin-top: 0.3rem; /* Reduced from 0.5rem */
  padding: 0.7rem; /* Reduced from 0.75rem */
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.auth-button:hover {
  transform: none; /* Removed transform effect */
  /* Removed box-shadow */
}

.auth-button:active {
  transform: translateY(0);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-loader {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -9px;
  margin-left: -9px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-toggle {
  margin-top: 0.5rem; /* Reduced from 0.75rem */
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  user-select: none;
}

.auth-toggle a {
  color: var(--accent-primary);
  font-weight: 500;
  text-decoration: none;
  margin-left: 0.25rem;
  cursor: pointer;
}

.auth-toggle a:hover {
  text-decoration: underline;
}
</style>