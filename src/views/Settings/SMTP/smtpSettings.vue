<template>
  <b-container fluid="xl">
    <page-title :description="$t('pageSmtp.pageDescription')" />
    <b-form novalidate @submit.prevent="handleSubmit">
      <page-section :section-title="$t('pageSmtp.primaryFormGroupLabel')">
        <div class="form-background p-3">
          <b-row>
            <b-col sm="12">
              <b-form-group>
                <b-form-checkbox
                  id="enable-primary-configuration"
                  v-model="primary.enableConfiguration"
                  data-test-id="primary-input-enableConfiguration"
                  switch
                  @change="enablePrimaryConfiguration"
                >
                  <span v-if="primary.enableConfiguration">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="primary.enableConfiguration">
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.authentication')">
                <b-form-checkbox
                  id="primary-authentication-enable"
                  v-model="primary.authentication"
                  data-test-id="primary-enable-authentication"
                  switch
                  @change="primaryAuthChange($event)"
                >
                  <span v-if="primary.authentication">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col sm="3">
              <b-form-group
                v-if="primary.authentication"
                :label="$t('pageSmtp.username')"
              >
                <b-form-input
                  v-if="primary.authentication"
                  id="primary-user-name"
                  v-model="primary.username"
                  data-test-id="smtp-primary-user-name"
                  :disabled="!primary.enableConfiguration"
                  :state="getValidationState($v.primary.username)"
                  @input="$v.primary.username.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.primary.username.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.primary.username.required &&
                      !$v.primary.username.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="3">
              <b-form-group
                v-if="primary.authentication"
                :label="$t('pageSmtp.password')"
              >
                <input-password-toggle>
                  <b-form-input
                    id="primary-password"
                    v-model="primary.password"
                    data-test-id="smtp-primary-password"
                    type="password"
                    :disabled="!primary.enableConfiguration"
                    :state="getValidationState($v.primary.password)"
                    @input="$v.primary.password.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.primary.password.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                    <template
                      v-if="
                        $v.primary.password.required &&
                        !$v.primary.password.pattern
                      "
                    >
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                </input-password-toggle>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="primary.enableConfiguration">
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.labelServerAddress')">
                <b-form-input
                  id="primary-server-address"
                  v-model="primary.serverAddress"
                  data-test-id="smtp-input-serverAddress"
                  :disabled="!primary.enableConfiguration"
                  :state="getValidationState($v.primary.serverAddress)"
                  @input="$v.primary.serverAddress.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.primary.serverAddress.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.primary.serverAddress.required &&
                      !$v.primary.serverAddress.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.labelPort')">
                <b-form-input
                  id="port"
                  v-model="primary.port"
                  :disabled="!primary.enableConfiguration"
                  :state="getValidationState($v.primary.port)"
                  @input="$v.primary.port.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.primary.port.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="$v.primary.port.required && !$v.primary.port.pattern"
                  >
                    {{ $t('pageSmtp.PortRangeRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.labelSenderEmailAddress')">
                <b-form-input
                  id="smtp-sender-email-address"
                  v-model="primary.senderEmailAddress"
                  data-test-id="smtp-input-senderEmailAddress"
                  :disabled="!primary.enableConfiguration"
                  :state="getValidationState($v.primary.senderEmailAddress)"
                  @input="$v.primary.senderEmailAddress.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.primary.senderEmailAddress.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template v-if="!$v.primary.senderEmailAddress.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="primary.enableConfiguration">
            <b-col>
              <b-button
                variant="link"
                :disabled="
                  primary.recipientCount >= 4 || !primary.enableConfiguration
                "
                @click="addPrimaryRecipientEmail"
              >
                <icon-add />{{ $t('pageSmtp.addRecipientEmailAddress') }}
              </b-button>
            </b-col>
          </b-row>
          <br />
          <b-row v-if="primary.enableConfiguration" sm="12">
            <b-col sm="3">
              <b-form-group
                id="smtp-recipient-email-address-1"
                :label="$t('pageSmtp.labelRecipientEmailAddress') + ' 1'"
              >
                <b-form-input
                  id="smtp-recipient-email-address"
                  v-model="primary.recipientEmailAddress1"
                  data-test-id="smtp-input-recipientEmailAddress-1"
                  :disabled="!primary.enableConfiguration"
                  :state="getValidationState($v.primary.recipientEmailAddress1)"
                  @input="$v.primary.recipientEmailAddress1.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.primary.recipientEmailAddress1.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template v-if="!$v.primary.recipientEmailAddress1.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col v-if="primary.recipientEmail2" sm="3">
              <b-form-group
                id="smtp-recipient-email-address-2"
                :label="$t('pageSmtp.labelRecipientEmailAddress') + ' 2'"
              >
                <b-form-input
                  v-model="primary.recipientEmailAddress2"
                  data-test-id="smtp-input-recipientEmailAddress-2"
                  :disabled="!primary.enableConfiguration"
                  :state="getValidationState($v.primary.recipientEmailAddress2)"
                  @input="$v.primary.recipientEmailAddress2.$touch()"
                />
                <b-button
                  variant="cancel"
                  class="input-action-btn cancel-btn"
                  @click="cancelPrimaryRecipientEmail('2')"
                >
                  <icon-misuse />
                </b-button>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.primary.recipientEmailAddress2.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col v-if="primary.recipientEmail3" sm="3">
              <b-form-group
                id="smtp-recipient-email-address-3"
                :label="
                  $t('pageSmtp.labelRecipientEmailAddress') +
                  (primary.recipientEmail2 ? ' 3' : ' 2')
                "
              >
                <b-form-input
                  v-model="primary.recipientEmailAddress3"
                  data-test-id="smtp-input-recipientEmailAddress-3"
                  :disabled="!primary.enableConfiguration"
                  :state="getValidationState($v.primary.recipientEmailAddress3)"
                  @input="$v.primary.recipientEmailAddress3.$touch()"
                />
                <b-button
                  variant="cancel"
                  class="input-action-btn cancel-btn"
                  @click="cancelPrimaryRecipientEmail('3')"
                >
                  <icon-misuse />
                </b-button>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.primary.recipientEmailAddress3.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col v-if="primary.recipientEmail4" sm="3">
              <b-form-group
                id="smtp-recipient-email-address-4"
                :label="
                  $t('pageSmtp.labelRecipientEmailAddress') +
                  (primary.recipientEmail2 && primary.recipientEmail3
                    ? ' 4'
                    : primary.recipientEmail2 || primary.recipientEmail3
                    ? ' 3'
                    : ' 2')
                "
              >
                <b-form-input
                  v-model="primary.recipientEmailAddress4"
                  data-test-id="smtp-input-recipientEmailAddress-4"
                  :disabled="!primary.enableConfiguration"
                  :state="getValidationState($v.primary.recipientEmailAddress4)"
                  @input="$v.primary.recipientEmailAddress4.$touch()"
                />
                <b-button
                  variant="cancel"
                  class="input-action-btn cancel-btn"
                  @click="cancelPrimaryRecipientEmail('4')"
                >
                  <icon-misuse />
                </b-button>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.primary.recipientEmailAddress4.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="primary.enableConfiguration">
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.tlsEnable')">
                <b-form-checkbox
                  id="primary-tls-enable"
                  v-model="primary.tlsEnable"
                  :disabled="!primary.enableConfiguration"
                  data-test-id="enable-tls"
                  switch
                >
                  <span v-if="primary.tlsEnable">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
      </page-section>
      <page-section :section-title="$t('pageSmtp.secondaryFormGroupLabel')">
        <div class="form-background p-3">
          <b-row>
            <b-col sm="12">
              <b-form-group>
                <b-form-checkbox
                  id="enable-secondary-configuration"
                  v-model="secondary.enableConfiguration"
                  data-test-id="secondary-input-enableConfiguration"
                  switch
                  @change="enableSecondaryConfiguration"
                >
                  <span v-if="secondary.enableConfiguration">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="secondary.enableConfiguration">
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.authentication')">
                <b-form-checkbox
                  id="secondary-authentication-enable"
                  v-model="secondary.authentication"
                  data-test-id="secondary-enable-authentication"
                  switch
                  @change="secondaryAuthChange"
                >
                  <span v-if="secondary.authentication">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col sm="3">
              <b-form-group
                v-if="secondary.authentication"
                :label="$t('pageSmtp.username')"
              >
                <b-form-input
                  id="secondary-user-name"
                  v-model="secondary.username"
                  data-test-id="smtp-secondary-user-name"
                  :disabled="!secondary.enableConfiguration"
                  :state="getValidationState($v.secondary.username)"
                  @input="$v.secondary.username.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.secondary.username.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.secondary.username.required &&
                      !$v.secondary.username.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="3">
              <b-form-group
                v-if="secondary.authentication"
                :label="$t('pageSmtp.password')"
              >
                <input-password-toggle>
                  <b-form-input
                    id="secondary-password"
                    v-model="secondary.password"
                    data-test-id="smtp-secondary-password"
                    type="password"
                    :disabled="!secondary.enableConfiguration"
                    :state="getValidationState($v.secondary.password)"
                    @input="$v.secondary.password.$touch()"
                  />
                  <b-form-invalid-feedback role="alert">
                    <template v-if="!$v.secondary.password.required">
                      {{ $t('global.form.fieldRequired') }}
                    </template>
                    <template
                      v-if="
                        $v.secondary.password.required &&
                        !$v.secondary.password.pattern
                      "
                    >
                      {{ $t('global.form.invalidFormat') }}
                    </template>
                  </b-form-invalid-feedback>
                </input-password-toggle>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="secondary.enableConfiguration">
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.labelServerAddress')">
                <b-form-input
                  id="secondary-server-address"
                  v-model="secondary.serverAddress"
                  data-test-id="smtp-input-serverAddress"
                  :disabled="!secondary.enableConfiguration"
                  :state="getValidationState($v.secondary.serverAddress)"
                  @input="$v.secondary.serverAddress.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.secondary.serverAddress.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.secondary.serverAddress.required &&
                      !$v.secondary.serverAddress.pattern
                    "
                  >
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.labelPort')">
                <b-form-input
                  id="port"
                  v-model="secondary.port"
                  :disabled="!secondary.enableConfiguration"
                  :state="getValidationState($v.secondary.port)"
                  @input="$v.secondary.port.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.secondary.port.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template
                    v-if="
                      $v.secondary.port.required && !$v.secondary.port.pattern
                    "
                  >
                    {{ $t('pageSmtp.PortRangeRequired') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.labelSenderEmailAddress')">
                <b-form-input
                  id="smtp-sender-email-address"
                  v-model="secondary.senderEmailAddress"
                  data-test-id="smtp-input-senderEmailAddress"
                  :disabled="!secondary.enableConfiguration"
                  :state="getValidationState($v.secondary.senderEmailAddress)"
                  @input="$v.secondary.senderEmailAddress.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.secondary.senderEmailAddress.required">
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template v-if="!$v.secondary.senderEmailAddress.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="secondary.enableConfiguration">
            <b-col>
              <b-button
                variant="link"
                :disabled="
                  secondary.recipientCount >= 4 ||
                  !secondary.enableConfiguration
                "
                @click="addSecondaryRecipientEmail"
              >
                <icon-add />{{ $t('pageSmtp.addRecipientEmailAddress') }}
              </b-button>
            </b-col>
          </b-row>
          <br />
          <b-row v-if="secondary.enableConfiguration" sm="12">
            <b-col sm="3">
              <b-form-group
                id="smtp-recipient-email-address-1"
                :label="$t('pageSmtp.labelRecipientEmailAddress') + ' 1'"
              >
                <b-form-input
                  v-model="secondary.recipientEmailAddress1"
                  data-test-id="smtp-input-recipientEmailAddress-1"
                  :disabled="!secondary.enableConfiguration"
                  :state="
                    getValidationState($v.secondary.recipientEmailAddress1)
                  "
                  @input="$v.secondary.recipientEmailAddress1.$touch()"
                />
                <b-form-invalid-feedback role="alert">
                  <template
                    v-if="!$v.secondary.recipientEmailAddress1.required"
                  >
                    {{ $t('global.form.fieldRequired') }}
                  </template>
                  <template v-if="!$v.secondary.recipientEmailAddress1.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col v-if="secondary.recipientEmail2" sm="3">
              <b-form-group
                id="smtp-recipient-email-address-2"
                :label="$t('pageSmtp.labelRecipientEmailAddress') + ' 2'"
              >
                <b-form-input
                  v-model="secondary.recipientEmailAddress2"
                  data-test-id="smtp-input-recipientEmailAddress-2"
                  :disabled="!secondary.enableConfiguration"
                  :state="
                    getValidationState($v.secondary.recipientEmailAddress2)
                  "
                  @input="$v.secondary.recipientEmailAddress2.$touch()"
                />
                <b-button
                  variant="cancel"
                  class="input-action-btn cancel-btn"
                  @click="cancelSecondaryRecipientEmail('2')"
                >
                  <icon-misuse />
                </b-button>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.secondary.recipientEmailAddress2.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col v-if="secondary.recipientEmail3" sm="3">
              <b-form-group
                id="smtp-recipient-email-address-3"
                :label="
                  $t('pageSmtp.labelRecipientEmailAddress') +
                  (secondary.recipientEmail2 ? ' 3' : ' 2')
                "
              >
                <b-form-input
                  v-model="secondary.recipientEmailAddress3"
                  data-test-id="smtp-input-recipientEmailAddress-3"
                  :disabled="!secondary.enableConfiguration"
                  :state="
                    getValidationState($v.secondary.recipientEmailAddress3)
                  "
                  @input="$v.secondary.recipientEmailAddress3.$touch()"
                />
                <b-button
                  variant="cancel"
                  class="input-action-btn cancel-btn"
                  @click="cancelSecondaryRecipientEmail('3')"
                >
                  <icon-misuse />
                </b-button>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.secondary.recipientEmailAddress3.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col v-if="secondary.recipientEmail4" sm="3">
              <b-form-group
                id="smtp-recipient-email-address-4"
                :label="
                  $t('pageSmtp.labelRecipientEmailAddress') +
                  (secondary.recipientEmail2 && secondary.recipientEmail3
                    ? ' 4'
                    : secondary.recipientEmail2 || secondary.recipientEmail3
                    ? ' 3'
                    : ' 2')
                "
              >
                <b-form-input
                  v-model="secondary.recipientEmailAddress4"
                  data-test-id="smtp-input-recipientEmailAddress-4"
                  :disabled="!secondary.enableConfiguration"
                  :state="
                    getValidationState($v.secondary.recipientEmailAddress4)
                  "
                  @input="$v.secondary.recipientEmailAddress4.$touch()"
                />
                <b-button
                  variant="cancel"
                  class="input-action-btn cancel-btn"
                  @click="cancelSecondaryRecipientEmail('4')"
                >
                  <icon-misuse />
                </b-button>
                <b-form-invalid-feedback role="alert">
                  <template v-if="!$v.secondary.recipientEmailAddress4.email">
                    {{ $t('global.form.invalidFormat') }}
                  </template>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="secondary.enableConfiguration">
            <b-col sm="3">
              <b-form-group :label="$t('pageSmtp.tlsEnable')">
                <b-form-checkbox
                  id="secondary-tls-enable"
                  v-model="secondary.tlsEnable"
                  :disabled="!secondary.enableConfiguration"
                  data-test-id="secondary-enable-tls"
                  switch
                >
                  <span v-if="secondary.tlsEnable">
                    {{ $t('global.status.enabled') }}
                  </span>
                  <span v-else>{{ $t('global.status.disabled') }}</span>
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
      </page-section>
      <page-section
        v-if="
          (primary.enableConfiguration && primary.tlsEnable) ||
          (secondary.enableConfiguration && secondary.tlsEnable)
        "
        :section-title="$t('pageSmtp.certificate')"
      >
        <div class="form-background p-3">
          <b-row>
            <b-col sm="4">
              <b-form-group :label="$t('pageSmtp.cacertPEM')">
                <form-file
                  id="certificate-cacertPEM"
                  v-model="cacertPEM"
                  accept=".pem"
                  @input="onFileUpload($event, 'CacertPEM')"
                >
                </form-file>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group :label="$t('pageSmtp.serverCRT')">
                <form-file
                  id="certificate-serverCRT"
                  v-model="primary.serverCRT"
                  accept=".crt"
                  @input="onFileUpload($event, 'ServerCRT')"
                >
                </form-file>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group :label="$t('pageSmtp.serverKey')">
                <form-file
                  id="certificate-serverKey"
                  v-model="serverKey"
                  accept=".key"
                  @input="onFileUpload($event, 'ServerKey')"
                >
                </form-file>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
      </page-section>
      <b-row class="mt-4 mb-5">
        <b-col sm="2">
          <b-button
            variant="primary"
            type="submit"
            data-test-id="smtp-button-saveSettings"
          >
            {{ $t('global.action.saveSettings') }}
          </b-button>
        </b-col>
        <b-col sm="3">
          <b-button
            variant="primary"
            data-test-id="alertDestination-button-sendTestAlert"
            :disabled="!sendTestAlertDisabled"
            @click="sendTestAlert"
          >
            {{ $t('pageSmtp.sendTestAlert') }}
          </b-button>
        </b-col>
      </b-row>
    </b-form>
    <modal-send-alert />
  </b-container>
</template>

<script>
import { requiredIf, email } from 'vuelidate/lib/validators';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin';
import LoadingBarMixin, { loading } from '@/components/Mixins/LoadingBarMixin';
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import IconAdd from '@carbon/icons-vue/es/add--alt/20';
import IconMisuse from '@carbon/icons-vue/es/misuse/20';
import ModalSendAlert from './ModalSendAlert.vue';
import FormFile from '@/components/Global/FormFile';
import InputPasswordToggle from '@/components/Global/InputPasswordToggle';

export default {
  name: 'SmtpSettings',
  components: {
    PageTitle,
    PageSection,
    IconAdd,
    IconMisuse,
    ModalSendAlert,
    FormFile,
    InputPasswordToggle,
  },
  mixins: [BVToastMixin, VuelidateMixin, LoadingBarMixin],
  data() {
    return {
      primary: {
        serverAddress: '',
        port: null,
        senderEmailAddress: '',
        recipientEmailAddress1: '',
        recipientEmailAddress2: '',
        recipientEmailAddress3: '',
        recipientEmailAddress4: '',
        enableConfiguration: false,
        tlsEnable: false,
        authentication: false,
        username: '',
        password: '',
        recipientCount: 1,
        recipientEmail2: false,
        recipientEmail3: false,
        recipientEmail4: false,
      },
      secondary: {
        serverAddress: '',
        port: null,
        senderEmailAddress: '',
        recipientEmailAddress1: '',
        recipientEmailAddress2: '',
        recipientEmailAddress3: '',
        recipientEmailAddress4: '',
        enableConfiguration: false,
        tlsEnable: false,
        authentication: false,
        username: '',
        password: '',
        recipientCount: 1,
        recipientEmail2: false,
        recipientEmail3: false,
        recipientEmail4: false,
      },
      cacertPEM: '',
      serverCRT: '',
      serverKey: '',
      loading,
      sendTestAlertDisabled: false,
    };
  },
  watch: {
    isSMTPEnabled: function (value) {
      this.primary.enableConfiguration = value;
    },
  },
  validations() {
    return {
      primary: {
        serverAddress: {
          required: requiredIf(function (primary) {
            if (primary.enableConfiguration) {
              return true;
            }
          }),
          pattern: function (val, primary) {
            if (primary.enableConfiguration) {
              return this.serverAddressValidation(val);
            } else return true;
          },
        },
        port: {
          required: requiredIf(function (primary) {
            if (primary.enableConfiguration) {
              return true;
            }
          }),
          pattern: function (val, primary) {
            if (primary.enableConfiguration) {
              return this.portValidation(val);
            } else return true;
          },
        },
        senderEmailAddress: {
          required: requiredIf(function (primary) {
            if (primary.enableConfiguration) {
              return true;
            }
          }),
          email,
        },
        recipientEmailAddress1: {
          required: requiredIf(function (primary) {
            if (primary.enableConfiguration) {
              return true;
            }
          }),
          email,
        },
        recipientEmailAddress2: {
          email,
        },
        recipientEmailAddress3: {
          email,
        },
        recipientEmailAddress4: {
          email,
        },
        username: {
          required: requiredIf(function (primary) {
            if (primary.enableConfiguration && primary.authentication) {
              return true;
            }
          }),
        },
        password: {
          required: requiredIf(function (primary) {
            if (primary.enableConfiguration && primary.authentication) {
              return true;
            }
          }),
        },
      },
      secondary: {
        serverAddress: {
          required: requiredIf(function (secondary) {
            if (secondary.enableConfiguration) {
              return true;
            }
          }),
          pattern: function (val, secondary) {
            if (secondary.enableConfiguration) {
              return this.serverAddressValidation(val);
            } else return true;
          },
        },
        port: {
          required: requiredIf(function (secondary) {
            if (secondary.enableConfiguration) {
              return true;
            }
          }),
          pattern: function (val, secondary) {
            if (secondary.enableConfiguration) {
              return this.portValidation(val);
            } else return true;
          },
        },
        senderEmailAddress: {
          required: requiredIf(function (secondary) {
            if (secondary.enableConfiguration) {
              return true;
            }
          }),
          email,
        },
        recipientEmailAddress1: {
          required: requiredIf(function (secondary) {
            if (secondary.enableConfiguration) {
              return true;
            }
          }),
          email,
        },
        recipientEmailAddress2: {
          email,
        },
        recipientEmailAddress3: {
          email,
        },
        recipientEmailAddress4: {
          email,
        },
        username: {
          required: requiredIf(function (secondary) {
            if (secondary.enableConfiguration && secondary.authentication) {
              return true;
            }
          }),
        },
        password: {
          required: requiredIf(function (secondary) {
            if (secondary.enableConfiguration && secondary.authentication) {
              return true;
            }
          }),
        },
      },
    };
  },
  created() {
    this.startLoader();
    this.$store.dispatch('smtp/getSMTPdata').finally(() => {
      this.endLoader();
      this.primary.enableConfiguration = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].smtpServiceEnabled;
      this.secondary.enableConfiguration = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].smtpServiceEnabled;
      this.sendTestAlertDisabled = this.$store.getters['smtp/sendTestAlert'];
      this.updateSMTPPrimaryData();
      this.updateSMTPSecondaryData();
    });
  },
  methods: {
    handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      console.log('recipientEmailAddress', this.primary.recipientEmailAddress);
      let data = {
        Oem: {
          OpenBmc: {
            SMTP: {
              PrimaryConfiguration: { Enable: false },
              SecondaryConfiguration: { Enable: false },
            },
          },
        },
      };
      if (this.primary.enableConfiguration) {
        let recipientMail = [];
        recipientMail.push(this.primary.recipientEmailAddress1);
        this.primary.recipientEmailAddress2
          ? recipientMail.push(this.primary.recipientEmailAddress2)
          : null;
        this.primary.recipientEmailAddress3
          ? recipientMail.push(this.primary.recipientEmailAddress3)
          : null;
        this.primary.recipientEmailAddress4
          ? recipientMail.push(this.primary.recipientEmailAddress4)
          : null;
        const primaryConfig = {
          Authentication: this.primary.authentication,
          Enable: this.primary.enableConfiguration,
          Host: this.primary.serverAddress,
          Port: parseInt(this.primary.port),
          Recipient: recipientMail,
          Sender: this.primary.senderEmailAddress,
          TLSEnable: this.primary.tlsEnable,
        };
        if (this.primary.authentication) {
          primaryConfig.UserName = this.primary.username;
          primaryConfig.Password = this.primary.password;
        }
        data.Oem.OpenBmc.SMTP.PrimaryConfiguration = primaryConfig;
      }
      if (this.secondary.enableConfiguration) {
        let recipientMail = [];
        recipientMail.push(this.secondary.recipientEmailAddress1);
        this.secondary.recipientEmailAddress2
          ? recipientMail.push(this.secondary.recipientEmailAddress2)
          : null;
        this.secondary.recipientEmailAddress3
          ? recipientMail.push(this.secondary.recipientEmailAddress3)
          : null;
        this.secondary.recipientEmailAddress4
          ? recipientMail.push(this.secondary.recipientEmailAddress4)
          : null;
        const secondaryConfig = {
          Authentication: this.secondary.authentication,
          Enable: this.secondary.enableConfiguration,
          Host: this.secondary.serverAddress,
          Port: parseInt(this.secondary.port),
          Recipient: recipientMail,
          Sender: this.secondary.senderEmailAddress,
          TLSEnable: this.secondary.tlsEnable,
        };
        if (this.secondary.authentication) {
          secondaryConfig.UserName = this.secondary.username;
          secondaryConfig.Password = this.secondary.password;
        }
        data.Oem.OpenBmc.SMTP.SecondaryConfiguration = secondaryConfig;
      }

      this.startLoader();
      this.$store
        .dispatch('smtp/setSMTPdata', data)
        .then((success) => {
          this.primary.enableConfiguration = this.$store.getters[
            'smtp/isPrimaryConfig'
          ].smtpServiceEnabled;
          this.secondary.enableConfiguration = this.$store.getters[
            'smtp/isSecondaryConfig'
          ].smtpServiceEnabled;
          this.sendTestAlertDisabled = this.$store.getters[
            'smtp/sendTestAlert'
          ];
          this.updateSMTPPrimaryData();
          this.updateSMTPSecondaryData();
          this.successToast(success);
        })
        .catch(({ message }) => {
          this.errorToast(message);
        })
        .finally(() => {
          this.$v.primary.$reset();
          this.endLoader();
        });
    },
    enablePrimaryConfiguration() {
      this.resetPrimary();
    },
    enableSecondaryConfiguration() {
      this.resetSecondary();
    },
    resetPrimary() {
      this.updateSMTPPrimaryData();
    },
    resetSecondary() {
      this.updateSMTPSecondaryData();
    },
    updateSMTPPrimaryData() {
      this.primary.serverAddress = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].serverAddress;
      this.primary.port = this.$store.getters['smtp/isPrimaryConfig'].port;
      this.primary.senderEmailAddress = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].senderEmailAddress;
      this.primary.recipientEmailAddress1 = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].recipientEmailAddress1;
      this.primary.recipientEmailAddress2 = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].recipientEmailAddress2;
      this.primary.recipientEmailAddress3 = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].recipientEmailAddress3;
      this.primary.recipientEmailAddress4 = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].recipientEmailAddress4;
      this.primary.tlsEnable = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].tlsEnable;
      this.primary.authentication = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].authentication;
      this.primary.username = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].username;
      this.primary.password = this.$store.getters[
        'smtp/isPrimaryConfig'
      ].password;
      this.primary.recipientEmail2 = this.primary.recipientEmailAddress2
        ? true
        : false;
      this.primary.recipientEmail3 = this.primary.recipientEmailAddress3
        ? true
        : false;
      this.primary.recipientEmail4 = this.primary.recipientEmailAddress4
        ? true
        : false;
      this.primary.recipientCount = 1;
      if (this.primary.recipientEmailAddress2) {
        this.primary.recipientCount = 2;
      }
      if (this.primary.recipientEmailAddress3) {
        this.primary.recipientCount = 3;
      }
      if (this.primary.recipientEmailAddress4) {
        this.primary.recipientCount = 4;
      }
    },
    updateSMTPSecondaryData() {
      this.secondary.serverAddress = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].serverAddress;
      this.secondary.port = this.$store.getters['smtp/isSecondaryConfig'].port;
      this.secondary.senderEmailAddress = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].senderEmailAddress;
      this.secondary.recipientEmailAddress1 = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].recipientEmailAddress1;
      this.secondary.recipientEmailAddress2 = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].recipientEmailAddress2;
      this.secondary.recipientEmailAddress3 = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].recipientEmailAddress3;
      this.secondary.recipientEmailAddress4 = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].recipientEmailAddress4;
      this.secondary.tlsEnable = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].tlsEnable;
      this.secondary.authentication = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].authentication;
      this.secondary.username = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].username;
      this.secondary.password = this.$store.getters[
        'smtp/isSecondaryConfig'
      ].password;
      this.secondary.recipientEmail2 = this.secondary.recipientEmailAddress2
        ? true
        : false;
      this.secondary.recipientEmail3 = this.secondary.recipientEmailAddress3
        ? true
        : false;
      this.secondary.recipientEmail4 = this.secondary.recipientEmailAddress4
        ? true
        : false;
      this.secondary.recipientCount = 1;
      if (this.secondary.recipientEmailAddress2) {
        this.secondary.recipientCount = 2;
      }
      if (this.secondary.recipientEmailAddress3) {
        this.secondary.recipientCount = 3;
      }
      if (this.secondary.recipientEmailAddress4) {
        this.secondary.recipientCount = 4;
      }
    },
    serverAddressValidation(value) {
      if (
        (!/((^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$)|(^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$))/.test(
          value
        ) ||
          /^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*\\:)*?:?0*1$/.test(
            value
          ) ||
          (value != undefined &&
            value != null &&
            (String(value).charAt(0) == '0' ||
              '#255.255.255.0#0.24.56.4#255.255.255.255#'.indexOf(
                '#' + value + '#'
              ) > -1)) ||
          value.trim() == '::') &&
        !/^(?=.{1,253}\.?$)([a-z][a-z0-9\\-]{0,61}[a-z0-9]\.)+([a-z]{2,63}|xn--[a-z0-9\\-]{1,58}[a-z0-9])\.?$/i.test(
          value
        )
      ) {
        return false;
      } else {
        return true;
      }
    },
    portValidation(value) {
      if (!(value >= 1 && value <= 65535 && /^([0-9]*)$/.test(value))) {
        return false;
      } else {
        return true;
      }
    },
    primaryAuthChange() {
      this.primary.username = '';
      this.primary.password = '';
    },
    secondaryAuthChange() {
      this.secondary.username = '';
      this.secondary.password = '';
    },
    addPrimaryRecipientEmail() {
      this.primary.recipientCount++;
      if (!this.primary.recipientEmail2) {
        this.primary.recipientEmail2 = true;
      } else if (!this.primary.recipientEmail3) {
        this.primary.recipientEmail3 = true;
      } else if (!this.primary.recipientEmail4) {
        this.primary.recipientEmail4 = true;
      }
    },
    addSecondaryRecipientEmail() {
      this.secondary.recipientCount++;
      if (!this.secondary.recipientEmail2) {
        this.secondary.recipientEmail2 = true;
      } else if (!this.secondary.recipientEmail3) {
        this.secondary.recipientEmail3 = true;
      } else if (!this.secondary.recipientEmail4) {
        this.secondary.recipientEmail4 = true;
      }
    },
    cancelRecipient(id) {
      document.getElementById(id).style.display = 'none';
      this.primary.recipientCount--;
    },
    cancelPrimaryRecipientEmail(id) {
      if (id.indexOf('2') != -1) {
        this.primary.recipientEmail2 = false;
        this.primary.recipientEmailAddress2 = '';
      }
      if (id.indexOf('3') != -1) {
        this.primary.recipientEmail3 = false;
        this.primary.recipientEmailAddress3 = '';
      }
      if (id.indexOf('4') != -1) {
        this.primary.recipientEmail4 = false;
        this.primary.recipientEmailAddress4 = '';
      }
      this.primary.recipientCount--;
    },
    cancelSecondaryRecipientEmail(id) {
      if (id.indexOf('2') != -1) {
        this.secondary.recipientEmail2 = false;
        this.secondary.recipientEmailAddress2 = '';
      }
      if (id.indexOf('3') != -1) {
        this.secondary.recipientEmail3 = false;
        this.secondary.recipientEmailAddress3 = '';
      }
      if (id.indexOf('4') != -1) {
        this.secondary.recipientEmail4 = false;
        this.secondary.recipientEmailAddress4 = '';
      }
      this.secondary.recipientCount--;
    },
    sendTestAlert() {
      this.$bvModal.show('modal-send-alert');
    },
    onFileUpload(file, type) {
      if (file) {
        this.startLoader();
        this.$store
          .dispatch('smtp/addNewCertificate', { file, type })
          .then((success) => this.successToast(success))
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.cancel-btn {
  padding: 6px !important;
  margin-top: 29px;
  margin-right: 16px;
}
.btn-cancel {
  font-weight: $headings-font-weight;
  text-decoration: none !important;
  color: #cb2026;
  &:hover {
    color: #d24145;
  }
  &:focus {
    box-shadow: inset 0 0 0 0;
    color: #d24145;
    outline: none;
  }
  &:disabled {
    box-shadow: $btn-focus-box-shadow;
  }
}
</style>
