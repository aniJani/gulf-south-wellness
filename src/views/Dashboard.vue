<template>
    <div class="dashboard-page animate-fade-in">
      <div class="welcome-section">
        <div class="welcome-text">
          <h1>Welcome back, {{ userName }}</h1>
          <p>Here's an overview of your wellness journey</p>
        </div>
        <div class="date-display">
          <div class="date">{{ currentDate }}</div>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.challengesCompleted }}</div>
            <div class="stat-label">Challenges Completed</div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.points }}</div>
            <div class="stat-label">Total Points</div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.activitiesLogged }}</div>
            <div class="stat-label">Activities Logged</div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.challengesJoined }}</div>
            <div class="stat-label">Challenges Joined</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-grid">
        <div class="activity-chart-container card">
          <div class="card-header">
            <h2>{{ activeChartView === 'trends' ? 'Activity Trends' : 'Leaderboard' }}</h2>
            <div class="view-toggle">
              <button :class="{ active: activeChartView === 'trends' }" @click="activeChartView = 'trends'">Trends</button>
              <button :class="{ active: activeChartView === 'leaderboard' }" @click="setLeaderboardView('leaderboard')">Leaderboard</button>
            </div>
          </div>
          
          <!-- Activity Trends View -->
          <div v-if="activeChartView === 'trends'">
            <ActivityChart :chartData="chartData" />
          </div>
          
          <!-- Leaderboard View -->
          <div v-else class="leaderboard-container">
            <div class="leaderboard-tabs">
              <button :class="{ active: leaderboardType === 'users' }" @click="leaderboardType = 'users'">Users</button>
              <button :class="{ active: leaderboardType === 'teams' }" @click="leaderboardType = 'teams'">Teams</button>
            </div>
            
            <!-- Users Leaderboard -->
            <div v-if="leaderboardType === 'users'" class="leaderboard-list">
              <div v-for="(user, index) in userLeaderboard" :key="user.user_id" class="leaderboard-item">
                <div class="rank">{{ index + 1 }}</div>
                <div class="user-info">
                  <div class="username">{{ user.username || 'Anonymous User' }}</div>
                </div>
                <div class="points">{{ user.points }} points</div>
              </div>
              <div v-if="userLeaderboard.length === 0" class="no-data">No leaderboard data available</div>
            </div>
            
            <!-- Teams Leaderboard -->
            <div v-else class="leaderboard-list">
              <div v-for="(team, index) in teamLeaderboard" :key="team.team_id" class="leaderboard-item">
                <div class="rank">{{ index + 1 }}</div>
                <div class="team-info">
                  <div class="team-name">{{ team.team_name }}</div>
                  <div class="member-count">{{ team.member_count }} members</div>
                </div>
                <div class="points">{{ team.points }} points</div>
              </div>
              <div v-if="teamLeaderboard.length === 0" class="no-data">No team data available</div>
            </div>
          </div>
        </div>
        
        <div class="active-challenges card">
          <div class="card-header">
            <h2>{{ activeSection === 'challenges' ? 'My Challenges' : 'My Activities' }}</h2>
            <div class="actions-container">
              <div class="view-toggle">
                <button :class="{ active: activeSection === 'challenges' }" @click="activeSection = 'challenges'">Challenges</button>
                <button :class="{ active: activeSection === 'activities' }" @click="activeSection = 'activities'">Activities</button>
              </div>
              <router-link to="/challenges" class="view-all">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </router-link>
            </div>
          </div>
          
          <!-- Challenges View -->
          <div v-if="activeSection === 'challenges'">
            <div v-if="activeChallenges.length > 0" class="challenges-list">
              <div v-for="challenge in activeChallenges" :key="challenge.id" class="challenge-item">
                <div class="challenge-info">
                  <h3>{{ challenge.title }}</h3>
                  <div class="challenge-meta">
                    <span class="challenge-category" :class="challenge.category">{{ challenge.category }}</span>
                    <span class="challenge-status">Active</span>
                  </div>
                </div>
                <button class="secondary log-button" @click="handleCompleteChallenge(challenge.id)">
                  Complete
                </button>
              </div>
            </div>
            
            <div v-else class="no-challenges">
              <p>You have no active challenges.</p>
              <router-link to="/challenges" class="primary button">Browse Challenges</router-link>
            </div>
          </div>
          
          <!-- Activities View -->
          <div v-else>
            <div v-if="activeActivities.length > 0" class="challenges-list">
              <div v-for="activity in activeActivities" :key="activity.id" class="challenge-item">
                <div class="challenge-info">
                  <h3>{{ activity.title }}</h3>
                  <div class="challenge-meta">
                    <span>{{ activity.points }} points</span>
                  </div>
                </div>
                <button class="secondary log-button" @click="handleMarkActivityComplete(activity.id)">
                  Complete
                </button>
              </div>
            </div>
            
            <div v-else class="no-challenges">
              <p>You have no active activities.</p>
              <router-link to="/challenges?view=activities" class="primary button">Create Activity</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, onMounted, ref, watch } from 'vue';
import ActivityChart from '../components/ui/ActivityChart.vue';
import { completeActivity, completeChallenge, getActivitiesByUser, getTeamLeaderboard, getUserChallenges, getUsersLeaderboard, getUserStatistics } from '../services/api';
import { useAuthStore } from '../store/auth';
  
  export default {
    name: 'Dashboard',
    components: { ActivityChart },
    setup() {
      const authStore = useAuthStore();
      const userId = computed(() => authStore.user?.id || 1);
      const userName = computed(() => authStore.user?.full_name?.split(' ')[0] || 'User');
      
      const stats = ref({
        challengesCompleted: 0,
        points: 0,
        activitiesLogged: 0,
        challengesJoined: 0
      });
      
      // Active challenges using the API with ?completed=false
      const activeChallenges = ref([]);
      const activeSection = ref('challenges');
      const activeActivities = ref([]);
      
      const currentDate = computed(() => {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      });
      
      const chartData = ref({
        labels: [],
        datasets: []
      });
      
const fetchActivityChartData = async () => {
  try {
    // Add timestamp for cache busting
    const timestamp = new Date().getTime();
    
    // Get user's activities and completed challenges
    const [activitiesResponse, completedChallengesResponse] = await Promise.all([
      getActivitiesByUser(userId.value, { completed: true, timestamp }),
      getUserChallenges(userId.value, { completed: true, timestamp })
    ]);
    
    console.log('Completed activities:', activitiesResponse.data);
    console.log('Completed challenges:', completedChallengesResponse.data);
    
    if ((!activitiesResponse.data || activitiesResponse.data.length === 0) && 
        (!completedChallengesResponse.data || completedChallengesResponse.data.length === 0)) {
      setEmptyChartData();
      return;
    }
    
    const activities = activitiesResponse.data || [];
    const completedChallenges = completedChallengesResponse.data || [];
    
    const convertToUTC5 = (dateString) => {
      const date = new Date(dateString);
      const utc5Date = new Date(date.getTime() - 5 * 60 * 60 * 1000);
      return utc5Date;
    };
    
    // Helper to format date as YYYY-MM-DD
    const formatDateYMD = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // Helper to format date as M/D for display
    const formatDateMD = (date) => {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };
    
    const now = new Date();
    const nowUTC5 = convertToUTC5(now);
    
    const dateLabels = [];
    const dateGroups = {};
    const activityByDate = {};
    const challengesByDate = {};
    
    // Create arrays for the last 7 days (including today) in UTC-5
    for (let i = 6; i >= 0; i--) {
      const date = new Date(nowUTC5);
      date.setDate(date.getDate() - i);
      
      const formattedDate = formatDateMD(date);
      dateLabels.push(formattedDate);
      
      const dateKey = formatDateYMD(date);
      
      console.log(`Date key for i=${i}: ${dateKey} (display: ${formattedDate})`);
      
      dateGroups[dateKey] = 6 - i;
      activityByDate[dateKey] = 0;
      challengesByDate[dateKey] = 0;
    }
    
    activities.forEach(activity => {
      if (activity.completed_at) {
        const utc5Date = convertToUTC5(activity.completed_at);
        const dateKey = formatDateYMD(utc5Date);
        
        console.log(`Activity ${activity.id} completed UTC: ${activity.completed_at}, UTC-5: ${utc5Date.toISOString()}, key: ${dateKey}`);
        
        if (dateGroups.hasOwnProperty(dateKey)) {
          activityByDate[dateKey]++;
          console.log(`Activity counted for ${dateKey}`);
        } else {
          console.log(`Activity date ${dateKey} not in range`);
        }
      }
    });
    
    completedChallenges.forEach(challenge => {
      if (challenge.completed_at) {
        const utc5Date = convertToUTC5(challenge.completed_at);
        const dateKey = formatDateYMD(utc5Date);
        
        console.log(`Challenge ${challenge.id} completed UTC: ${challenge.completed_at}, UTC-5: ${utc5Date.toISOString()}, key: ${dateKey}`);
        
        if (dateGroups.hasOwnProperty(dateKey)) {
          challengesByDate[dateKey]++;
          console.log(`Challenge counted for ${dateKey}`);
        } else {
          console.log(`Challenge date ${dateKey} not in range`);
        }
      }
    });
    
    console.log('Activity counts by date:', activityByDate);
    console.log('Challenge counts by date:', challengesByDate);
    
    // Convert the grouped data back to arrays matching our date labels
    const activityCounts = new Array(7).fill(0);
    const challengeCounts = new Array(7).fill(0);
    
    Object.keys(activityByDate).forEach(dateKey => {
      if (dateGroups.hasOwnProperty(dateKey)) {
        const index = dateGroups[dateKey];
        activityCounts[index] = activityByDate[dateKey];
      }
    });
    
    Object.keys(challengesByDate).forEach(dateKey => {
      if (dateGroups.hasOwnProperty(dateKey)) {
        const index = dateGroups[dateKey];
        challengeCounts[index] = challengesByDate[dateKey];
      }
    });
    
    console.log('Final activity counts:', activityCounts);
    console.log('Final challenge counts:', challengeCounts);
    
    // Update chart data with dates and metrics
    chartData.value = {
      labels: dateLabels,
      datasets: [
        {
          label: 'Activities Completed',
          data: activityCounts,
          borderColor: '#bb86fc',
          tension: 0.4
        },
        {
          label: 'Challenges Completed',
          data: challengeCounts,
          borderColor: '#03dac6',
          tension: 0.4
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching activity chart data:', error);
    setEmptyChartData();
  }
};

const setEmptyChartData = () => {
  const now = new Date();
  const dateLabels = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dateLabels.push(`${date.getMonth() + 1}/${date.getDate()}`);
  }
  
  chartData.value = {
    labels: dateLabels,
    datasets: [
      {
        label: 'Activities Completed',
        data: Array(7).fill(0),
        borderColor: '#bb86fc',
        tension: 0.4
      },
      {
        label: 'Challenges Completed',
        data: Array(7).fill(0),
        borderColor: '#03dac6',
        tension: 0.4
      }
    ]
  };
};
      
// fetch activities part of fetchDashboardData
const fetchDashboardData = async () => {
  try {
    // Fetch user statistics 
    const statsResponse = await getUserStatistics(userId.value);
    if (statsResponse.data) {
      stats.value = {
        challengesCompleted: statsResponse.data.challenges_completed || 0,
        points: statsResponse.data.total_points || 0,
        activitiesLogged: statsResponse.data.activities_count || 0,
        challengesJoined: statsResponse.data.challenges_joined || 0 // Use challenges_joined instead of streak
      };
    }
    
    // Fetch active challenges - only get the latest 3, don't filter by progress
    const challengesResponse = await getUserChallenges(userId.value, { completed: false });
    if (challengesResponse.data && challengesResponse.data.length > 0) {
      activeChallenges.value = challengesResponse.data.slice(0, 3).map(challenge => ({
        ...challenge,
        is_active: true
      }));
    } else {
      activeChallenges.value = [];
    }

    // only get the latest 3 INCOMPLETE ones
    const activitiesResponse = await getActivitiesByUser(userId.value);
    if (activitiesResponse.data && activitiesResponse.data.length > 0) {
      activeActivities.value = activitiesResponse.data
        .filter(activity => !activity.is_completed)
        .slice(0, 3);
    } else {
      activeActivities.value = [];
    }

    // Fetch activity data for chart
    await fetchActivityChartData();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

const activeChartView = ref('trends');
const leaderboardType = ref('users');
const userLeaderboard = ref([]);
const teamLeaderboard = ref([]);

// Function to fetch leaderboard data
const fetchLeaderboardData = async () => {
  try {
    console.log('Fetching leaderboard data...');
    const [usersResponse, teamsResponse] = await Promise.all([
      getUsersLeaderboard(10), 
      getTeamLeaderboard()
    ]);
    
    console.log('Users leaderboard response:', usersResponse);
    console.log('Teams leaderboard response:', teamsResponse);
    
    userLeaderboard.value = usersResponse.data || [];
    teamLeaderboard.value = teamsResponse.data || [];
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
  }
};

const setLeaderboardView = (view) => {
  activeChartView.value = view;
  if (view === 'leaderboard') {
    fetchLeaderboardData();
  }
};
      
      const handleCompleteChallenge = async (challengeId) => {
        try {
          console.log('Completing challenge with ID:', challengeId);
          
          await completeChallenge(challengeId, userId.value);
          
          const challengeIndex = activeChallenges.value.findIndex(c => c.id === challengeId);
          if (challengeIndex !== -1) {
            activeChallenges.value.splice(challengeIndex, 1);
            console.log('Challenge removed from active list');
          }
          
          // Add a small delay before refreshing to allow backend to process
          setTimeout(async () => {
            await fetchDashboardData();
            console.log('Dashboard data refreshed after delay');
          }, 100);
          
          console.log('Challenge completed successfully!');
        } catch (error) {
          console.error('Error completing challenge:', error);
        }
      };

      const handleMarkActivityComplete = async (activityId) => {
        try {
          console.log('Completing activity with ID:', activityId);
          
          await completeActivity(activityId, userId.value);
          
          const activityIndex = activeActivities.value.findIndex(a => a.id === activityId);
          if (activityIndex !== -1) {
            activeActivities.value.splice(activityIndex, 1);
            console.log('Activity removed from active list');
          }
          
          await fetchDashboardData();
          console.log('Activity completed successfully!');
        } catch (error) {
          console.error('Error completing activity:', error);
        }
      };
      
      onMounted(() => {
        fetchDashboardData();
        fetchLeaderboardData(); 
      });
      
      return {
        userName,
        currentDate,
        stats,
        activeChallenges,
        activeActivities,
        activeSection,
        chartData,
        activeChartView,
        leaderboardType,
        userLeaderboard,
        teamLeaderboard,
        handleCompleteChallenge,
        handleMarkActivityComplete,
        setLeaderboardView
      };
    }
  };
  </script>
  
  <style scoped>
  .dashboard-page {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .welcome-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .welcome-text h1 {
    margin-bottom: 0.25rem;
    background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .welcome-text p {
    color: var(--text-secondary);
    margin-bottom: 0;
  }
  
  .date-display {
    padding: 0.75rem 1.25rem;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    font-weight: 500;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    padding: 1.25rem;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: rgba(187, 134, 252, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-primary);
    margin-right: 1rem;
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-value {
    font-size: 1.75rem;
    font-weight: 600;
    line-height: 1.2;
  }
  
  .stat-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.25rem 0;
  }
  
  .time-filter {
    display: flex;
    gap: 0.5rem;
  }
  
  .time-filter button {
    background: transparent;
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  
  .time-filter button:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .time-filter button.active {
    background: rgba(187, 134, 252, 0.1);
    color: var(--accent-primary);
  }
  
  .activity-chart-container {
    padding-bottom: 1.25rem;
  }
  
  .view-all {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--accent-primary);
    font-size: 0.875rem;
    text-decoration: none;
  }
  
  .challenges-list {
    padding: 0 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .challenge-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    transition: transform var(--transition-fast);
  }
  
  .challenge-item:hover {
    transform: translateX(5px);
  }
  
  .challenge-info {
    flex: 1;
  }
  
  .challenge-info h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .challenge-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  
  .challenge-category {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-full);
    text-transform: uppercase;
  }
  
  .challenge-category.fitness {
    background: var(--accent-primary);
    color: #121212;
  }
  
  .challenge-category.mindfulness {
    background: #03dac6;
    color: #121212;
  }
  
  .challenge-category.nutrition {
    background: #ff7597;
    color: #121212;
  }
  
  .challenge-category.wellness {
    background: #ffb74d;
    color: #121212;
  }
  
  .challenge-progress-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
  
  .progress-bar {
    height: 4px;
    background: var(--bg-card);
    border-radius: var(--radius-full);
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--accent-primary);
    border-radius: var(--radius-full);
  }
  
  .log-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .no-challenges {
    padding: 2rem 1.25rem;
    text-align: center;
    color: var(--text-secondary);
  }
  
  .no-challenges .button {
    margin-top: 1rem;
  }
  
  @media (max-width: 1024px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .welcome-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .date-display {
      align-self: flex-start;
    }
  }
  
  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }

  .actions-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
  
  .view-toggle {
    display: flex;
    gap: 0.5rem;
  }
  
  .view-toggle button {
    background: transparent;
    border: none;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-md);
  }
  
  .view-toggle button:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .view-toggle button.active {
    background: rgba(187, 134, 252, 0.1);
    color: var(--accent-primary);
  }

  .leaderboard-container {
  padding: 0 1.25rem 1.25rem;
}

.leaderboard-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.leaderboard-tabs button {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  position: relative;
  cursor: pointer;
}

.leaderboard-tabs button.active {
  color: var(--accent-primary);
}

.leaderboard-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent-primary);
  border-radius: 2px;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border-radius: var(--radius-md);
}

.rank {
  font-weight: 600;
  font-size: 1.25rem;
  min-width: 2rem;
  text-align: center;
}

.user-info, .team-info {
  flex: 1;
  margin-left: 0.75rem;
}

.username, .team-name {
  font-weight: 500;
}

.member-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.points {
  font-weight: 600;
  color: var(--accent-primary);
}

.no-data {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-secondary);
}
  </style>
