<template>
    <div class="auth-container">
      <div class="auth-box">
        <h1>{{ isLogin ? 'Login' : 'Sign Up' }}</h1>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">{{ isLogin ? 'Username' : 'Username' }}</label>
            <input v-model="username" type="text" id="username" required />
          </div>
          <div v-if="!isLogin" class="form-group">
            <label for="email">Email</label>
            <input v-model="signupForm.email" type="email" id="email" required />
          </div>
          <div v-if="!isLogin" class="form-group">
            <label for="full_name">Full Name</label>
            <input v-model="signupForm.full_name" type="text" id="full_name" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input v-model="password" type="password" id="password" required />
          </div>
          <button type="submit">{{ isLogin ? 'Login' : 'Sign Up' }}</button>
        </form>
        <p @click="toggleForm" class="toggle">
          {{ isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login" }}
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router'
import { createUser, loginUser } from '../services/api'
import { useAuthStore } from '../store/auth'
  
  export default {
    name: 'Auth',
    data() {
      return {
        isLogin: true,
        signupForm: { username: '', email: '', full_name: '', password: '' },
        loginForm: { username: '', password: '' }
      }
    },
    setup() {
      const authStore = useAuthStore()
      const router = useRouter()
      return { authStore, router }
    },
    methods: {
      toggleForm() {
        this.isLogin = !this.isLogin
      },
      submitForm() {
        if (this.isLogin) {
          loginUser(this.loginForm.username, this.loginForm.password)
            .then(response => {
              this.authStore.setUser(response.data)
              this.router.push({ name: 'Dashboard' })
            })
            .catch(err => console.error('Login error:', err))
        } else {
          createUser(this.signupForm)
            .then(response => {
              // Optionally log in automatically after signup:
              this.authStore.setUser(response.data)
              this.router.push({ name: 'Dashboard' })
            })
            .catch(err => console.error('Signup error:', err))
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #eef2f7;
  }
  .auth-box {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 350px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .form-group {
    margin-bottom: 1rem;
  }
  label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: bold;
  }
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    width: 100%;
    padding: 0.7rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
  button:hover {
    background: #0056b3;
  }
  .toggle {
    margin-top: 1rem;
    color: #007bff;
    cursor: pointer;
    text-align: center;
  }
  </style>
