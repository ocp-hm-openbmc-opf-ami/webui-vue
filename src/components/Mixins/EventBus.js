import Vue from 'vue';

const EventBus = new Vue();

window.events = EventBus;
window.events.fire = EventBus.$emit;
window.events.listen = EventBus.$on;

window.bus = EventBus;
window.bus.fire = EventBus.$emit;
window.bus.listen = EventBus.$on;

export default EventBus;
