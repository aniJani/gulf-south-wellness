<template>
    <div class="profile-page">
      <h1>My Profile</h1>
      <div v-if="user">
        <div class="profile-details">
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Full Name:</strong> {{ user.full_name || 'Not provided' }}</p>
          <p><strong>Joined:</strong> {{ user.created_at }}</p>
        </div>
  
        <div class="user-stats">
          <h2>Your Statistics</h2>
          <p><strong>Total Challenges Completed:</strong> {{ userStats.challengesCompleted || 0 }}</p>
          <!-- Add more statistics as needed -->
        </div>
  
        <div class="profile-update">
          <h2>Update Profile</h2>
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label for="username">Username:</label>
              <input v-model="updatedData.username" type="text" id="username" placeholder="New username" />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input v-model="updatedData.email" type="email" id="email" placeholder="New email" />
            </div>
            <div class="form-group">
              <label for="full_name">Full Name:</label>
              <input v-model="updatedData.full_name" type="text" id="full_name" placeholder="New full name" />
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input v-model="updatedData.password" type="password" id="password" placeholder="New password" />
            </div>
            <button type="submit">Update Profile</button>
          </form>
        </div>
      </div>
      <div v-else>
        <p>Loading profile...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { getUserProfile, getUserStatistics, updateUserProfile } from '../services/api'
import { useAuthStore } from '../store/auth'
  
  export default {
    name: 'Profile',
    data() {
      return {
        user: null,
        userStats: {},
        updatedData: {},
        userId: null
      }
    },
    created() {
      const authStore = useAuthStore()
      this.userId = authStore.user ? authStore.user.id : null
      if (this.userId) {
        this.fetchProfile()
        this.fetchStatistics()
      }
    },
    methods: {
      fetchProfile() {
        getUserProfile(this.userId)
          .then(response => {
            this.user = response.data
            // Pre-populate update form with current data
            this.updatedData = {
              username: response.data.username,
              email: response.data.email,
              full_name: response.data.full_name,
              password: ''
            }
          })
          .catch(error => console.error('Error fetching profile:', error))
      },
      fetchStatistics() {
        getUserStatistics(this.userId)
          .then(response => {
            this.userStats = response.data
          })
          .catch(error => console.error('Error fetching statistics:', error))
      },
      updateProfile() {
        updateUserProfile(this.userId, this.updatedData)
          .then(response => {
            alert('Profile updated successfully!')
            this.user = response.data
          })
          .catch(error => console.error('Error updating profile:', error))
      }
    }
  }
  </script>
  
  <style scoped>
  .profile-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .profile-details p,
  .user-stats p {
    margin: 0.5rem 0;
  }
  .profile-update {
    margin-top: 2rem;
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
    padding: 0.7rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background: #0056b3;
  }
  </style>
  