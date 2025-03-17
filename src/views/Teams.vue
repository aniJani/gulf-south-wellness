<template>
    <div class="teams-page animate-fade-in">
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
        <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">All Teams</button>
        <button :class="{ active: activeTab === 'my-teams' }" @click="activeTab = 'my-teams'">My Teams</button>
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
              <p class="team-points">Team Points: {{ team.teamPoints }}</p>
            </div>
          </div>
          
          <div class="team-description">
            <p>{{ team.description }}</p>
          </div>
          
          <div class="team-actions">
            <button v-if="!team.isMember" class="primary" @click="joinTeam(team.id)">
              Join Team
            </button>
            <button v-else class="secondary" @click="viewTeamDetails(team.id)">
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
            
            <div class="modal-actions">
              <button type="button" @click="showCreateTeamModal = false">Cancel</button>
              <button type="submit" class="primary">Create Team</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Team Details Modal -->
      <div v-if="showTeamDetailsModal" class="modal-overlay" @click="closeTeamDetails">
        <div class="modal-content card" @click.stop>
          <div class="modal-header">
            <h2>{{ selectedTeam.name }} - Details</h2>
            <button class="close-button" @click="closeTeamDetails">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="team-members">
            <h3>Team Members</h3>
            <ul>
              <li v-for="member in teamMembers" :key="member.id">
                {{ member.username }} - {{ member.points }} points
              </li>
            </ul>
            <p class="total-points">
              Total Team Points: {{ teamTotalPoints }}
            </p>
          </div>
        </div>
      </div>
      
    </div>
  </template>
  
  <script>
  import { computed, onMounted, ref } from 'vue';
import {
    addTeamMember,
    createTeam,
    getTeams,
    getUsers,
    getUserStatistics,
    listTeamMembers,
} from '../services/api';
import { useAuthStore } from '../store/auth';
  
  export default {
    name: 'Teams',
    setup() {
      const authStore = useAuthStore();
      const userId = computed(() => authStore.user?.id || 1);
  
      const teams = ref([]);
      const searchQuery = ref('');
      const activeTab = ref('all');
      const showCreateTeamModal = ref(false);
  
      // For team details modal
      const showTeamDetailsModal = ref(false);
      const selectedTeam = ref({});
      const teamMembers = ref([]);
      const teamTotalPoints = ref(0);
  
      // New team (only a name is required)
      const newTeam = ref({ name: '' });
  
      // All users (needed to compute team points)
      const allUsers = ref([]);
      const fetchAllUsers = async () => {
        try {
          const response = await getUsers();
          allUsers.value = response.data || [];
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      // Fetch teams from public endpoint and enrich with membership info and team points.
      const fetchTeams = async () => {
        try {
          const response = await getTeams({ skip: 0, limit: 20 });
          if (!response.data || response.data.length === 0) {
            teams.value = [
              {
                id: 1,
                name: "Team Alpha",
                description: "The leading wellness team focused on fitness and nutrition",
                memberCount: 12,
                isMember: true,
                initials: "TA",
                teamPoints: 0
              },
              {
                id: 2,
                name: "Team Omega",
                description: "Focused on mindfulness and mental wellness challenges",
                memberCount: 8,
                isMember: false,
                initials: "TO",
                teamPoints: 0
              }
            ];
          } else {
            teams.value = await Promise.all(response.data.map(async team => {
              const words = team.name.split(' ');
              const initials = words.length > 1 
                ? `${words[0][0]}${words[1][0]}`
                : team.name.substring(0, 2);
              // Get team members
              const membersResponse = await listTeamMembers(team.id);
              const members = membersResponse.data || [];
              const isMember = members.some(member => member.id === userId.value);
              const memberCount = members.length;
              // Compute team points by calling the statistics endpoint for each member.
              const statsPromises = members.map(member => 
                getUserStatistics(member.id)
                  .then(statRes => {
                    console.log(`User ${member.id} stats:`, statRes.data);
                    // Use total_points instead of points
                    return parseInt(statRes.data?.total_points || 0, 10);
                  })
                  .catch(err => {
                    console.error(`Error fetching stats for user ${member.id}:`, err);
                    return 0; // Return 0 points if there's an error
                  })
              );
              const pointsArray = await Promise.all(statsPromises);
              console.log('Points array:', pointsArray);
              const teamPoints = pointsArray.reduce((sum, pts) => sum + pts, 0);
              return {
                ...team,
                initials: initials.toUpperCase(),
                isMember,
                memberCount,
                teamPoints
              };
            }));
          }
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
      };
  
      // Join a team and refresh teams list
      const joinTeam = async (teamId) => {
        try {
          const membersResponse = await listTeamMembers(teamId);
          const members = membersResponse.data || [];
          const alreadyMember = members.some(member => member.id === userId.value);
          if (!alreadyMember) {
            await addTeamMember(teamId, userId.value);
            await fetchTeams();
          }
        } catch (error) {
          console.error('Error joining team:', error);
        }
      };
  
      // View team details: fetch team members and compute total points
      const viewTeamDetails = async (teamId) => {
        try {
          const team = teams.value.find(t => t.id === teamId);
          if (team) {
            selectedTeam.value = team;
            const membersResponse = await listTeamMembers(teamId);
            const members = membersResponse.data || [];
            const memberStats = await Promise.all(
              members.map(async member => {
                try {
                  const statResponse = await getUserStatistics(member.id);
                  console.log(`Team details - User ${member.id} stats:`, statResponse.data);
                  return {
                    ...member,
                    points: parseInt(statResponse.data?.total_points || 0, 10)
                  };
                } catch (error) {
                  console.error(`Error fetching stats for user ${member.id}:`, error);
                  return {
                    ...member,
                    points: 0
                  };
                }
              })
            );
            teamMembers.value = memberStats;
            teamTotalPoints.value = memberStats.reduce((sum, member) => sum + member.points, 0);
            showTeamDetailsModal.value = true;
          }
        } catch (error) {
          console.error('Error viewing team details:', error);
        }
      };
  
      const closeTeamDetails = () => {
        showTeamDetailsModal.value = false;
        selectedTeam.value = {};
        teamMembers.value = [];
        teamTotalPoints.value = 0;
      };
  
      // Filter teams based on tab and search
      const filteredTeams = computed(() => {
        let filtered = [...teams.value];
        if (activeTab.value === 'my-teams') {
          filtered = filtered.filter(team => team.isMember);
        } else if (activeTab.value === 'all') {
          filtered = filtered.filter(team => !team.isMember);
        }
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(team =>
            team.name.toLowerCase().includes(query) ||
            team.description?.toLowerCase().includes(query)
          );
        }
        return filtered;
      });
  
      // Create a new team
      const createNewTeam = async () => {
        try {
          const response = await createTeam({ name: newTeam.value.name });
          const createdTeam = response.data;
          const words = createdTeam.name.split(' ');
          const initials = words.length > 1 
            ? `${words[0][0]}${words[1][0]}`
            : createdTeam.name.substring(0, 2);
          teams.value.unshift({
            ...createdTeam,
            isMember: true,
            memberCount: 1,
            initials: initials.toUpperCase(),
            teamPoints: 0
          });
          newTeam.value = { name: '' };
          showCreateTeamModal.value = false;
        } catch (error) {
          console.error('Error creating team:', error);
        }
      };
  
      onMounted(async () => {
        await fetchAllUsers();
        await fetchTeams();
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
        createNewTeam,
        showTeamDetailsModal,
        selectedTeam,
        teamMembers,
        teamTotalPoints,
        closeTeamDetails
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
    padding: 1.5rem;
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
  
  .team-points {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }
  
  .team-description {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
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
    padding: 1.5rem;
    background: var(--bg-card);
    border-radius: var(--radius-md);
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
  }
  
  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
