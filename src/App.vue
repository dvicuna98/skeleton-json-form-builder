<template>
  <v-app>
    <div>
      <v-app-bar
          color="#AE1C1F black--text"
          dense
          dark
      >
        <v-toolbar-title>{{$t('PreInscriptionForm')}}</v-toolbar-title>

      </v-app-bar>
    </div>

    <div class="main">
      <div class="left">

      </div>
      <div class="right">

        <router-view/>

      </div>
    </div>
  </v-app>
</template>

<style lang="scss">
html { overflow-y: auto }

@media screen and (max-width: 800px){
  .main{

    .left {
      visibility: collapse;
    }

    .right {
      grid-area: 1 / 2 / 2 / 4;
    }

  }
}
@media screen and (min-width: 800px) {
  .main {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;

    .left {
      height: calc(100vh - 48px);
      background: url(../src/assets/background.jpg) 100% fixed rgb(249, 249, 249);
    }

    .right {
      grid-area: 1 / 2 / 2 / 4;
    }

  }
}


</style>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
