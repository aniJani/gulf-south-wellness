<template>
    <div class="challenge-card card">
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
        <slot name="actions">
          <button 
            v-if="!challenge.joined" 
            class="primary" 
            @click="$emit('join', challenge.id)"
          >
            Join Challenge
          </button>
          <button 
            v-else-if="challenge.progress < 100" 
            class="secondary" 
            @click="$emit('log-activity', challenge.id)"
          >
            Log Activity
          </button>
          <button 
            v-else 
            disabled
          >
            Completed
          </button>
        </slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ChallengeCard',
    props: {
      challenge: {
        type: Object,
        required: true
      }
    },
    emits: ['join', 'log-activity']
  };
  </script>
  
  <style scoped>
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
  </style>