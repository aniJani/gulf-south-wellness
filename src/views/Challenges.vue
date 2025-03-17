<template>
    <div class="challenges-page animate-fade-in">
      <div class="page-header">
        <h1>Challenges & Activities</h1>
        <div class="view-toggle">
          <button :class="{ active: contentView === 'challenges' }" @click="contentView = 'challenges'">Challenges</button>
          <button :class="{ active: contentView === 'activities' }" @click="contentView = 'activities'">Activities</button>
        </div>
        <div v-if="contentView === 'challenges'" class="header-actions">
          <div class="search-container">
            <input type="text" placeholder="Search challenges..." v-model="searchQuery" class="search-input" />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
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
        <div v-else class="header-actions">
          <div class="search-container">
            <input type="text" placeholder="Search activities..." v-model="searchQuery" class="search-input" />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <button class="primary create-activity-btn" @click="showCreateActivityModal = true">
            Create Activity
          </button>
        </div>
      </div>
      
      <div v-if="contentView === 'challenges'">
        <div class="tabs">
          <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">All Challenges</button>
          <button :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'">My Active Challenges</button>
          <button :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">Completed</button>
        </div>
        
        <div class="challenges-grid">
          <div v-for="challenge in filteredChallenges" :key="challenge.id" class="challenge-card card">
            <div class="challenge-badge" :class="challenge.category">
              {{ challenge.category }}
            </div>
            <div class="challenge-content">
              <h3>{{ challenge.title }}</h3>
              <p>{{ challenge.description }}</p>
              <div class="challenge-details">
                <div class="detail-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{{ challenge.points }} points</span>
                </div>
              </div>
            </div>
            
            <div class="challenge-actions">
              <button v-if="!challenge.joined" class="primary" @click="handleJoinChallenge(challenge.id)">
                Join Challenge
              </button>
              <button v-else-if="challenge.joined && challenge.is_active" class="secondary" @click="handleCompleteChallenge(challenge.id)">
                Complete Challenge
              </button>
              <button v-else disabled>
                Completed
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredChallenges.length === 0" class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3>No challenges found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      </div>
      
      <div v-else-if="contentView === 'activities'">
        <div class="activities-grid">
          <div v-for="activity in filteredActivities" :key="activity.id" class="activity-card card">
            <h3>{{ activity.title }}</h3>
            <p>{{ activity.description }}</p>
            <div class="activity-details">
              <span>{{ activity.points }} points</span>
              <span>{{ new Date(activity.created_at).toLocaleDateString() }}</span>
            </div>
            <div class="activity-actions">
              <button v-if="!activity.is_completed" class="primary" @click="handleMarkActivityComplete(activity.id)">
                Mark Complete
              </button>
              <button v-else disabled>Completed</button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredActivities.length === 0" class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <h3>No activities found</h3>
          <p>Try adjusting your search</p>
        </div>
      </div>
      
      <div v-if="showCreateActivityModal" class="modal-overlay" @click="showCreateActivityModal = false">
        <div class="modal-content card" @click.stop>
          <div class="modal-header">
            <h2>Create New Activity</h2>
            <button class="close-button" @click="showCreateActivityModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="createNewActivity" class="modal-form">
            <div class="form-group">
              <label for="activity-title">Title</label>
              <input v-model="newActivity.title" type="text" id="activity-title" required placeholder="Enter activity title" />
            </div>
            
            <div class="form-group">
              <label for="activity-description">Description</label>
              <textarea v-model="newActivity.description" id="activity-description" rows="3" placeholder="Enter activity description"></textarea>
            </div>
            
            <div class="form-group">
              <label for="activity-points">Points</label>
              <input v-model.number="newActivity.points" type="number" id="activity-points" min="0" required placeholder="Enter points" />
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="showCreateActivityModal = false">Cancel</button>
              <button type="submit" class="primary">Create Activity</button>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  </template>
  
  <script>
  import { computed, onMounted, ref } from 'vue';
import {
    completeActivity,
    completeChallenge,
    createActivity,
    getActivitiesByUser,
    getChallenges,
    getUserChallenges,
    joinChallenge
} from '../services/api';
import { useAuthStore } from '../store/auth';
  
  export default {
    name: 'Challenges',
    setup() {
      const authStore = useAuthStore();
      const userId = computed(() => authStore.user?.id || 1);
      
      // Main view toggle challenges or activities
      const contentView = ref('challenges');
      
      // allChallenges: challenges from public endpoint
      const allChallenges = ref([]);
      // userActiveChallenges: joined challenges that are still active
      const userActiveChallenges = ref([]);
      // userCompletedChallenges: joined challenges that are completed
      const userCompletedChallenges = ref([]);
      
      // "all" shows public challenges that are NOT joined
      // "active" shows userActiveChallenges
      // "completed" shows userCompletedChallenges
      const activeTab = ref('all');
      
      const filteredChallenges = computed(() => {
        let list = [];
        if (activeTab.value === 'all') {
          // Get IDs of all user's challenges (both active and completed)
          const userChallengeIds = new Set([
            ...userActiveChallenges.value.map(c => c.id),
            ...userCompletedChallenges.value.map(c => c.id)
          ]);
          
          // Filter to show only challenges that aren't in user's lists
          list = allChallenges.value.filter(challenge => !userChallengeIds.has(challenge.id));
        } else if (activeTab.value === 'active') {
          list = userActiveChallenges.value;
        } else if (activeTab.value === 'completed') {
          list = userCompletedChallenges.value;
        }
        
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          list = list.filter(challenge =>
            challenge.title.toLowerCase().includes(query) ||
            challenge.description.toLowerCase().includes(query)
          );
        }
        if (categoryFilter.value) {
          list = list.filter(challenge => challenge.category === categoryFilter.value);
        }
        return list;
      });
      
      const activities = ref([]);
      const filteredActivities = computed(() => {
        let filtered = [...activities.value];
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(activity =>
            activity.title.toLowerCase().includes(query) ||
            (activity.description && activity.description.toLowerCase().includes(query))
          );
        }
        return filtered;
      });
      
      const searchQuery = ref('');
      const categoryFilter = ref('');
      
      const getChallengeDuration = (challenge) => {
        if (challenge.start_date && challenge.end_date) {
          const start = new Date(challenge.start_date);
          const end = new Date(challenge.end_date);
          const diffInMs = end - start;
          const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
          return days + " days";
        }
        return "N/A";
      };
      
      const handleJoinChallenge = async (challengeId) => {
        try {
          await joinChallenge(challengeId, userId.value);
          
          // Find the challenge in allChallenges
          const challenge = allChallenges.value.find(c => c.id === challengeId);
          if (challenge) {
            challenge.joined = true;
            challenge.is_active = true;
            
            const newActiveChallenge = {
              ...challenge,
              joined: true, 
              is_active: true,
              progress: 0 
            };
            
            userActiveChallenges.value.push(newActiveChallenge);
          }
        } catch (error) {
          console.error('Error joining challenge:', error);
        }
      };
      
      const handleCompleteChallenge = async (challengeId) => {
        try {
          const result = await completeChallenge(challengeId, userId.value);
          console.log(result.message);
          
          // Find the challenge in active challenges
          const challengeIndex = userActiveChallenges.value.findIndex(c => c.id === challengeId);
          if (challengeIndex !== -1) {
            // Remove from active challenges
            const completedChallenge = userActiveChallenges.value[challengeIndex];
            userActiveChallenges.value.splice(challengeIndex, 1);
            
            completedChallenge.is_active = false;
            completedChallenge.progress = 100;
            userCompletedChallenges.value.push(completedChallenge);
          }
          
          const challengeInAll = allChallenges.value.find(c => c.id === challengeId);
          if (challengeInAll) {
            challengeInAll.joined = true;
            challengeInAll.is_active = false;
          }
        } catch (error) {
          console.error('Error completing challenge:', error);
        }
      };
      
      const handleMarkActivityComplete = async (activityId) => {
        try {
          await completeActivity(activityId, userId.value);
          const activity = activities.value.find(a => a.id === activityId);
          if (activity) {
            activity.is_completed = true;
          }
        } catch (error) {
          console.error('Error completing activity:', error);
        }
      };
      
      // Create Activity Modal State and Functionality
      const showCreateActivityModal = ref(false);
      const newActivity = ref({
        title: '',
        description: '',
        points: 0
      });
      
      const createNewActivity = async () => {
        try {
          const response = await createActivity(userId.value, newActivity.value);
          const createdActivity = response.data;
          activities.value.unshift(createdActivity);
          newActivity.value = { title: '', description: '', points: 0 };
          showCreateActivityModal.value = false;
        } catch (error) {
          console.error('Error creating activity:', error);
        }
      };
      
      // Fetch all challenges from the public endpoint
      const fetchAllChallenges = async () => {
        try {
          const response = await getChallenges({ weekly: false, skip: 0, limit: 10 });
          // Mark challenges as not joined initially
          allChallenges.value = (response.data || []).map(challenge => ({
            ...challenge,
            joined: false
          }));
        } catch (error) {
          console.error('Error fetching all challenges:', error);
        }
      };
      
      // Fetch user's joined challenges separately
      const fetchUserChallenges = async () => {
        try {
          const activeResponse = await getUserChallenges(userId.value, { completed: false });
          userActiveChallenges.value = (activeResponse.data || []).map(challenge => ({
            ...challenge,
            joined: true, // Add joined property
            is_active: true // Make sure is_active is true
          }));
    
          const completedResponse = await getUserChallenges(userId.value, { completed: true });
          userCompletedChallenges.value = (completedResponse.data || []).map(challenge => ({
            ...challenge,
            joined: true, // Add joined property
            is_active: false // For completed challenges, is_active should be false
          }));
        } catch (error) {
          console.error('Error fetching user challenges:', error);
        }
      };
      
      const fetchActivities = async () => {
        try {
          const response = await getActivitiesByUser(userId.value, { skip: 0, limit: 50 });
          activities.value = response.data || [];
        } catch (error) {
          console.error('Error fetching activities:', error);
        }
      };
      
      onMounted(() => {
        fetchAllChallenges();
        fetchUserChallenges();
        fetchActivities();
      });
      
      return {
        contentView,
        searchQuery,
        categoryFilter,
        activeTab,
        filteredChallenges,
        activities,
        filteredActivities,
        getChallengeDuration,
        handleJoinChallenge,
        handleCompleteChallenge,
        handleMarkActivityComplete,
        showCreateActivityModal,
        newActivity,
        createNewActivity
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
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  .view-toggle {
    display: flex;
    gap: 1rem;
  }
  .view-toggle button {
    background: transparent;
    border: none;
    padding: 0.5rem 1rem;
    font-weight: 500;
    color: var(--text-secondary);
    position: relative;
  }
  .view-toggle button.active {
    color: var(--accent-primary);
  }
  .view-toggle button.active::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-primary);
    border-radius: 2px;
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
  .filter-container {
    min-width: 150px;
  }
  .filter-select {
    width: 100%;
  }
  .create-activity-btn {
    padding: 0.5rem 1rem;
    background: var(--accent-primary);
    color: #121212;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
  }
  .create-activity-btn:hover {
    opacity: 0.9;
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
  .challenges-grid,
  .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  .challenge-card,
  .activity-card {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
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
  .challenge-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .activity-card {
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
  }
  .activity-details {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
  .activity-actions {
    margin-top: 1rem;
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
    .challenges-grid, .activities-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
