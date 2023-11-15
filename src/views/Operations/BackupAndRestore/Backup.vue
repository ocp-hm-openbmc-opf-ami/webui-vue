<template>
  <b-container fluid="xl">
    <div class="form-background p-5">
      <b-row>
        <b-col cols="10">
          <b-form-checkbox id="asdServer" switch>
            <span> Disable </span>
            <!-- <span v-else>{{ $t('global.status.disabled') }}</span> -->
          </b-form-checkbox>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';

export default {
  name: 'Backup',
  mixins: [BVToastMixin],
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
