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
            <div class="stat-value">{{ stats.currentStreak }}</div>
            <div class="stat-label">Day Streak</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-grid">
        <div class="activity-chart-container card">
          <div class="card-header">
            <h2>Activity Trends</h2>
            <div class="time-filter">
              <button 
                v-for="period in timePeriods" 
                :key="period.value" 
                :class="{ active: selectedPeriod === period.value }"
                @click="selectedPeriod = period.value"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
          <ActivityChart :chartData="chartData" />
        </div>
        
        <div class="active-challenges card">
          <div class="card-header">
            <h2>Active Challenges</h2>
            <router-link to="/challenges" class="view-all">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </router-link>
          </div>
          
          <div v-if="activeChallenges.length > 0" class="challenges-list">
            <div v-for="challenge in activeChallenges" :key="challenge.id" class="challenge-item">
              <div class="challenge-info">
                <h3>{{ challenge.title }}</h3>
                <div class="challenge-meta">
                  <span class="challenge-category" :class="challenge.category">{{ challenge.category }}</span>
                  <span class="challenge-progress-text">{{ challenge.progress }}% Complete</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: `${challenge.progress}%` }"></div>
                </div>
              </div>
              <button class="secondary log-button" @click="logActivity(challenge.id)">
                Log
              </button>
            </div>
          </div>
          
          <div v-else class="no-challenges">
            <p>You have no active challenges.</p>
            <router-link to="/challenges" class="primary button">Browse Challenges</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, onMounted, ref } from 'vue';
import ActivityChart from '../components/ui/ActivityChart.vue';
import { completeActivity, getUserChallenges, getUserStatistics } from '../services/api';
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
        currentStreak: 0
      });
      
      const activeChallenges = ref([]);
      const selectedPeriod = ref('week');
      
      const timePeriods = [
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
        { label: 'Year', value: 'year' }
      ];
      
      const currentDate = computed(() => {
        const now = new Date();
        return now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      });
      
      // Chart data based on selected time period
      const chartData = computed(() => {
        let labels = [];
        let data1 = [];
        let data2 = [];
        
        if (selectedPeriod.value === 'week') {
          labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          data1 = [5, 8, 12, 4, 9, 6, 10];
          data2 = [3, 5, 8, 2, 7, 4, 6];
        } else if (selectedPeriod.value === 'month') {
          labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
          data1 = [42, 38, 55, 47];
          data2 = [28, 22, 31, 25];
        } else {
          labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          data1 = [150, 180, 210, 190, 220, 240, 200, 230, 210, 250, 270, 290];
          data2 = [90, 110, 130, 120, 140, 150, 130, 140, 120, 160, 170, 180];
        }
        
        return {
          labels,
          datasets: [
            {
              label: 'Activities',
              data: data1,
              borderColor: '#bb86fc',
              tension: 0.4
            },
            {
              label: 'Points',
              data: data2,
              borderColor: '#03dac6',
              tension: 0.4
            }
          ]
        };
      });
      
      const fetchDashboardData = async () => {
        try {
          // Fetch user statistics
          const statsResponse = await getUserStatistics(userId.value);
          if (statsResponse.data) {
            stats.value = statsResponse.data;
          } else {
            // Sample data if API returns empty
            stats.value = {
              challengesCompleted: 12,
              points: 450,
              activitiesLogged: 28,
              currentStreak: 5
            };
          }
          
          // Fetch user challenges
          const challengesResponse = await getUserChallenges(userId.value);
          if (challengesResponse.data && challengesResponse.data.length > 0) {
            // Filter only active challenges (progress < 100%)
            activeChallenges.value = challengesResponse.data
              .filter(challenge => challenge.progress < 100)
              .slice(0, 3); // Show only top 3
          } else {
            // Sample data if API returns empty
            activeChallenges.value = [
              {
                id: 1,
                title: "10,000 Steps Challenge",
                category: "fitness",
                progress: 65
              },
              {
                id: 2,
                title: "Meditation Master",
                category: "mindfulness",
                progress: 30
              },
              {
                id: 3,
                title: "Hydration Hero",
                category: "nutrition",
                progress: 90
              }
            ];
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };
      
      const logActivity = async (challengeId) => {
        try {
          await completeActivity(challengeId, userId.value);
          
          // Update local state
          const challenge = activeChallenges.value.find(c => c.id === challengeId);
          if (challenge) {
            challenge.progress += 10; // Increment progress by 10%
            if (challenge.progress > 100) challenge.progress = 100;
            
            // If challenge is now complete, remove it from active challenges
            if (challenge.progress === 100) {
              activeChallenges.value = activeChallenges.value.filter(c => c.id !== challengeId);
              stats.value.challengesCompleted++;
            }
            
            stats.value.activitiesLogged++;
            stats.value.points += 10; // Assume 10 points per activity
          }
        } catch (error) {
          console.error('Error logging activity:', error);
        }
      };
      
      onMounted(() => {
        fetchDashboardData();
      });
      
      return {
        userName,
        currentDate,
        stats,
        activeChallenges,
        chartData,
        timePeriods,
        selectedPeriod,
        logActivity
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
  </style>