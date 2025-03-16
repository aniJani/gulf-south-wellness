<template>
    <div class="challenges-page">
      <h1>Challenges & Activities</h1>
      <div class="challenges-list">
        <ul>
          <li v-for="challenge in challenges" :key="challenge.id">
            <h3>{{ challenge.title }}</h3>
            <p>{{ challenge.description }}</p>
            <button @click="joinChallenge(challenge.id)">Join Challenge</button>
          </li>
        </ul>
      </div>
      <div class="activities">
        <h2>Recent Activities</h2>
        <ul>
          <li v-for="activity in activities" :key="activity.id">
            {{ activity.description }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { getActivities, getChallenges, joinChallenge } from '../services/api'
  
  export default {
    name: 'Challenges',
    data() {
      return {
        challenges: [],
        activities: [],
        userId: 1 // example user id; integrate with authentication later
      }
    },
    created() {
      this.fetchChallenges()
      this.fetchActivities()
    },
    methods: {
      fetchChallenges() {
        getChallenges({ weekly: false, skip: 0, limit: 10 })
          .then(response => { this.challenges = response.data })
          .catch(error => console.error('Error fetching challenges:', error))
      },
      fetchActivities() {
        getActivities({ skip: 0, limit: 10 })
          .then(response => { this.activities = response.data })
          .catch(error => console.error('Error fetching activities:', error))
      },
      joinChallenge(challengeId) {
        joinChallenge(challengeId, this.userId)
          .then(() => { alert('Joined challenge successfully!') })
          .catch(error => console.error('Error joining challenge:', error))
      }
    }
  }
  </script>
  
  <style scoped>
  .challenges-page {
    padding: 20px;
  }
  .challenges-list ul, .activities ul {
    list-style: none;
    padding: 0;
  }
  .challenges-list li, .activities li {
    background: #f0f0f0;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  </style>
  