<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageAlertPolicy.pageDescription')" />

    <!-- Alert Policy Table -->
    <div class="table-section">
      <b-table
        responsive
        hover
        :busy="loading"
        :fields="fields"
        :items="policies"
        :per-page="perPage"
        :current-page="currentPage"
        show-empty
        :empty-text="$t('global.table.emptyMessage')"
      >
        <!-- Loading slot -->
        <template #table-busy>
          <div class="text-center my-2">
            <b-spinner class="align-middle mr-2"></b-spinner>
            <strong>{{ $t('global.status.loading') }}</strong>
          </div>
        </template>

        <!-- Alert Policy Group Number column -->
        <template #cell(alertPolicyGroupNum)="data">
          <span>{{ data.item.alertPolicyGroupNum }}</span>
        </template>

        <!-- Alert Policy ID column -->
        <template #cell(Id)="data">
          <span>{{ data.item.id }}</span>
        </template>

        <!-- Enable Alert column -->
        <template #cell(enableAlert)="data">
          <span>{{
            data.item.enableAlert === 1
              ? $t('global.status.enabled')
              : $t('global.status.disabled')
          }}</span>
        </template>

        <!-- Channel Number column -->
        <template #cell(channelNo)="data">
          <span>{{ getChannelName(data.item.channelNo) }}</span>
        </template>

        <!-- Destination Selection column -->
        <template #cell(destinationSel)="data">
          <span>{{ data.item.destinationSel }}</span>
        </template>

        <!-- Policy Action column -->
        <template #cell(policyAction)="data">
          <span>{{ getPolicyActionText(data.item.policyAction) }}</span>
        </template>

        <!-- Actions column -->
        <template #cell(actions)="data">
          <table-row-action
            v-if="data.item.uri"
            :value="data.item"
            :title="$t('pageAlertPolicy.editPolicy')"
            :enabled="!isButtonDisabled"
            @click-table-action="onEditPolicy(data.item)"
          >
            <template #icon>
              <icon-edit />
            </template>
          </table-row-action>
          <table-row-action
            v-if="data.item.uri"
            :value="data.item"
            :title="$t('pageAlertPolicy.deletePolicy')"
            :enabled="!isButtonDisabled && data.item.enableAlert === 1"
            @click-table-action="onDeletePolicy(data.item)"
          >
            <template #icon>
              <icon-trashcan />
            </template>
          </table-row-action>
        </template>
      </b-table>

      <!-- Pagination -->
      <b-row>
        <b-col>
          <b-pagination
            v-model="currentPage"
            :total-rows="policies.length"
            :per-page="perPage"
            aria-controls="policies-table"
            first-number
            last-number
          ></b-pagination>
        </b-col>
      </b-row>
    </div>

    <!-- Edit/Add Policy Modal -->
    <b-modal
      id="policy-modal"
      :title="modalTitle"
      size="lg"
      @hidden="resetModal"
      @ok="handleModalOk"
    >
      <b-form>
        <!-- Policy Configuration Section -->
        <div class="mb-4">
          <b-form-group
            :label="$t('pageAlertPolicy.alertPolicyGroupNum')"
            label-for="alert-group-num"
          >
            <b-form-input
              id="alert-group-num"
              v-model.number="form.alertPolicyGroupNum"
              type="number"
              readonly
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :label="$t('pageAlertPolicy.enableAlert')"
            label-for="enable-alert"
          >
            <b-form-select
              id="enable-alert"
              v-model.number="form.enableAlert"
              :options="enableAlertOptions"
              required
            ></b-form-select>
          </b-form-group>

          <b-form-group
            :label="$t('pageAlertPolicy.channelNo')"
            label-for="channel-no"
          >
            <b-form-select
              id="channel-no"
              v-model.number="form.channelNo"
              :options="channelOptions"
              :state="getValidationState($v.form.channelNo)"
              required
              @change="$v.form.channelNo.$touch()"
            ></b-form-select>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.channelNo.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            :label="$t('pageAlertPolicy.destinationSel')"
            label-for="destination-sel"
          >
            <b-form-input
              id="destination-sel"
              v-model.number="form.destinationSel"
              type="number"
              min="0"
              max="15"
              :state="getValidationState($v.form.destinationSel)"
              required
              @input="$v.form.destinationSel.$touch()"
            ></b-form-input>
            <b-form-invalid-feedback role="alert">
              <template v-if="!$v.form.destinationSel.required">
                {{ $t('global.form.fieldRequired') }}
              </template>
              <template v-else-if="!$v.form.destinationSel.pattern">
                {{ $t('global.form.valueMustBeBetween', { min: 0, max: 14 }) }}
              </template>
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group
            :label="$t('pageAlertPolicy.policyAction')"
            label-for="policy-action"
          >
            <b-form-select
              id="policy-action"
              v-model.number="form.policyAction"
              :options="policyActionOptions"
              required
            ></b-form-select>
          </b-form-group>
        </div>
      </b-form>

      <template #modal-footer="{ ok, cancel }">
        <b-button variant="secondary" @click="cancel()">
          {{ $t('global.action.cancel') }}
        </b-button>
        <b-button variant="primary" @click="ok()">
          <icon-save class="mr-1" />
          {{ $t('global.action.save') }}
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import TableRowAction from '@/components/Global/TableRowAction';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { mapGetters, mapState } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import IconEdit from '@carbon/icons-vue/es/edit/20';
import IconTrashcan from '@carbon/icons-vue/es/trash-can/20';
import IconSave from '@carbon/icons-vue/es/save/20';
import { privilegesId } from '@/store/modules/GlobalStore';

export default {
  name: 'AlertPolicy',
  components: {
    PageTitle,
    TableRowAction,
    IconEdit,
    IconTrashcan,
    IconSave,
  },
  mixins: [BVToastMixin, LoadingBarMixin, VuelidateMixin],
  data() {
    return {
      currentPage: 1,
      perPage: 15,
      isEditing: false,
      modalTitle: '',
      form: {
        alertPolicyGroupNum: 1,
        channelNo: 1,
        destinationSel: 1,
        enableAlert: 1,
        policyAction: 1,
      },
      currentItem: null,
      enableAlertOptions: [
        { value: 0, text: 'Disabled' },
        { value: 1, text: 'Enabled' },
      ],
      policyActionOptions: [
        { value: 0, text: 'Always send alert to this destination' },
        {
          value: 1,
          text: 'If previous successful, skip this and continue (if configured)',
        },
        { value: 2, text: 'If previous successful, stop alerting further' },
        {
          value: 3,
          text: 'If previous successful, switch to another channel (if configured)',
        },
        {
          value: 4,
          text: 'If previous successful, switch to methods (if configured)',
        },
      ],
      fields: [
        {
          key: 'alertPolicyGroupNum',
          label: this.$t('pageAlertPolicy.alertPolicyGroupNum'),
          sortable: true,
        },
        {
          key: 'Id',
          label: this.$t('pageAlertPolicy.Id'),
          sortable: true,
        },
        {
          key: 'enableAlert',
          label: this.$t('pageAlertPolicy.enableAlert'),
          sortable: true,
        },
        {
          key: 'channelNo',
          label: this.$t('pageAlertPolicy.channel'),
          sortable: true,
        },
        {
          key: 'destinationSel',
          label: this.$t('pageAlertPolicy.destinationSel'),
          sortable: true,
        },
        {
          key: 'policyAction',
          label: this.$t('pageAlertPolicy.policyAction'),
          sortable: true,
        },
        {
          key: 'actions',
          label: this.$t('pageAlertPolicy.actions'),
          class: 'text-right',
        },
      ],
    };
  },
  computed: {
    ...mapState('alertPolicy', ['channelMappings', 'loading']),
    ...mapGetters('alertPolicy', [
      'policies',
      'activePolicies',
      'totalPolicies',
    ]),
    ...mapGetters('global', ['userPrivilege']),
    channelOptions() {
      return this.channelMappings.map((mapping) => ({
        value: mapping.ChannelNo,
        text: `${mapping.ChannelName}`,
      }));
    },
    isButtonDisabled() {
      return this.userPrivilege !== privilegesId.admin;
    },
  },
  async created() {
    await this.loadData();
  },
  validations() {
    return {
      form: {
        channelNo: {
          required,
        },
        destinationSel: {
          required,
          pattern: function (value) {
            return this.validateRange(value, 0, 14);
          },
        },
        policyAction: {
          required,
          pattern: function (value) {
            return this.validateRange(value, 0, 4);
          },
        },
      },
    };
  },
  methods: {
    async loadData() {
      this.startLoader();
      try {
        await this.$store.dispatch('alertPolicy/getAllPolicies');
        if (!this.form.channelNo && this.channelOptions.length > 0) {
          this.form.channelNo = this.channelOptions[0].value;
        }
      } catch (error) {
        this.errorToast(this.$t('pageAlertPolicy.toast.errorLoadingData'));
      } finally {
        this.endLoader();
      }
    },
    onEditPolicy(item) {
      this.isEditing = true;
      this.currentItem = item;
      this.modalTitle = this.$t('pageAlertPolicy.editPolicy');
      this.form = {
        alertPolicyGroupNum: item.alertPolicyGroupNum,
        channelNo: item.channelNo,
        destinationSel: item.destinationSel,
        enableAlert: item.enableAlert,
        policyAction: item.policyAction,
      };
      this.$bvModal.show('policy-modal');
      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    async onDeletePolicy(item) {
      this.$bvModal
        .msgBoxConfirm(
          this.$t('pageAlertPolicy.modal.deleteConfirmMessage', {
            index: item.id || item.index,
          }),
          {
            title: this.$t('pageAlertPolicy.modal.deleteConfirmTitle'),
            okTitle: this.$t('global.action.delete'),
            cancelTitle: this.$t('global.action.cancel'),
            okVariant: 'danger',
          },
        )
        .then(async (confirmed) => {
          if (confirmed) {
            this.startLoader();
            try {
              const message = await this.$store.dispatch(
                'alertPolicy/deletePolicy',
                item.uri,
              );
              this.successToast(message);
            } catch (error) {
              this.errorToast(error.message);
            } finally {
              this.endLoader();
            }
          }
        });
    },
    async handleModalOk(bvModalEvent) {
      bvModalEvent.preventDefault();

      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.startLoader();
      try {
        const message = await this.$store.dispatch('alertPolicy/updatePolicy', {
          uri: this.currentItem.uri,
          data: this.form,
        });
        this.successToast(message);
        this.$bvModal.hide('policy-modal');
      } catch (error) {
        this.errorToast(error.message);
      } finally {
        this.endLoader();
      }
    },
    resetModal() {
      this.form = {
        alertPolicyGroupNum: 1,
        channelNo: 1,
        destinationSel: 1,
        enableAlert: 1,
        policyAction: 1,
      };
      this.currentItem = null;
      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    getChannelName(channelNo) {
      const mapping = this.channelMappings.find(
        (m) => m.ChannelNo === channelNo,
      );
      return mapping ? mapping.ChannelName : `Channel ${channelNo}`;
    },
    getPolicyActionText(policyAction) {
      const option = this.policyActionOptions.find(
        (item) => item.value === policyAction,
      );
      return option ? option.text : policyAction;
    },
  },
};
</script>

<style lang="scss" scoped>
.info-box {
  padding: 1rem;
  background: var(--background-color);
  border-radius: 4px;
  border: 1px solid var(--border-color);

  .info-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .info-sublabel {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.table-section {
  background: var(--background-color);
  border-radius: 4px;
  border: 1px solid var(--border-color);

  th {
    background: var(--table-header-bg);
    color: var(--table-header-color);
    font-weight: 600;
    border-bottom: 2px solid var(--border-color);
  }

  tr {
    &:hover {
      background-color: var(--table-hover-bg);
    }
  }

  td {
    vertical-align: middle;
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
