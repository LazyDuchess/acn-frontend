<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const apiBase = import.meta.env.VITE_API_BASE_URL

const auth = useAuthStore()

const gameToken = ref('')
const loadingToken = ref(false)
const copying = ref(false)
const view = ref(false)

function toggleToken() {
  view.value = !view.value
}

async function fetchGameToken() {
  loadingToken.value = true

  try {
    const response = await fetch(apiBase + '/api/game-token', {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch game token')
    }

    const data = await response.json()

    gameToken.value = data.token
  } finally {
    loadingToken.value = false
  }
}

async function regenerateGameToken() {
  loadingToken.value = true

  try {
    const response = await fetch(apiBase + '/api/game-token/regenerate', {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to regenerate game token')
    }

    const data = await response.json()

    gameToken.value = data.token
  } finally {
    loadingToken.value = false
  }
}

async function copyToken() {
  await navigator.clipboard.writeText(gameToken.value)

  copying.value = true

  setTimeout(() => {
    copying.value = false
  }, 1500)
}

onMounted(async () => {
  await auth.fetchUser()
  await fetchGameToken()
})
</script>

<template>
  <v-container class="py-8" max-width="900">
    <v-card v-if="!auth.isAuthenticated" rounded="xl" class="pa-6 mb-6">
      <div class="text-h4 font-weight-bold">Not logged in.</div>
    </v-card>
    <template v-if="auth.isAuthenticated">
      <v-card rounded="xl" class="pa-6 mb-6">
        <div class="d-flex align-center ga-5">
          <v-avatar size="96">
            <v-img :src="auth.user?.avatarUrl"></v-img>
          </v-avatar>

          <div>
            <div class="text-h4 font-weight-bold">
              {{ auth.user?.name }}
            </div>

            <div class="text-subtitle-1 text-medium-emphasis mt-1">
              {{ auth.user?.role }}
            </div>
          </div>
        </div>
      </v-card>

      <v-card rounded="xl" class="pa-6">
        <div class="text-h5 font-weight-bold mb-4">Token</div>
        <div class="text-subtitle-1 text-medium-emphasis mt-1">
          Paste this into your auth.txt to authenticate in-game.
        </div>
        <v-text-field
          :model-value="gameToken"
          variant="outlined"
          hide-details
          readonly
          :type="view ? '' : 'password'"
          :loading="loadingToken"
        >
          <template #append-inner>
            <v-btn size="small" variant="text" @click="toggleToken">
              {{ view ? 'Hide' : 'Show' }}
            </v-btn>
            <v-btn size="small" variant="text" @click="copyToken">
              {{ copying ? 'Copied!' : 'Copy' }}
            </v-btn>
          </template>
        </v-text-field>

        <v-btn
          class="mt-4"
          color="primary"
          variant="flat"
          @click="regenerateGameToken"
          :loading="loadingToken"
        >
          Regenerate
        </v-btn>
      </v-card>
    </template>
  </v-container>
</template>
