<template>
    <div class="challenges-page animate-fade-in">
      <div class="page-header">
        <h1>Challenges & Activities</h1>
        <div class="header-actions">
          <div class="search-container">
            <input type="text" placeholder="Search challenges..." v-model="searchQuery" class="search-input" />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div class="filter-container">
            <select v-model="categoryFilter" class="filter-select">
              <option value="">All Categories</option>
              <option value="fitness">Fitness</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="nutrition">Nutrition</option>
              <option value="wellness">Wellness</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="tabs">
        <button 
          :class="{ active: activeTab === 'all' }" 
          @click="activeTab = 'all'"
        >
          All Challenges
        </button>
        <button 
          :class="{ active: activeTab === 'active' }" 
          @click="activeTab = 'active'"
        >
          My Active Challenges
        </button>
        <button 
          :class="{ active: activeTab === 'completed' }" 
          @click="activeTab = 'completed'"
        >
          Completed
        </button>
      </div>
      
      <div class="challenges-grid">
        <div 
          v-for="challenge in filteredChallenges" 
          :key="challenge.id" 
          class="challenge-card card"
        >
          <div class="challenge-badge" :class="challenge.category">
            {{ challenge.category }}
          </div>
          <div class="challenge-content">
            <h3>{{ challenge.title }}</h3>
            <p>{{ challenge.description }}</p>
            
            <div class="challenge-details">
              <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{{ challenge.duration }} days</span>
              </div>
              <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{{ challenge.difficulty }}</span>
              </div>
              <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>{{ challenge.points }} points</span>
              </div>
            </div>
            
            <div v-if="challenge.joined" class="challenge-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${challenge.progress}%` }"></div>
              </div>
              <div class="progress-text">{{ challenge.progress }}% Complete</div>
            </div>
          </div>
          
          <div class="challenge-actions">
            <button 
              v-if="!challenge.joined" 
              class="primary" 
              @click="joinChallenge(challenge.id)"
            >
              Join Challenge
            </button>
            <button 
              v-else-if="challenge.progress < 100" 
              class="secondary" 
              @click="completeActivity(challenge.id)"
            >
              Log Activity
            </button>
            <button 
              v-else 
              disabled
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="filteredChallenges.length === 0" class="no-results">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h3>No challenges found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, onMounted, ref } from 'vue';
import { completeActivity, getChallenges, getUserChallenges, joinChallenge } from '../services/api';
import { useAuthStore } from '../store/auth';
  
  export default {
    name: 'Challenges',
    setup() {
      const authStore = useAuthStore();
      const userId = computed(() => authStore.user?.id || 1);
      
      const challenges = ref([]);
      const userChallenges = ref([]);
      const searchQuery = ref('');
      const categoryFilter = ref('');
      const activeTab = ref('all');
      
      const filteredChallenges = computed(() => {
        let filtered = [...challenges.value];
        
        // Filter by tab
        if (activeTab.value === 'active') {
          filtered = filtered.filter(challenge => challenge.joined && challenge.progress < 100);
        } else if (activeTab.value === 'completed') {
          filtered = filtered.filter(challenge => challenge.joined && challenge.progress === 100);
        }
        
        // Filter by search query
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(challenge => 
            challenge.title.toLowerCase().includes(query) || 
            challenge.description.toLowerCase().includes(query)
          );
        }
        
        // Filter by category
        if (categoryFilter.value) {
          filtered = filtered.filter(challenge => challenge.category === categoryFilter.value);
        }
        
        return filtered;
      });
      
      const fetchChallenges = async () => {
        try {
          const response = await getChallenges({ weekly: false, skip: 0, limit: 20 });
          const userChallengesResponse = await getUserChallenges(userId.value);
          
          userChallenges.value = userChallengesResponse.data || [];
          
          // Map challenges with user participation data
          challenges.value = (response.data || []).map(challenge => {
            const userChallenge = userChallenges.value.find(uc => uc.id === challenge.id);
            return {
              ...challenge,
              joined: !!userChallenge,
              progress: userChallenge ? userChallenge.progress : 0
            };
          });
          
          // If no data from API, use sample data
          if (challenges.value.length === 0) {
            challenges.value = [
              {
                id: 1,
                title: "10,000 Steps Challenge",
                description: "Walk 10,000 steps every day for a week to improve cardiovascular health and boost energy levels.",
                category: "fitness",
                duration: 7,
                difficulty: "Medium",
                points: 100,
                joined: true,
                progress: 65
              },
              {
                id: 2,
                title: "Meditation Master",
                description: "Practice mindfulness meditation for 10 minutes daily to reduce stress and improve mental clarity.",
                category: "mindfulness",
                duration: 14,
                difficulty: "Easy",
                points: 75,
                joined: true,
                progress: 30
              },
              {
                id: 3,
                title: "Hydration Hero",
                description: "Drink 8 glasses of water daily to stay properly hydrated and support overall health.",
                category: "nutrition",
                duration: 21,
                difficulty: "Easy",
                points: 50,
                joined: true,
                progress: 90
              },
              {
                id: 4,
                title: "Sleep Well",
                description: "Get 8 hours of sleep for 5 consecutive nights to improve recovery and cognitive function.",
                category: "wellness",
                duration: 5,
                difficulty: "Medium",
                points: 80,
                joined: false,
                progress: 0
              },
              {
                id: 5,
                title: "Strength Training",
                description: "Complete 3 strength training sessions per week to build muscle and increase metabolism.",
                category: "fitness",
                duration: 28,
                difficulty: "Hard",
                points: 120,
                joined: false,
                progress: 0
              },
              {
                id: 6,
                title: "Digital Detox",
                description: "Reduce screen time by 50% for one week to improve focus and mental wellbeing.",
                category: "mindfulness",
                duration: 7,
                difficulty: "Hard",
                points: 90,
                joined: false,
                progress: 0
              },
              {
                id: 7,
                title: "Plant-Based Days",
                description: "Eat plant-based meals for 3 days a week to explore new foods and reduce environmental impact.",
                category: "nutrition",
                duration: 21,
                difficulty: "Medium",
                points: 85,
                joined: false,
                progress: 0
              },
              {
                id: 8,
                title: "Gratitude Journal",
                description: "Write down three things you're grateful for each day to foster positivity and mindfulness.",
                category: "wellness",
                duration: 14,
                difficulty: "Easy",
                points: 60,
                joined: false,
                progress: 0
              }
            ];
          }
        } catch (error) {
          console.error('Error fetching challenges:', error);
        }
      };
      
      const handleJoinChallenge = async (challengeId) => {
        try {
          await joinChallenge(challengeId, userId.value);
          // Update local state
          const challenge = challenges.value.find(c => c.id === challengeId);
          if (challenge) {
            challenge.joined = true;
            challenge.progress = 0;
          }
        } catch (error) {
          console.error('Error joining challenge:', error);
        }
      };
      
      const handleCompleteActivity = async (challengeId) => {
        try {
          await completeActivity(challengeId, userId.value);
          // Update local state
          const challenge = challenges.value.find(c => c.id === challengeId);
          if (challenge) {
            challenge.progress += 10; // Increment progress by 10%
            if (challenge.progress > 100) challenge.progress = 100;
          }
        } catch (error) {
          console.error('Error completing activity:', error);
        }
      };
      
      onMounted(() => {
        fetchChallenges();
      });
      
      return {
        challenges,
        filteredChallenges,
        searchQuery,
        categoryFilter,
        activeTab,
        joinChallenge: handleJoinChallenge,
        completeActivity: handleCompleteActivity
      };
    }
  };
  </script>
  
  <style scoped>
  .challenges-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .search-container {
    position: relative;
  }
  
  .search-input {
    padding-right: 2.5rem;
    width: 250px;
  }
  
  .search-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }
  
  .filter-select {
    min-width: 150px;
  }
  
  .tabs {
    display: flex;
    gap: 1rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.5rem;
  }
  
  .tabs button {
    background: transparent;
    border: none;
    padding: 0.5rem 1rem;
    color: var(--text-secondary);
    font-weight: 500;
    position: relative;
  }
  
  .tabs button:hover {
    color: var(--text-primary);
    background: transparent;
  }
  
  .tabs button.active {
    color: var(--accent-primary);
  }
  
  .tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-primary);
    border-radius: 2px;
  }
  
  .challenges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .challenge-card {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
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
  
  .challenge-content {
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .challenge-details {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: auto;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
  
  .challenge-progress {
    margin-top: 1rem;
  }
  
  .progress-bar {
    height: 6px;
    background: var(--bg-tertiary);
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--accent-primary);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
  
  .challenge-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
  }
  
  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    color: var(--text-secondary);
    text-align: center;
  }
  
  .no-results svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .header-actions {
      width: 100%;
    }
  
    .search-input {
      width: 100%;
    }
  
    .tabs {
      overflow-x: auto;
      padding-bottom: 0.75rem;
    }
  
    .tabs button {
      white-space: nowrap;
    }
  }
  </style>