<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const searchid = ref('')
const badgefield = ref('')
const roleselect = ref('')
const apiBase = import.meta.env.VITE_API_BASE_URL

interface ManageUserResult {
  found: boolean
  canManage: boolean
  canManageRole: boolean
  username: string
  avatarUrl: string
  role: string
  badges: number[]
  id: string
}

const fetchedUser = ref<ManageUserResult | null>(null)

async function applyUser() {
  const newbadges: number[] = badgefield.value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => !Number.isNaN(x))

  await fetch(`${apiBase}/api/mod/set-user-manage`, {
    method: 'POST',

    credentials: 'include',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      id: fetchedUser.value?.id,
      role: roleselect.value,
      badges: newbadges,
    }),
  })
}

async function fetchUser() {
  const response = await fetch(apiBase + '/api/mod/get-user-manage?id=' + searchid.value, {
    credentials: 'include',
  })

  if (!response.ok) {
    fetchedUser.value = null
    return
  }

  fetchedUser.value = await response.json()

  if (fetchedUser.value?.found) {
    roleselect.value = fetchedUser.value.role
    badgefield.value = ''
    for (let i = 0; i < fetchedUser.value.badges.length; i++) {
      badgefield.value += fetchedUser.value.badges[i]
      if (i < fetchedUser.value.badges.length - 1) {
        badgefield.value += ','
      }
    }
  }
}
</script>

<template>
  <v-container class="py-8" max-width="900">
    <v-card
      v-if="!auth.isAuthenticated || auth.user?.role == 'Player'"
      rounded="xl"
      class="pa-6 mb-6"
    >
      <div class="text-h4 font-weight-bold">Can't access this stuff, silly!</div>
    </v-card>
    <template v-if="auth.isAuthenticated && auth.user?.role != 'Player'">
      <v-card rounded="xl" class="pa-6 mb-6">
        <div class="text-h5 font-weight-bold mb-4">User Search</div>
        <v-text-field v-model="searchid" label="Discord ID" variant="outlined" hide-details>
        </v-text-field>
        <v-btn @click="fetchUser" class="mt-4" color="primary" variant="flat"> Search </v-btn>
      </v-card>
    </template>
    <template v-if="fetchedUser?.found">
      <v-card rounded="xl" class="pa-6 mb-6">
        <div class="d-flex align-center ga-5">
          <v-avatar size="96">
            <v-img :src="fetchedUser.avatarUrl"></v-img>
          </v-avatar>

          <div>
            <div class="text-h4 font-weight-bold">
              {{ fetchedUser.username }}
            </div>
          </div>
        </div>
      </v-card>
      <v-card rounded="xl" class="pa-6 mb-6">
        <v-select
          :disabled="!fetchedUser.canManageRole"
          v-model="roleselect"
          label="Role"
          :items="['Player', 'Mod', 'Admin']"
        ></v-select>
        <v-text-field
          class="mt-4"
          v-model="badgefield"
          label="Comma separated badges"
          variant="outlined"
          hide-details
        >
        </v-text-field>
        <v-divider class="my-4" />
        <v-btn @click="applyUser" class="mt-4" color="primary" variant="flat">
          Apply Changes
        </v-btn>
      </v-card>
    </template>
  </v-container>
</template>
