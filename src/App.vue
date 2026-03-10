<template>
  <v-app>
    <v-app-bar color="primary" dark elevation="2">
      <v-toolbar-title>IT Training Workshop</v-toolbar-title>
    </v-app-bar>
    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html, body { font-family: 'Sarabun', sans-serif; }
</style>