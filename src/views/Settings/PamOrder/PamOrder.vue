<template>
  <b-container fluid="xl">
    <page-title />
    <b-row class="align-items-end form-background p-3">
      <b-col sm="6">
        <b-alert v-if="samePamOrder" show variant="warning">{{
          $t('pagePamOrder.samePamOrder')
        }}</b-alert>
        <alert variant="info" class="mb-4">
          <span>
            {{ $t('pagePamOrder.informationMessage') }}
          </span>
        </alert>
        <draggable
          v-model="pamList"
          class="list-group"
          tag="ul"
          v-bind="dragOptions"
          @start="isDragging = true"
          @end="isDragging = false"
        >
          <transition-group type="transition" name="flip-list">
            <li
              v-for="(name, index) in pamList"
              :key="index"
              class="list-group-item"
            >
              {{ index + 1 }} - {{ name.includes('LDAP') ? 'LDAP/AD' : name }}
            </li>
          </transition-group>
        </draggable>
        <b-button
          class="mt20"
          form="form-networLink"
          type="submit"
          variant="primary"
          @click="onSave"
        >
          {{ $t('global.action.save') }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import draggable from 'vuedraggable';
import PageTitle from '@/components/Global/PageTitle';
import { mapState } from 'vuex';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import Alert from '@/components/Global/Alert';

export default {
  name: 'PamOrder',
  components: {
    draggable,
    PageTitle,
    Alert,
  },
  mixins: [LoadingBarMixin, BVToastMixin],
  data() {
    return {
      loading,
      pamList: [],
      initialPamList: [], // To store the initial order
      samePamOrder: false,
    };
  },
  computed: {
    ...mapState('pamOrder', ['pamOrderListData']),
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
  watch: {
    pamOrderListData() {
      this.pamOrderlist();
    },
  },
  created() {
    this.startLoader();
    this.$store
      .dispatch('pamOrder/getPamOrderData')
      .finally(() => {
        this.endLoader();
      })
      .catch(({ message }) => this.errorToast(message));
  },
  methods: {
    onSave() {
      if (
        JSON.stringify(this.pamList) !== JSON.stringify(this.initialPamList)
      ) {
        this.$store
          .dispatch('pamOrder/updatePamOrderData', this.pamList)
          .then((success) => this.successToast(success))
          .catch(({ message }) => this.errorToast(message));
      } else {
        this.samePamOrder = true;
        setTimeout(() => {
          this.samePamOrder = false;
        }, 3000); // Show same pam order Configuration information for 3 seconds.
      }
    },
    pamOrderlist() {
      this.pamList = this.$store.getters['pamOrder/getPamOrderData'].map(
        (name) => name,
      );
      this.initialPamList = [...this.pamList]; // Store the initial order
    },
  },
};
</script>

<style scoped>
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
.mt20 {
  margin-top: 20px;
}
</style>
