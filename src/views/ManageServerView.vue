<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const apiBase = import.meta.env.VITE_API_BASE_URL
const auth = useAuthStore()
const motdfield = ref('')
const namechangebox = ref('')
const motdbox = ref('')

interface ManageServerResult {
  allowNameChanges: boolean
  motd: string
  alwaysShowMotd: boolean
}

const fetchedServer = ref<ManageServerResult | null>(null)

async function fetchServer() {
  const response = await fetch(apiBase + '/api/admin/get-server-manage', {
    credentials: 'include',
  })

  if (!response.ok) {
    fetchedServer.value = null
    return
  }

  fetchedServer.value = await response.json()
  motdfield.value = fetchedServer.value.motd
  namechangebox.value = fetchedServer.value.allowNameChanges
  motdbox.value = fetchedServer.value.alwaysShowMotd
}

async function applyServer() {
  await fetch(`${apiBase}/api/admin/set-server-manage`, {
    method: 'POST',

    credentials: 'include',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      allowNameChanges: namechangebox.value,
      motd: motdfield.value,
      alwaysShowMotd: motdbox.value,
    }),
  })
}

onMounted(() => {
  fetchServer()
})
</script>

<template>
  <v-container class="py-8" max-width="900">
    <v-card
      v-if="!auth.isAuthenticated || auth.user?.role != 'Admin'"
      rounded="xl"
      class="pa-6 mb-6"
    >
      <div class="text-h4 font-weight-bold">Can't access this stuff, silly!</div>
    </v-card>
    <template v-if="auth.isAuthenticated && auth.user?.role == 'Admin'">
      <v-card rounded="xl" class="pa-6 mb-6">
        <div class="text-h4 font-weight-bold">Server Settings</div>
        <v-checkbox v-model="namechangebox" label="Allow Name Changes"></v-checkbox>

        <v-textarea v-model="motdfield" label="Message of the Day" variant="outlined" hide-details>
        </v-textarea>
        <v-checkbox v-model="motdbox" label="Always show Message of the Day"></v-checkbox>
        <v-btn @click="applyServer" class="mt-4" color="primary" variant="flat">
          Apply Changes
        </v-btn>
      </v-card>
    </template>
  </v-container>
</template>
