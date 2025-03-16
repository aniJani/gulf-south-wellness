<template>
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Welcome Back, {{ userName }}</h1>
        <div class="date-display">{{ currentDate }}</div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>Challenges Completed</h3>
            <div class="stat-value">{{ userStats.challengesCompleted || 0 }}</div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>Total Points</h3>
            <div class="stat-value">{{ challengeStats.points || 0 }}</div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="stat-content">
            <h3>Team Rank</h3>
            <div class="stat-value">{{ userStats.teamRank || 'N/A' }}</div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>Current Streak</h3>
            <div class="stat-value">{{ userStats.currentStreak || 0 }} days</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-grid">
        <div class="chart-section card">
          <div class="card-header">
            <h2>Activity Progress</h2>
            <div class="time-filter">
              <button :class="{ active: timeFilter === 'week' }" @click="setTimeFilter('week')">Week</button>
              <button :class="{ active: timeFilter === 'month' }" @click="setTimeFilter('month')">Month</button>
              <button :class="{ active: timeFilter === 'year' }" @click="setTimeFilter('year')">Year</button>
            </div>
          </div>
          <ActivityChart :chartData="activityChartData" />
        </div>
        
        <div class="leaderboard-section card">
          <h2>Top Performers</h2>
          <div class="leaderboard">
            <div v-for="(user, index) in leaderboard" :key="user.id" class="leaderboard-item">
              <div class="leaderboard-rank" :class="{ 'top-rank': index < 3 }">{{ index + 1 }}</div>
              <div class="leaderboard-avatar">{{ user.initials }}</div>
              <div class="leaderboard-info">
                <div class="leaderboard-name">{{ user.name }}</div>
                <div class="leaderboard-team">{{ user.team }}</div>
              </div>
              <div class="leaderboard-points">{{ user.points }} pts</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="challenges-section">
        <div class="section-header">
          <h2>Active Challenges</h2>
          <router-link to="/challenges" class="view-all">View All</router-link>
        </div>
        
        <div class="challenges-grid">
          <div v-for="challenge in activeChallenges" :key="challenge.id" class="challenge-card card">
            <div class="challenge-badge" :class="challenge.category">{{ challenge.category }}</div>
            <h3>{{ challenge.title }}</h3>
            <p>{{ challenge.description }}</p>
            <div class="challenge-meta">
              <div class="challenge-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${challenge.progress}%` }"></div>
                </div>
                <div class="progress-text">{{ challenge.progress }}% Complete</div>
              </div>
              <div class="challenge-points">{{ challenge.points }} pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, onMounted, ref } from 'vue';
import ActivityChart from '../components/ui/ActivityChart.vue';
import { getChallengeStatistics, getUserChallenges, getUsersLeaderboard, getUserStatistics } from '../services/api';
import { useAuthStore } from '../store/auth';
  
  export default {
    name: 'Dashboard',
    components: { ActivityChart },
    setup() {
      const authStore = useAuthStore();
      const userId = computed(() => authStore.user?.id || 1);
      const userName = computed(() => authStore.user?.full_name || 'User');
      
      const userStats = ref({});
      const challengeStats = ref({});
      const activeChallenges = ref([]);
      const leaderboard = ref([]);
      const timeFilter = ref('week');
      
      const currentDate = computed(() => {
        const now = new Date();
        return now.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      });
      
      // Sample chart data - replace with actual API data
      const activityChartData = ref({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Activities',
            data: [5, 8, 3, 10, 7, 12, 6],
            borderColor: '#bb86fc',
            backgroundColor: 'rgba(187, 134, 252, 0.2)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Points',
            data: [20, 35, 15, 45, 30, 55, 25],
            borderColor: '#03dac6',
            backgroundColor: 'rgba(3, 218, 198, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      });
      
      const setTimeFilter = (filter) => {
        timeFilter.value = filter;
        // Update chart data based on selected time filter
        // This would typically fetch new data from the API
        if (filter === 'week') {
          activityChartData.value.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        } else if (filter === 'month') {
          activityChartData.value.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        } else {
          activityChartData.value.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        }
      };
      
      const fetchDashboardData = async () => {
        try {
          // Fetch user statistics
          const userStatsResponse = await getUserStatistics(userId.value);
          userStats.value = userStatsResponse.data || {
            challengesCompleted: 12,
            teamRank: 3,
            currentStreak: 5
          };
          
          // Fetch challenge statistics
          const challengeStatsResponse = await getChallengeStatistics(1);
          challengeStats.value = challengeStatsResponse.data || {
            points: 450
          };
          
          // Fetch active challenges
          const userChallengesResponse = await getUserChallenges(userId.value);
          activeChallenges.value = userChallengesResponse.data || [
            {
              id: 1,
              title: "10,000 Steps Challenge",
              description: "Walk 10,000 steps every day for a week",
              category: "fitness",
              progress: 65,
              points: 100
            },
            {
              id: 2,
              title: "Meditation Master",
              description: "Meditate for 10 minutes daily",
              category: "mindfulness",
              progress: 30,
              points: 75
            },
            {
              id: 3,
              title: "Hydration Hero",
              description: "Drink 8 glasses of water daily",
              category: "nutrition",
              progress: 90,
              points: 50
            },
            {
              id: 4,
              title: "Sleep Well",
              description: "Get 8 hours of sleep for 5 consecutive nights",
              category: "wellness",
              progress: 40,
              points: 80
            }
          ];
          
          // Fetch leaderboard
          const leaderboardResponse = await getUsersLeaderboard(5);
          leaderboard.value = leaderboardResponse.data || [
            { id: 1, name: "Jane Smith", team: "Team Alpha", points: 780, initials: "JS" },
            { id: 2, name: "John Doe", team: "Team Omega", points: 720, initials: "JD" },
            { id: 3, name: "Alex Johnson", team: "Team Alpha", points: 695, initials: "AJ" },
            { id: 4, name: "Sam Wilson", team: "Team Beta", points: 650, initials: "SW" },
            { id: 5, name: "Taylor Kim", team: "Team Gamma", points: 610, initials: "TK" }
          ];
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };
      
      onMounted(() => {
        fetchDashboardData();
      });
      
      return {
        userName,
        currentDate,
        userStats,
        challengeStats,
        activeChallenges,
        leaderboard,
        activityChartData,
        timeFilter,
        setTimeFilter
      };
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .date-display {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--bg-tertiary);
    color: var(--accent-primary);
  }
  
  .stat-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stat-value {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
  }
  
  .chart-section, .leaderboard-section {
    padding: 1.5rem;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .time-filter {
    display: flex;
    gap: 0.5rem;
  }
  
  .time-filter button {
    background: var(--bg-tertiary);
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
  
  .time-filter button.active {
    background: var(--accent-primary);
    color: #121212;
  }
  
  .leaderboard {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .leaderboard-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 8px;
    background: var(--bg-tertiary);
  }
  
  .leaderboard-rank {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--bg-card);
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .leaderboard-rank.top-rank {
    background: var(--accent-primary);
    color: #121212;
  }
  
  .leaderboard-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
  }
  
  .leaderboard-info {
    flex: 1;
  }
  
  .leaderboard-name {
    font-weight: 500;
  }
  
  .leaderboard-team {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
  
  .leaderboard-points {
    font-weight: 600;
    color: var(--accent-primary);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .view-all {
    font-size: 0.9rem;
  }
  
  .challenges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .challenge-card {
    position: relative;
    padding: 1.5rem;
  }
  
  .challenge-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .challenge-badge.fitness {
    background: var(--accent-primary);
    color: #121212;
  }
  
  .challenge-badge.mindfulness {
    background: #03dac6;
    color: #121212;
  }
  
  .challenge-badge.nutrition {
    background: #ff7597;
    color: #121212;
  }
  
  .challenge-badge.wellness {
    background: #ffb74d;
    color: #121212;
  }
  
  .challenge-meta {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .challenge-progress {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .progress-bar {
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--accent-primary);
    border-radius: 4px;
  }
  
  .progress-text {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
  
  .challenge-points {
    font-weight: 600;
    color: var(--accent-primary);
    align-self: flex-end;
  }
  
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>