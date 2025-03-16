<template>
    <div class="auth-container">
      <div class="auth-card card">
        <div class="auth-header">
          <div class="logo">
            <div class="logo-icon">GS</div>
            <h1>Gulf South Wellness</h1>
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
          
          <div v-if="isLogin" class="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
          
          <button type="submit" class="primary auth-button">
            {{ isLogin ? 'Login' : 'Sign Up' }}
          </button>
        </form>
        
        <div class="auth-divider">
          <span>OR</span>
        </div>
        
        <div class="social-auth">
          <button class="social-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            Continue with Facebook
          </button>
          <button class="social-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            Continue with GitHub
          </button>
        </div>
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
      
      const formData = reactive({
        username: '',
        email: '',
        full_name: '',
        password: ''
      });
      
      const submitForm = async () => {
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
          // In a real app, you would handle errors and show user feedback
        }
      };
      
      return {
        isLogin,
        formData,
        showPassword,
        submitForm
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
    padding: 2rem;
    background-color: var(--bg-primary);
  }
  
  .auth-card {
    width: 100%;
    max-width: 450px;
    padding: 2rem;
  }
  
  .auth-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .logo-icon {
    width: 60px;
    height: 60px;
    background: var(--accent-primary);
    color: #121212;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.5rem;
  }
  
  .auth-subtitle {
    color: var(--text-secondary);
  }
  
  .auth-tabs {
    display: flex;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .auth-tabs button {
    flex: 1;
    background: transparent;
    border: none;
    padding: 0.75rem;
    color: var(--text-secondary);
    position: relative;
  }
  
  .auth-tabs button:hover {
    color: var(--text-primary);
    background: transparent;
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
  }
  
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .input-with-icon {
    position: relative;
  }
  
  .input-with-icon input {
    padding-right: 2.5rem;
  }
  
  .input-with-icon svg {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }
  
  .clickable {
    cursor: pointer;
  }
  
  .forgot-password {
    text-align: right;
    font-size: 0.85rem;
    margin-top: -0.5rem;
  }
  
  .auth-button {
    margin-top: 1rem;
  }
  
  .auth-divider {
    display: flex;
    align-items: center;
    margin: 2rem 0;
  }
  
  .auth-divider::before,
  .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }
  
  .auth-divider span {
    padding: 0 1rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
  
  .social-auth {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
  }
  
  .social-button:hover {
    background: var(--bg-card-hover);
  }
  </style>