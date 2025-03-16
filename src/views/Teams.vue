<template>
    <div class="teams-page">
      <div class="page-header">
        <h1>Teams</h1>
        <button class="primary" @click="showCreateTeamModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create Team
        </button>
      </div>
      
      <div class="teams-tabs">
        <button 
          :class="{ active: activeTab === 'all' }" 
          @click="activeTab = 'all'"
        >
          All Teams
        </button>
        <button 
          :class="{ active: activeTab === 'my-teams' }" 
          @click="activeTab = 'my-teams'"
        >
          My Teams
        </button>
      </div>
      
      <div class="search-container">
        <input type="text" placeholder="Search teams..." v-model="searchQuery" class="search-input" />
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      
      <div class="teams-grid">
        <div v-for="team in filteredTeams" :key="team.id" class="team-card card">
          <div class="team-header">
            <div class="team-avatar">{{ team.initials }}</div>
            <div class="team-info">
              <h3>{{ team.name }}</h3>
              <p class="team-meta">{{ team.memberCount }} members</p>
            </div>
            <div class="team-rank" :class="{ 'top-rank': team.rank <= 3 }">
              #{{ team.rank }}
            </div>
          </div>
          
          <div class="team-stats">
            <div class="stat-item">
              <div class="stat-label">Challenges</div>
              <div class="stat-value">{{ team.challengesCompleted }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Points</div>
              <div class="stat-value">{{ team.points }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Streak</div>
              <div class="stat-value">{{ team.streak }} days</div>
            </div>
          </div>
          
          <div class="team-members">
            <h4>Top Members</h4>
            <div class="members-list">
              <div v-for="(member, index) in team.topMembers" :key="index" class="member-item">
                <div class="member-avatar">{{ member.initials }}</div>
                <div class="member-name">{{ member.name }}</div>
                <div class="member-points">{{ member.points }} pts</div>
              </div>
            </div>
          </div>
          
          <div class="team-actions">
            <button 
              v-if="!team.isMember" 
              class="primary" 
              @click="joinTeam(team.id)"
            >
              Join Team
            </button>
            <button 
              v-else 
              class="secondary" 
              @click="viewTeamDetails(team.id)"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
      
      <!-- Create Team Modal -->
      <div v-if="showCreateTeamModal" class="modal-overlay" @click="showCreateTeamModal = false">
        <div class="modal-content card" @click.stop>
          <div class="modal-header">
            <h2>Create New Team</h2>
            <button class="close-button" @click="showCreateTeamModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="createNewTeam" class="modal-form">
            <div class="form-group">
              <label for="team-name">Team Name</label>
              <input v-model="newTeam.name" type="text" id="team-name" required placeholder="Enter team name" />
            </div>
            
            <div class="form-group">
              <label for="team-description">Description</label>
              <textarea v-model="newTeam.description" id="team-description" rows="3" placeholder="Enter team description"></textarea>
            </div>
            
            <div class="form-group">
              <label>Privacy</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input type="radio" v-model="newTeam.isPrivate" :value="false" />
                  <span>Public</span>
                  <span class="radio-description">Anyone can join this team</span>
                </label>
                <label class="radio-label">
                  <input type="radio" v-model="newTeam.isPrivate" :value="true" />
                  <span>Private</span>
                  <span class="radio-description">Members can only join by invitation</span>
                </label>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="showCreateTeamModal = false">Cancel</button>
              <button type="submit" class="primary">Create Team</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, onMounted, ref } from 'vue';
import { addTeamMember, createTeam, getTeams, listTeamMembers } from '../services/api';
import { useAuthStore } from '../store/auth';
  
  export default {
    name: 'Teams',
    setup() {
      const authStore = useAuthStore();
      const userId = computed(() => authStore.user?.id || 1);
      
      const teams = ref([]);
      const userTeams = ref([]);
      const searchQuery = ref('');
      const activeTab = ref('all');
      const showCreateTeamModal = ref(false);
      
      const newTeam = ref({
        name: '',
        description: '',
        isPrivate: false
      });
      
      const filteredTeams = computed(() => {
        let filtered = [...teams.value];
        
        // Filter by tab
        if (activeTab.value === 'my-teams') {
          filtered = filtered.filter(team => team.isMember);
        }
        
        // Filter by search query
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(team => 
            team.name.toLowerCase().includes(query) || 
            team.description?.toLowerCase().includes(query)
          );
        }
        
        return filtered;
      });
      
      const fetchTeams = async () => {
        try {
          const response = await getTeams({ skip: 0, limit: 20 });
          
          // If no data from API, use sample data
          if (!response.data || response.data.length === 0) {
            teams.value = [
              {
                id: 1,
                name: "Team Alpha",
                description: "The leading wellness team focused on fitness and nutrition",
                memberCount: 12,
                rank: 1,
                challengesCompleted: 45,
                points: 2850,
                streak: 14,
                isMember: true,
                initials: "TA",
                topMembers: [
                  { name: "Jane Smith", points: 780, initials: "JS" },
                  { name: "Alex Johnson", points: 695, initials: "AJ" },
                  { name: "Mike Wilson", points: 620, initials: "MW" }
                ]
              },
              {
                id: 2,
                name: "Team Omega",
                description: "Focused on mindfulness and mental wellness challenges",
                memberCount: 8,
                rank: 2,
                challengesCompleted: 38,
                points: 2340,
                streak: 7,
                isMember: false,
                initials: "TO",
                topMembers: [
                  { name: "John Doe", points: 720, initials: "JD" },
                  { name: "Sarah Lee", points: 680, initials: "SL" },
                  { name: "David Kim", points: 590, initials: "DK" }
                ]
              },
              {
                id: 3,
                name: "Team Beta",
                description: "Balanced approach to wellness with diverse challenges",
                memberCount: 15,
                rank: 3,
                challengesCompleted: 32,
                points: 2100,
                streak: 5,
                isMember: false,
                initials: "TB",
                topMembers: [
                  { name: "Sam Wilson", points: 650, initials: "SW" },
                  { name: "Emma Clark", points: 580, initials: "EC" },
                  { name: "Ryan Murphy", points: 520, initials: "RM" }
                ]
              },
              {
                id: 4,
                name: "Team Gamma",
                description: "Newcomers with a focus on building healthy habits",
                memberCount: 6,
                rank: 4,
                challengesCompleted: 25,
                points: 1750,
                streak: 3,
                isMember: false,
                initials: "TG",
                topMembers: [
                  { name: "Taylor Kim", points: 610, initials: "TK" },
                  { name: "Chris Evans", points: 540, initials: "CE" },
                  { name: "Lisa Wong", points: 480, initials: "LW" }
                ]
              },
              {
                id: 5,
                name: "Team Delta",
                description: "Competitive team focused on high-intensity challenges",
                memberCount: 10,
                rank: 5,
                challengesCompleted: 22,
                points: 1680,
                streak: 2,
                isMember: false,
                initials: "TD",
                topMembers: [
                  { name: "James Brown", points: 590, initials: "JB" },
                  { name: "Olivia Martinez", points: 520, initials: "OM" },
                  { name: "Daniel Lee", points: 470, initials: "DL" }
                ]
              },
              {
                id: 6,
                name: "Team Epsilon",
                description: "Senior wellness team with age-appropriate challenges",
                memberCount: 7,
                rank: 6,
                challengesCompleted: 18,
                points: 1450,
                streak: 1,
                isMember: false,
                initials: "TE",
                topMembers: [
                  { name: "Robert Johnson", points: 520, initials: "RJ" },
                  { name: "Patricia Davis", points: 490, initials: "PD" },
                  { name: "Thomas Wilson", points: 440, initials: "TW" }
                ]
              }
            ];
          } else {
            // Process API response
            teams.value = response.data.map(team => {
              // Check if user is a member of this team
              const isMember = userTeams.value.some(ut => ut.id === team.id);
              
              // Generate initials from team name
              const words = team.name.split(' ');
              const initials = words.length > 1 
                ? `${words[0][0]}${words[1][0]}`
                : team.name.substring(0, 2);
              
              return {
                ...team,
                isMember,
                initials: initials.toUpperCase()
              };
            });
          }
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
      };
      
      const joinTeam = async (teamId) => {
        try {
          await addTeamMember(teamId, userId.value);
          
          // Update local state
          const team = teams.value.find(t => t.id === teamId);
          if (team) {
            team.isMember = true;
            team.memberCount++;
          }
        } catch (error) {
          console.error('Error joining team:', error);
        }
      };
      
      const viewTeamDetails = (teamId) => {
        // In a real app, this would navigate to a team details page
        console.log('View team details for team ID:', teamId);
      };
      
      const createNewTeam = async () => {
        try {
          const response = await createTeam({
            name: newTeam.value.name,
            description: newTeam.value.description,
            is_private: newTeam.value.isPrivate
          });
          
          // Add the new team to the list
          const createdTeam = response.data;
          const words = createdTeam.name.split(' ');
          const initials = words.length > 1 
            ? `${words[0][0]}${words[1][0]}`
            : createdTeam.name.substring(0, 2);
          
          teams.value.unshift({
            ...createdTeam,
            isMember: true,
            memberCount: 1,
            rank: teams.value.length + 1,
            challengesCompleted: 0,
            points: 0,
            streak: 0,
            initials: initials.toUpperCase(),
            topMembers: []
          });
          
          // Reset form and close modal
          newTeam.value = {
            name: '',
            description: '',
            isPrivate: false
          };
          showCreateTeamModal.value = false;
        } catch (error) {
          console.error('Error creating team:', error);
        }
      };
      
      onMounted(() => {
        fetchTeams();
      });
      
      return {
        teams,
        filteredTeams,
        searchQuery,
        activeTab,
        showCreateTeamModal,
        newTeam,
        joinTeam,
        viewTeamDetails,
        createNewTeam
      };
    }
  };
  </script>
  
  <style scoped>
  .teams-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .page-header button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .teams-tabs {
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.5rem;
  }
  
  .teams-tabs button {
    background: transparent;
    border: none;
    padding: 0.5rem 1rem;
    color: var(--text-secondary);
    font-weight: 500;
    position: relative;
  }
  
  .teams-tabs button:hover {
    color: var(--text-primary);
    background: transparent;
  }
  
  .teams-tabs button.active {
    color: var(--accent-primary);
  }
  
  .teams-tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-primary);
    border-radius: 2px;
  }
  
  .search-container {
    position: relative;
    max-width: 400px;
  }
  
  .search-input {
    padding-right: 2.5rem;
    width: 100%;
  }
  
  .search-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }
  
  .teams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .team-card {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .team-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .team-avatar {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--accent-primary);
    color: #121212;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.25rem;
  }
  
  .team-info {
    flex: 1;
  }
  
  .team-meta {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }
  
  .team-rank {
    font-weight: bold;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    background: var(--bg-tertiary);
    font-size: 0.9rem;
  }
  
  .team-rank.top-rank {
    background: var(--accent-primary);
    color: #121212;
  }
  
  .team-stats {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: 8px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .team-members h4 {
    margin-bottom: 1rem;
    color: var(--text-secondary);
    font-weight: 500;
  }
  
  .members-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .member-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 8px;
    background: var(--bg-tertiary);
  }
  
  .member-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .member-name {
    flex: 1;
    font-size: 0.9rem;
  }
  
  .member-points {
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--accent-primary);
  }
  
  .team-actions {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
  }
  
  .modal-content {
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .close-button {
    background: transparent;
    border: none;
    padding: 0.25rem;
    color: var(--text-secondary);
    cursor: pointer;
  }
  
  .close-button:hover {
    color: var(--text-primary);
    background: transparent;
  }
  
  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .radio-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
  }
  
  .radio-label input {
    margin-top: 0.25rem;
    width: auto;
  }
  
  .radio-description {
    display: block;
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  @media (max-width: 768px) {
    .teams-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>