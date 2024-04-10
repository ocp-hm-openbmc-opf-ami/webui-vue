<template>
  <div id="draggable-container">
    <div id="draggable-header">
      <slot name="header"></slot>
    </div>
    <slot name="main"></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  name: 'DraggableDiv',
};
</script>

<style>
#draggable-container {
  width: 40%;
  position: absolute;
  z-index: 1;
}
#draggable-header {
  z-index: 1;
}
</style>
