<template>
  <div>
    <router-view class="login=form form-background" />
  </div>
</template>

<script>
export default {
  name: 'LoginLayout',
  data() {
    return {
      altLogo: process.env.VUE_APP_COMPANY_NAME || 'AMI',
      customizableGuiName: process.env.VUE_APP_GUI_NAME || '',
    };
  },
};
</script>

<style lang="scss" scoped></style>
