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
                <div class="stat-label">Challenges</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.points || 0 }}</div>
                <div class="stat-label">Points</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.activitiesLogged || 0 }}</div>
                <div class="stat-label">Activities</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats.currentStreak || 0 }}</div>
                <div class="stat-label">Streak</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-main">
          <div class="activity-card card">
            <h3>Recent Activity</h3>
            <div class="activity-timeline">
              <div v-for="activity in userActivities" :key="activity.id" class="timeline-item">
                <div class="timeline-icon" :class="activity.type">
                  <svg v-if="activity.type === 'challenge'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  <svg v-else-if="activity.type === 'team'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div class="timeline-content">
                  <div class="timeline-title">{{ activity.title }}</div>
                  <div class="timeline-description">{{ activity.description }}</div>
                  <div class="timeline-date">{{ activity.date }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="challenges-card card">
            <h3>Your Challenges</h3>
            <div class="challenges-tabs">
              <button 
                :class="{ active: challengesTab === 'active' }" 
                @click="challengesTab = 'active'"
              >
                Active
              </button>
              <button 
                :class="{ active: challengesTab === 'completed' }" 
                @click="challengesTab = 'completed'"
              >
                Completed
              </button>
            </div>
            
            <div v-if="filteredChallenges.length > 0" class="challenges-list">
              <div v-for="challenge in filteredChallenges" :key="challenge.id" class="challenge-item">
                <div class="challenge-info">
                  <h4>{{ challenge.title }}</h4>
                  <div class="challenge-meta">
                    <span class="challenge-category" :class="challenge.category">{{ challenge.category }}</span>
                    <span class="challenge-points">{{ challenge.points }} pts</span>
                  </div>
                  <div v-if="challengesTab === 'active'" class="challenge-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: `${challenge.progress}%` }"></div>
                    </div>
                    <div class="progress-text">{{ challenge.progress }}% Complete</div>
                  </div>
                </div>
                <button 
                  v-if="challengesTab === 'active'" 
                  class="secondary challenge-action"
                  @click="logActivity(challenge.id)"
                >
                  Log Activity
                </button>
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
      
      <!-- Edit Profile Modal -->
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
import { completeActivity, getActivitiesByUser, getUserChallenges, getUserProfile, getUserStatistics, updateUserProfile } from '../services/api';
import { useAuthStore } from '../store/auth';
  
  export default {
    name: 'Profile',
    setup() {
      const authStore = useAuthStore();
      const userId = computed(() => authStore.user?.id || 1);
      
      const user = ref(null);
      const userStats = ref({});
      const userActivities = ref([]);
      const userChallenges = ref([]);
      const isEditing = ref(false);
      const challengesTab = ref('active');
      
      const profileForm = reactive({
        full_name: '',
        username: '',
        email: '',
        password: ''
      });
      
      const userInitials = computed(() => {
        if (!user.value || !user.value.full_name) return 'U';
        
        const nameParts = user.value.full_name.split(' ');
        if (nameParts.length > 1) {
          return `${nameParts[0][0]}${nameParts[1][0]}`;
        }
        return nameParts[0].substring(0, 2);
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
      
      const filteredChallenges = computed(() => {
        if (challengesTab.value === 'active') {
          return userChallenges.value.filter(c => c.progress < 100);
        } else {
          return userChallenges.value.filter(c => c.progress === 100);
        }
      });
      
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
          userStats.value = statsResponse.data || {
            challengesCompleted: 12,
            points: 450,
            activitiesLogged: 28,
            currentStreak: 5
          };
          
          // Fetch user activities
          const activitiesResponse = await getActivitiesByUser(userId.value);
          userActivities.value = activitiesResponse.data || [
            {
              id: 1,
              type: 'challenge',
              title: 'Challenge Completed',
              description: 'Completed the 10,000 Steps Challenge',
              date: '2 days ago'
            },
            {
              id: 2,
              type: 'activity',
              title: 'Activity Logged',
              description: 'Logged 30 minutes of meditation',
              date: '3 days ago'
            },
            {
              id: 3,
              type: 'team',
              title: 'Joined Team',
              description: 'Joined Team Alpha',
              date: '1 week ago'
            },
            {
              id: 4,
              type: 'challenge',
              title: 'Challenge Joined',
              description: 'Joined the Hydration Hero Challenge',
              date: '1 week ago'
            },
            {
              id: 5,
              type: 'activity',
              title: 'Activity Logged',
              description: 'Logged 45 minutes of yoga',
              date: '2 weeks ago'
            }
          ];
          
          // Fetch user challenges
          const challengesResponse = await getUserChallenges(userId.value);
          userChallenges.value = challengesResponse.data || [
            {
              id: 1,
              title: "10,000 Steps Challenge",
              category: "fitness",
              points: 100,
              progress: 65
            },
            {
              id: 2,
              title: "Meditation Master",
              category: "mindfulness",
              points: 75,
              progress: 30
            },
            {
              id: 3,
              title: "Hydration Hero",
              category: "nutrition",
              points: 50,
              progress: 90
            },
            {
              id: 4,
              title: "Sleep Well",
              category: "wellness",
              points: 80,
              progress: 100
            },
            {
              id: 5,
              title: "Digital Detox",
              category: "mindfulness",
              points: 90,
              progress: 100
            }
          ];
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
          
          // Update auth store with new user data
          authStore.setUser(response.data);
          
          isEditing.value = false;
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      };
      
      const logActivity = async (challengeId) => {
        try {
          await completeActivity(challengeId, userId.value);
          
          // Update local state
          const challenge = userChallenges.value.find(c => c.id === challengeId);
          if (challenge) {
            challenge.progress += 10; // Increment progress by 10%
            if (challenge.progress > 100) challenge.progress = 100;
            
            // If challenge is now complete, update stats
            if (challenge.progress === 100) {
              userStats.value.challengesCompleted++;
            }
            
            userStats.value.activitiesLogged++;
            userStats.value.points += 10; // Assume 10 points per activity
            
            // Add new activity to timeline
            userActivities.value.unshift({
              id: Date.now(),
              type: 'activity',
              title: 'Activity Logged',
              description: `Logged activity for ${challenge.title}`,
              date: 'Just now'
            });
          }
        } catch (error) {
          console.error('Error logging activity:', error);
        }
      };
      
      onMounted(() => {
        fetchProfileData();
      });
      
      return {
        user,
        userStats,
        userActivities,
        userChallenges,
        userInitials,
        formattedJoinDate,
        isEditing,
        profileForm,
        challengesTab,
        filteredChallenges,
        updateProfile,
        logActivity
      };
    }
  };
  </script>
  
  <style scoped>
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
    height: 150px;
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
  
  .profile-card, .stats-card {
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
  
  .activity-card, .challenges-card {
    padding: 1.5rem;
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
  
  .timeline-icon.challenge {
    color: var(--accent-primary);
  }
  
  .timeline-icon.team {
    color: var(--accent-secondary);
  }
  
  .timeline-icon.activity {
    color: #ff7597;
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
    color: var(--text-primary);
    background: transparent;
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
  
  .challenge-points {
    font-weight: 600;
    color: var(--accent-primary);
  }
  
  .challenge-progress {
    margin-top: 0.75rem;
  }
  
  .progress-bar {
    height: 6px;
    background: var(--bg-card);
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
    margin-top: 0.25rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
  
  .challenge-action {
    white-space: nowrap;
  }
  
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
    background: transparent;
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