<template>
  <div id="draggable-container" ref="draggableContainer">
    <div id="draggable-header" @mousedown="dragMouseDown">
      <slot name="header"></slot>
    </div>
    <slot name="main"></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  name: 'DraggableDiv',
  data: function () {
    return {
      p1: 0,
      p2: 0,
      p3: 0,
      p4: 0,
    };
  },
  mounted() {
    this.$root.$on('reset-keyboard-location', () => this.resetPosition());
  },
  methods: {
    dragMouseDown: function (event) {
      event = event || window.event;
      event.preventDefault();
      // get the mouse cursor position at startup:
      this.p3 = event.clientX;
      this.p4 = event.clientY;
      document.onmouseup = this.closeDragElement;
      document.onclick = this.closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = this.elementDrag;
    },
    elementDrag: function (event) {
      event = event || window.event;
      event.preventDefault();
      // calculate the new cursor position:
      this.p1 = this.p3 - event.clientX;
      this.p2 = this.p4 - event.clientY;
      this.p3 = event.clientX;
      this.p4 = event.clientY;
      // set the element's new position:
      // Calculate new top and left positions
      let newTop = this.$refs.draggableContainer.offsetTop - this.p2;
      let newLeft = this.$refs.draggableContainer.offsetLeft - this.p1;

      // Get window and element dimensions
      const container = this.$refs.draggableContainer;
      const containerRect = container.getBoundingClientRect();
      const sidebarWidth = 290; // Adjust this value to your sidebar's width
      const minLeft = -sidebarWidth;
      const minTop = 0;
      const maxLeft = window.innerWidth - containerRect.width;
      const maxTop = window.innerHeight - containerRect.height;

      // Clamp values to window bounds
      newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
      newTop = Math.max(minTop, Math.min(newTop, maxTop));

      // Set the element's new position
      container.style.top = newTop + 'px';
      container.style.left = newLeft + 'px';
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    },
    resetPosition() {
      this.$refs.draggableContainer.style.top = '';
      this.$refs.draggableContainer.style.left = '';
    },
  },
};
</script>

<style>
#draggable-container {
  position: absolute;
  z-index: 9;
}
#draggable-header {
  cursor: move;
  z-index: 10;
}
</style>
