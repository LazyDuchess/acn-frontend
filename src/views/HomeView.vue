<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const apiBase = import.meta.env.VITE_API_BASE_URL

const playerCount = ref<number | null>(null)
const stageCounts = ref<Record<string, number>>({})

const stageNames: Record<string, string> = {
  '12': 'Brink Terminal',
  '11': 'Millenium Square',
  '9': 'Pyramid Island',
  '8': 'Police Station',
  '7': 'Mataan',
  '6': 'Millenium Mall',
  '5': 'Hideout',
  '4': 'Versum Hill',
}

let intervalId: number | undefined

const sortedStages = computed(() => {
  const rows: { name: string; count: number }[] = []

  let customCount = 0

  for (const [stageId, count] of Object.entries(stageCounts.value)) {
    if (count <= 0) continue

    const stageName = stageNames[stageId]

    if (stageName) {
      rows.push({
        name: stageName,
        count,
      })
    } else {
      customCount += count
    }
  }

  if (customCount > 0) {
    rows.push({
      name: 'Custom',
      count: customCount,
    })
  }

  return rows.sort((a, b) => b.count - a.count)
})

function mount() {
  fetchPlayerCount()
  intervalId = window.setInterval(fetchPlayerCount, 2000)
}

async function fetchPlayerCount() {
  try {
    const res = await fetch(`${apiBase}/api/players`)
    const data = await res.json()

    playerCount.value = data.count
    stageCounts.value = data.stages ?? {}
  } catch (err) {
    console.error(err)

    playerCount.value = 0
    stageCounts.value = {}
  }
}

onMounted(mount)

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card elevation="6" class="pa-8">
      <div class="pa-8 text-center">
        <h1 v-if="playerCount !== null">{{ playerCount }} Players In-Game</h1>

        <h1 v-else>Loading...</h1>

        <v-divider class="my-4" />

        <div
          v-for="stage in sortedStages"
          :key="stage.name"
          class="d-flex justify-space-between py-1"
          style="min-width: 300px"
        >
          <span>{{ stage.name }}</span>
          <span>
            {{ stage.count }}
            {{ stage.count === 1 ? 'player' : 'players' }}
          </span>
        </div>
      </div>
    </v-card>
  </v-container>
</template>
