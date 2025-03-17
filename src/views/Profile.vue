<template>
    <div class="profile-page animate-fade-in">
      <div class="profile-header">
        <div class="profile-cover"></div>
        <div class="profile-info">
          <div class="profile-avatar">
            {{ userInitials }}
          </div>
          <div class="profile-details">
            <h1>{{ user?.full_name || 'User Name' }}</h1>
            <p class="profile-username">@{{ user?.username || 'username' }}</p>
          </div>
          <button class="edit-profile-btn" @click="isEditing = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Profile
          </button>
        </div>
      </div>
      
      <div class="profile-content">
        <div class="profile-sidebar">
          <div class="profile-card card">
            <h3>Profile Info</h3>
            <div class="profile-field">
              <div class="field-label">Email</div>
              <div class="field-value">{{ user?.email || 'email@example.com' }}</div>
            </div>
            <div class="profile-field">
              <div class="field-label">Member Since</div>
              <div class="field-value">{{ formattedJoinDate }}</div>
            </div>
          </div>
          
          <div class="stats-card card">
            <h3>Your Stats</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ userStats.challengesCompleted || 0 }}</div>
                <div class="stat-label">Challenges Completed</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.points || 0 }}</div>
                <div class="stat-label">Points</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.activitiesCompleted || 0 }}</div>
                <div class="stat-label">Activities Completed</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.activitiesLogged || 0 }}</div>
                <div class="stat-label">Activities Created</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-main">
          <!-- Activities Card with Tabbed Interface -->
          <div class="activity-card card">
            <h3>Your Activities</h3>
            <div class="activities-tabs">
              <button :class="{ active: activitiesTab === 'all' }" @click="activitiesTab = 'all'">All</button>
              <button :class="{ active: activitiesTab === 'completed' }" @click="activitiesTab = 'completed'">Completed</button>
              <button :class="{ active: activitiesTab === 'pending' }" @click="activitiesTab = 'pending'">Pending</button>
            </div>
            <div v-if="filteredActivities.length > 0" class="activity-timeline">
              <div v-for="activity in filteredActivities" :key="activity.id" class="timeline-item">
                <div class="timeline-icon">
                  <svg v-if="activity.is_completed" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <div class="timeline-content">
                  <div class="timeline-title">{{ activity.title }}</div>
                  <div class="timeline-description">{{ activity.description }}</div>
                  <div class="timeline-date">{{ formatDate(activity.created_at) }}</div>
                </div>
              </div>
            </div>
            <div v-else class="no-activities">
              <p>No activities found for this tab.</p>
            </div>
          </div>
          
          <div class="challenges-card card">
            <h3>Your Challenges</h3>
            <div class="challenges-tabs">
              <button :class="{ active: challengesTab === 'active' }" @click="challengesTab = 'active'">
                Active
              </button>
              <button :class="{ active: challengesTab === 'completed' }" @click="challengesTab = 'completed'">
                Completed
              </button>
            </div>
            
            <div v-if="filteredChallenges.length > 0" class="challenges-list">
              <div v-for="challenge in filteredChallenges" :key="challenge.id" class="challenge-item">
                <div class="challenge-info">
                  <h4>{{ challenge.title }}</h4>
                  <div class="challenge-meta">
                    <span class="challenge-points">{{ challenge.points }} pts</span>
                    <!-- <span class="challenge-status" :class="{ active: challenge.is_active, completed: !challenge.is_active }">
                      {{ challenge.is_active ? 'Active' : 'Completed' }}
                    </span> -->
                  </div>
                  <div v-if="challenge.start_date && challenge.end_date" class="challenge-dates">
                    {{ formatDate(challenge.completed_at) }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-challenges">
              <p v-if="challengesTab === 'active'">You have no active challenges.</p>
              <p v-else>You haven't completed any challenges yet.</p>
              <router-link to="/challenges" class="view-challenges-btn">Browse Challenges</router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="isEditing" class="modal-overlay" @click="isEditing = false">
        <div class="modal-content card" @click.stop>
          <div class="modal-header">
            <h2>Edit Profile</h2>
            <button class="close-button" @click="isEditing = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="updateProfile" class="modal-form">
            <div class="form-group">
              <label for="full_name">Full Name</label>
              <input v-model="profileForm.full_name" type="text" id="full_name" placeholder="Enter your full name" />
            </div>
            
            <div class="form-group">
              <label for="username">Username</label>
              <input v-model="profileForm.username" type="text" id="username" placeholder="Enter your username" />
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input v-model="profileForm.email" type="email" id="email" placeholder="Enter your email" />
            </div>
            
            <div class="form-group">
              <label for="password">New Password (leave blank to keep current)</label>
              <input v-model="profileForm.password" type="password" id="password" placeholder="Enter new password" />
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="isEditing = false">Cancel</button>
              <button type="submit" class="primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  </template>
  
  <script>
  import { computed, onMounted, reactive, ref } from 'vue';
import {
    getActivitiesByUser,
    getUserChallenges,
    getUserProfile,
    getUserStatistics,
    updateUserProfile
} from '../services/api';
import { useAuthStore } from '../store/auth';
  
  export default {
    name: 'Profile',
    setup() {
      const authStore = useAuthStore();
      const userId = computed(() => authStore.user?.id || 1);
  
      const user = ref(null);
      const userStats = ref({});
      const userActivities = ref([]);
      // Separate arrays for active and completed challenges
      const userChallengesActive = ref([]);
      const userChallengesCompleted = ref([]);
  
      const isEditing = ref(false);
  
      // Form for editing profile
      const profileForm = reactive({
        full_name: '',
        username: '',
        email: '',
        password: ''
      });
  
      const activitiesTab = ref('all');
      const filteredActivities = computed(() => {
        if (activitiesTab.value === 'all') {
          return userActivities.value;
        } else if (activitiesTab.value === 'completed') {
          return userActivities.value.filter(activity => activity.is_completed);
        } else if (activitiesTab.value === 'pending') {
          return userActivities.value.filter(activity => !activity.is_completed);
        }
        return userActivities.value;
      });
  
      const challengesTab = ref('active');
      const filteredChallenges = computed(() => {
        return challengesTab.value === 'active'
          ? userChallengesActive.value
          : userChallengesCompleted.value;
      });
  
      const userInitials = computed(() => {
        if (!user.value || !user.value.full_name) return 'U';
        const nameParts = user.value.full_name.split(' ');
        return nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0].substring(0, 2);
      });
  
      const formattedJoinDate = computed(() => {
        if (!user.value || !user.value.created_at) return 'N/A';
        const date = new Date(user.value.created_at);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      });
  
      const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };
  
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
  
      const fetchProfileData = async () => {
        try {
          // Fetch user profile
          const profileResponse = await getUserProfile(userId.value);
          user.value = profileResponse.data || {
            id: 1,
            username: 'johndoe',
            email: 'john.doe@example.com',
            full_name: 'John Doe',
            created_at: '2023-01-15T00:00:00Z'
          };
  
          // Update form data
          profileForm.full_name = user.value.full_name || '';
          profileForm.username = user.value.username || '';
          profileForm.email = user.value.email || '';
          profileForm.password = '';
  
          // Fetch user statistics
          const statsResponse = await getUserStatistics(userId.value);
          // Map API response to our userStats object with proper field names
          userStats.value = {
            challengesCompleted: statsResponse.data?.challenges_completed || 0,
            points: statsResponse.data?.total_points || 0,
            activitiesLogged: statsResponse.data?.activities_count || 0,
            challengesJoined: statsResponse.data?.challenges_joined || 0,
            activitiesCompleted: statsResponse.data?.activities_completed || 0,
          };
  
          // Fetch user activities
          const activitiesResponse = await getActivitiesByUser(userId.value);
          userActivities.value = activitiesResponse.data;
  
          // Fetch active challenges
          const activeResponse = await getUserChallenges(userId.value, { completed: false });
          userChallengesActive.value = activeResponse.data || [];
  
          // Fetch completed challenges
          const completedResponse = await getUserChallenges(userId.value, { completed: true });
          userChallengesCompleted.value = completedResponse.data || [];
          
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
  
      const updateProfile = async () => {
        try {
          const updateData = {
            full_name: profileForm.full_name,
            username: profileForm.username,
            email: profileForm.email
          };
  
          if (profileForm.password) {
            updateData.password = profileForm.password;
          }
  
          const response = await updateUserProfile(userId.value, updateData);
          user.value = response.data;
          authStore.setUser(response.data);
          isEditing.value = false;
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      };
  
      onMounted(() => {
        fetchProfileData();
      });
  
      return {
        user,
        userStats,
        userActivities,
        userChallengesActive,
        userChallengesCompleted,
        isEditing,
        profileForm,
        activitiesTab,
        filteredActivities,
        challengesTab,
        filteredChallenges,
        userInitials,
        formattedJoinDate,
        formatDate,
        getChallengeDuration,
        updateProfile
      };
    }
  };
  </script>
  
  <style scoped>
  /* Existing styles preserved */
  .profile-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .profile-header {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--bg-card);
    box-shadow: 0 4px 6px var(--shadow-color);
  }
  
  .profile-cover {
    height: 30px;
    background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  }
  
  .profile-info {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--bg-tertiary);
    border: 4px solid var(--bg-card);
    margin-top: -50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: var(--accent-primary);
  }
  
  .profile-details {
    flex: 1;
  }
  
  .profile-username {
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }
  
  .edit-profile-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--bg-tertiary);
  }
  
  .profile-content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 1.5rem;
  }
  
  .profile-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .profile-card,
  .stats-card {
    padding: 1.5rem;
  }
  
  .profile-field {
    margin-top: 1.25rem;
  }
  
  .field-label {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }
  
  .field-value {
    font-weight: 500;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .stat-item {
    text-align: center;
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent-primary);
  }
  
  .stat-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }
  
  .profile-main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .activity-card {
    padding: 1.5rem;
  }
  
  .activities-tabs {
    display: flex;
    gap: 1rem;
    margin: 1.5rem 0;
  }
  
  .activities-tabs button {
    background: transparent;
    border: none;
    padding: 0.5rem 1rem;
    color: var(--text-secondary);
    font-weight: 500;
    position: relative;
  }
  
  .activities-tabs button:hover {
    color: var(--text-primary);
  }
  
  .activities-tabs button.active {
    color: var(--accent-primary);
  }
  
  .activities-tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-primary);
    border-radius: 2px;
  }
  
  .activity-timeline {
    margin-top: 1.5rem;
  }
  
  .timeline-item {
    display: flex;
    gap: 1rem;
    padding-bottom: 1.5rem;
    position: relative;
  }
  
  .timeline-item:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 9px;
    top: 30px;
    bottom: 0;
    width: 2px;
    background: var(--border-color);
  }
  
  .timeline-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    z-index: 1;
  }
  
  .timeline-content {
    flex: 1;
  }
  
  .timeline-title {
    font-weight: 500;
  }
  
  .timeline-description {
    margin-top: 0.25rem;
    color: var(--text-secondary);
  }
  
  .timeline-date {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  
  .challenges-card {
    padding: 1.5rem;
  }
  
  .challenges-tabs {
    display: flex;
    gap: 1rem;
    margin: 1.5rem 0;
  }
  
  .challenges-tabs button {
    background: transparent;
    border: none;
    padding: 0.5rem 1rem;
    color: var(--text-secondary);
    font-weight: 500;
    position: relative;
  }
  
  .challenges-tabs button:hover {
    color: var (--text-primary);
  }
  
  .challenges-tabs button.active {
    color: var(--accent-primary);
  }
  
  .challenges-tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent-primary);
    border-radius: 2px;
  }
  
  .challenges-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .challenge-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
  }
  
  .challenge-info {
    flex: 1;
  }
  
  .challenge-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .challenge-points {
    font-weight: 600;
    color: var(--accent-primary);
  }
  
  .challenge-status {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-full);
    margin-left: 0.5rem;
  }
  
  .challenge-status.active {
    background: var(--accent-primary);
    color: #121212;
  }
  
  .challenge-status.completed {
    background: #ffb74d;
    color: #121212;
  }
  
  .challenge-dates {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
  }
  
  .challenge-action {
    white-space: nowrap;
  }
  
  .no-activities,
  .no-challenges {
    text-align: center;
    padding: 2rem 0;
    color: var(--text-secondary);
  }
  
  .view-challenges-btn {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-fast);
  }
  
  .view-challenges-btn:hover {
    background: var(--bg-card-hover);
    text-decoration: none;
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
    animation: fadeIn 0.2s ease;
  }
  
  .modal-content {
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 1.5rem;
    animation: slideUp 0.3s ease;
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
  
  @media (max-width: 992px) {
    .profile-content {
      grid-template-columns: 1fr;
    }
    
    .profile-sidebar {
      order: 2;
    }
    
    .profile-main {
      order: 1;
    }
  }
  
  @media (max-width: 768px) {
    .profile-info {
      flex-direction: column;
      text-align: center;
    }
    
    .edit-profile-btn {
      margin-top: 1rem;
    }
  }
  </style>
