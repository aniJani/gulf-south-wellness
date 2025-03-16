<!-- src/views/Dashboard.vue -->
<template>
    <div class="dashboard">
      <h1>Dashboard</h1>
      <section class="stats">
        <div class="stat">
          <h3>User Statistics</h3>
          <p>Total Challenges Completed: {{ userStats.challengesCompleted }}</p>
          <!-- Additional stats -->
        </div>
        <div class="stat">
          <h3>Challenge Statistics</h3>
          <p>Points Earned: {{ challengeStats.points }}</p>
        </div>
      </section>
  
      <section class="leaderboards">
        <h2>Leaderboards</h2>
        <div>
          <h3>Team Leaderboard</h3>
          <!-- Leaderboard data -->
        </div>
        <div>
          <h3>User Leaderboard</h3>
          <!-- Leaderboard data -->
        </div>
      </section>
  
      <section class="weekly-challenges">
        <h2>Weekly Challenges</h2>
        <!-- Use a component (WeeklyChallengeSelector.vue) for selecting challenges -->
      </section>
  
      <section class="activity-create">
        <h2>Create Activity</h2>
        <form @submit.prevent="createActivity">
          <!-- Inputs for activity title, description, points -->
          <button type="submit">Create Activity</button>
        </form>
      </section>
  
      <section class="joined-challenges">
        <h2>My Joined Challenges</h2>
        <ul>
          <li v-for="challenge in joinedChallenges" :key="challenge.id">
            {{ challenge.title }}
          </li>
        </ul>
      </section>
  
      <section class="activity-chart">
        <h2>Challenges Completed Over Time</h2>
        <ChallengesChart :chartData="chartData" />
      </section>
    </div>
  </template>
  
  <script>
  import ChallengesChart from '../components/ui/ChallengesChart.vue'
import { createActivity, getChallengeStatistics, getUserStatistics } from '../services/api'
  
  export default {
    name: 'Dashboard',
    components: { ChallengesChart },
    data() {
      return {
        userStats: {},
        challengeStats: {},
        joinedChallenges: [],
        chartData: null,
        userId: 1 // Replace with dynamic user ID from auth
      }
    },
    created() {
      this.fetchStatistics()
      // Fetch joined challenges and chart data similarly
    },
    methods: {
      fetchStatistics() {
        getUserStatistics(this.userId)
          .then(response => { this.userStats = response.data })
          .catch(err => console.error(err))
        
        // For challenge stats, you might want to choose a specific challenge or aggregate data:
        getChallengeStatistics(1)
          .then(response => { 
            this.challengeStats = response.data
            // Process response to create chartData structure for Chart.js
            this.chartData = { labels: response.data.labels, data: response.data.data }
          })
          .catch(err => console.error(err))
      },
      createActivity() {
        // Call the createActivity endpoint using the user_id query parameter.
        // Collect activity details from form inputs.
        // Example:
        const activityData = { title: 'New Activity', description: 'Did something', points: 10 }
        createActivity(this.userId, activityData)
          .then(response => {
            console.log('Activity created:', response.data)
            // Refresh activities if needed
          })
          .catch(err => console.error(err))
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add styles for dashboard layout and sections */
  </style>
  