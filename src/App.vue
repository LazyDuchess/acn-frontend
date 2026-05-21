<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-app-bar-title>All City Network</v-app-bar-title>
      <v-divider vertical></v-divider>
      <v-btn
        target="blank"
        href="https://thunderstore.io/c/bomb-rush-cyberfunk/p/Freesoul/All_City_Network/"
        class="me-4 ms-5"
      >
        Download
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn target="blank" href="https://discord.com/invite/freesoulbrc" class="me-4 ms-5">
        Discord
      </v-btn>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
