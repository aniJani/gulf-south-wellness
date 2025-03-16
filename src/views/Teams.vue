<template>
    <div class="teams-page">
      <h1>Teams</h1>
      <ul>
        <li v-for="team in teams" :key="team.id">
          <h3>{{ team.name }}</h3>
          <p>Created At: {{ team.created_at }}</p>
          <button @click="joinTeam(team.id)">Join Team</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { addTeamMember, getTeams } from '../services/api'
  
  export default {
    name: 'Teams',
    data() {
      return {
        teams: [],
        userId: 1 // example; update with authenticated user info
      }
    },
    created() {
      getTeams({ skip: 0, limit: 10 })
        .then(response => { this.teams = response.data })
        .catch(error => console.error('Error fetching teams:', error))
    },
    methods: {
      joinTeam(teamId) {
        addTeamMember(teamId, this.userId)
          .then(() => { alert('Joined team successfully!') })
          .catch(error => console.error('Error joining team:', error))
      }
    }
  }
  </script>
  
  <style scoped>
  .teams-page {
    padding: 20px;
  }
  ul { list-style: none; padding: 0; }
  li {
    background: #f0f0f0;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  </style>
  