<template>
  <div>
    <div v-if="policiesOverlay">
      <b-overlay :show="true" opacity="0.6" no-wrap fixed class="full-overlay">
        <template #overlay>
          <div></div>
        </template>
      </b-overlay>
    </div>
    <b-container fluid="xl">
      <page-title />
      <b-row>
        <b-col md="12">
          <b-row>
            <b-col>
              <page-section
                class="page-section"
                :section-title="$t('pagePolicies.servicesPolicies')"
              >
                <b-row v-if="!modifySSHPolicyDisabled" class="setting-section">
                  <b-col
                    lg="8"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-4 w-75">
                      <dt>{{ $t('pagePolicies.ssh') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.sshDescription') }}
                      </dd>
                    </dl>
                    <b-form-checkbox
                      id="sshSwitch"
                      v-model="sshProtocolState"
                      data-test-id="policies-toggle-bmcShell"
                      switch
                      :disabled="userPrivilege !== privilegesId.admin"
                      @change="changeSshProtocolState"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.ssh') }}
                      </span>
                      <span v-if="sshProtocolState">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <b-row class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-4 w-75">
                      <dt>{{ $t('pagePolicies.ipmi') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.ipmiDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-checkbox
                      id="ipmiSwitch"
                      v-model="ipmiProtocolState"
                      data-test-id="polices-toggle-networkIpmi"
                      switch
                      :disabled="userPrivilege !== privilegesId.admin"
                      @change="changeIpmiProtocolState"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.ipmi') }}
                      </span>
                      <span v-if="ipmiProtocolState">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <b-row v-if="DisplaySection" class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-4 w-75">
                      <dt>{{ $t('pagePolicies.vtpm') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.vtpmDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-checkbox
                      id="vtpmSwitch"
                      v-model="vtpmState"
                      data-test-id="policies-toggle-vtpm"
                      switch
                      @change="changeVtpmState"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.vtpm') }}
                      </span>
                      <span v-if="vtpmState">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <b-row v-if="DisplaySection" class="setting-section">
                  <b-col class="d-flex align-items-center">
                    <dl class="mt-3 mr-4 w-75">
                      <dt>{{ $t('pagePolicies.rtad') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.rtadDescription') }}
                      </dd>
                    </dl>
                    <b-form-checkbox
                      id="rtadSwitch"
                      v-model="rtadState"
                      data-test-id="policies-toggle-rtad"
                      switch
                      @change="changeRtadState"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.rtad') }}
                      </span>
                      <span v-if="rtadState">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <!-- KVM Section with Dual Host Support -->
                <b-row
                  v-if="!isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')"
                  class="setting-section"
                >
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-4 w-75">
                      <dt>{{ $t('pagePolicies.kvm') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.kvmDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                </b-row>
                <b-row
                  v-if="!isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')"
                  class="setting-section"
                >
                  <b-col lg="7">
                    <!-- Tab Navigation for Dual Hosts -->
                    <b-card no-body class="vm-card">
                      <b-tabs pills card>
                        <!-- KVM Tab -->
                        <b-tab :title="$t('pagePolicies.kvm')" active>
                          <b-row class="mb-3">
                            <b-col
                              lg="12"
                              class="d-flex align-items-center justify-content-between"
                            >
                              <span>{{ $t('pagePolicies.enableKvm') }}</span>
                              <b-form-checkbox
                                id="kvmSwitchHost1"
                                v-model="kvmState"
                                data-test-id="policies-toggle-kvm-host1"
                                switch
                                :disabled="userPrivilege !== privilegesId.admin"
                                @change="changeKmvState"
                              >
                                <span class="sr-only">
                                  {{ $t('pagePolicies.kvm') }} - Host 1
                                </span>
                                <span v-if="kvmState">
                                  {{ $t('global.status.enabled') }}
                                </span>
                                <span v-else>{{
                                  $t('global.status.disabled')
                                }}</span>
                              </b-form-checkbox>
                            </b-col>
                          </b-row>

                          <div v-if="kvmState && !isMultiHostEnabled">
                            <b-row>
                              <b-col cols="12" md="4" class="mb-4">
                                <b-form-group
                                  id="input-group-kvm-port-host1"
                                  :label="$t('pagePolicies.kvmPortValue')"
                                  label-for="input-kvm-port-host1"
                                >
                                  <b-form-input
                                    id="input-kvm-port-host1"
                                    v-model.number="kvmPort"
                                    data-test-id="input-kvmPort-host1"
                                    type="number"
                                    :disabled="
                                      userPrivilege !== privilegesId.admin
                                    "
                                    aria-describedby="power-help-text"
                                    :state="getValidationState($v.kvmPort)"
                                    @input="$v.kvmPort.$touch()"
                                  ></b-form-input>
                                  <b-form-invalid-feedback role="alert">
                                    <template v-if="!$v.kvmPort.required">
                                      {{ $t('global.form.fieldRequired') }}
                                    </template>
                                    <template v-else-if="!$v.kvmPort.pattern">
                                      {{
                                        $t('pagePolicies.kvmPortValueLimits', {
                                          min: 1,
                                          max: 65535,
                                        })
                                      }}
                                    </template>
                                  </b-form-invalid-feedback>
                                </b-form-group>
                              </b-col>
                              <b-col
                                cols="12"
                                md="3"
                                class="d-flex align-items-center mb-3"
                              >
                                <b-button
                                  variant="primary"
                                  type="submit"
                                  :disabled="
                                    userPrivilege !== privilegesId.admin
                                  "
                                  data-test-id="button-saveKVMPortValue-host1"
                                  @click="saveKVMPortValue"
                                >
                                  <icon-save />
                                  {{ $t('global.action.save') }}
                                </b-button>
                              </b-col>
                            </b-row>
                          </div>
                        </b-tab>

                        <!-- KVM 1 Tab -->
                        <b-tab
                          v-if="isMultiHostEnabled"
                          :title="$t('pagePolicies.policeskvm1')"
                        >
                          <b-row class="mb-3">
                            <b-col
                              lg="12"
                              class="d-flex align-items-center justify-content-between"
                            >
                              <span>{{ $t('pagePolicies.enableKvm1') }}</span>
                              <b-form-checkbox
                                id="kvmSwitchHost2"
                                v-model="kvmStateHost2"
                                data-test-id="policies-toggle-kvm-host2"
                                switch
                                :disabled="userPrivilege !== privilegesId.admin"
                                @change="changeKmvStateHost2"
                              >
                                <span class="sr-only">
                                  {{ $t('pagePolicies.kvm') }} - Host 2
                                </span>
                                <span v-if="kvmStateHost2">
                                  {{ $t('global.status.enabled') }}
                                </span>
                                <span v-else>{{
                                  $t('global.status.disabled')
                                }}</span>
                              </b-form-checkbox>
                            </b-col>
                          </b-row>

                          <!-- <div>
                            <b-row>
                              <b-col cols="12" md="4" class="mb-4">
                                <b-form-group
                                  id="input-group-kvm-port-host2"
                                  :label="$t('pagePolicies.kvmPortValue')"
                                  label-for="input-kvm-port-host2"
                                >
                                  <b-form-input
                                    id="input-kvm-port-host2"
                                    v-model.number="kvmPortHost2"
                                    data-test-id="input-kvmPort-host2"
                                    type="number"
                                    :disabled="
                                      userPrivilege !== privilegesId.admin
                                    "
                                    aria-describedby="power-help-text"
                                    :state="getValidationState($v.kvmPortHost2)"
                                    @input="$v.kvmPortHost2.$touch()"
                                  ></b-form-input>
                                  <b-form-invalid-feedback role="alert">
                                    <template v-if="!$v.kvmPortHost2.required">
                                      {{ $t('global.form.fieldRequired') }}
                                    </template>
                                    <template
                                      v-else-if="
                                        $v.kvmPortHost2.required &&
                                        !$v.kvmPortHost2.pattern
                                      "
                                    >
                                      {{
                                        $t('pagePolicies.kvmPortValueLimits', {
                                          min: 1,
                                          max: 65535,
                                        })
                                      }}
                                    </template>
                                  </b-form-invalid-feedback>
                                </b-form-group>
                              </b-col>
                              <b-col
                                cols="12"
                                md="3"
                                class="d-flex align-items-center mb-3"
                              >
                                <b-button
                                  variant="primary"
                                  type="submit"
                                  :disabled="
                                    userPrivilege !== privilegesId.admin
                                  "
                                  data-test-id="button-saveKVMPortValue-host2"
                                  @click="saveKVMPortValueHost2"
                                >
                                  <icon-save />
                                  {{ $t('global.action.save') }}
                                </b-button>
                              </b-col>
                            </b-row>
                          </div> -->
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </b-col>
                </b-row>
                <b-row
                  v-if="!isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')"
                  class="setting-section"
                >
                  <b-col
                    cols="3"
                    class="d-flex align-items-center mt-3 mr-4 w-75"
                  >
                    <b-form-group
                      id="input-group-web-port"
                      :label="$t('pagePolicies.webPortValue')"
                      label-for="input-web-port"
                    >
                      <b-form-input
                        id="input-web-port"
                        v-model.number="webPort"
                        data-test-id="input-webPort"
                        type="number"
                        :disabled="userPrivilege !== privilegesId.admin"
                        aria-describedby="power-help-text"
                        :state="getValidationState($v.webPort)"
                        @input="$v.webPort.$touch()"
                      ></b-form-input>
                      <b-form-invalid-feedback role="alert">
                        <template v-if="!$v.webPort.required">
                          {{ $t('global.form.fieldRequired') }}
                        </template>
                        <template v-else-if="!$v.webPort.pattern">
                          {{
                            $t('pagePolicies.webPortValueLimits', {
                              min: 1,
                              max: 65535,
                            })
                          }}
                        </template>
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col class="d-flex align-items-center">
                    <b-button
                      variant="primary"
                      type="submit"
                      :disabled="userPrivilege !== privilegesId.admin"
                      data-test-id="button-saveWebPortValue"
                      @click="saveWebPortValue"
                    >
                      <icon-save />
                      {{ $t('global.action.save') }}
                    </b-button>
                  </b-col>
                </b-row>
                <!-- Virtual Media Section with Dual Host Support -->
                <b-row
                  v-if="!isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')"
                  class="setting-section"
                >
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-4 w-75">
                      <dt>{{ $t('pagePolicies.vmc') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.vmcDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                </b-row>
                <b-row
                  v-if="!isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED')"
                  class="setting-section"
                >
                  <b-col lg="7">
                    <!-- Tab Navigation for Dual Hosts -->
                    <b-card no-body class="vm-card">
                      <b-tabs pills card>
                        <!-- Host 1 Tab -->
                        <b-tab :title="$t('pagePolicies.vmc')" active>
                          <b-row class="mb-3">
                            <b-col
                              lg="12"
                              class="d-flex align-items-center justify-content-between"
                            >
                              <span>{{
                                $t('pagePolicies.enableVirtualMedia')
                              }}</span>
                              <b-form-checkbox
                                id="vmcSwitchHost1"
                                v-model="vmcState"
                                data-test-id="policies-toggle-vmc-host1"
                                switch
                                :disabled="userPrivilege !== privilegesId.admin"
                                @change="changeVmcState"
                              >
                                <span class="sr-only">
                                  {{ $t('pagePolicies.vmc') }} - Host 1
                                </span>
                                <span v-if="vmcState">
                                  {{ $t('global.status.enabled') }}
                                </span>
                                <span v-else>{{
                                  $t('global.status.disabled')
                                }}</span>
                              </b-form-checkbox>
                            </b-col>
                          </b-row>

                          <div v-if="vmcState && !isMultiHostEnabled">
                            <b-row>
                              <b-col cols="12" md="3" class="mb-3">
                                <b-form-group
                                  id="input-group-vm-interval-host1"
                                  :label="$t('pagePolicies.retryInterval')"
                                  label-for="input-vm-interval-host1"
                                >
                                  <b-form-input
                                    id="input-vm-interval-host1"
                                    v-model="vmReconnectValues.vmInterval"
                                    :disabled="
                                      userPrivilege !== privilegesId.admin
                                    "
                                    data-test-id="input-vminterval-host1"
                                    type="number"
                                    aria-describedby="power-help-text"
                                    :state="
                                      getValidationState(
                                        $v.vmReconnectValues.vmInterval,
                                      )
                                    "
                                    @input="
                                      $v.vmReconnectValues.vmInterval.$touch()
                                    "
                                  ></b-form-input>
                                  <b-form-invalid-feedback role="alert">
                                    <template
                                      v-if="
                                        !$v.vmReconnectValues.vmInterval
                                          .required
                                      "
                                    >
                                      {{ $t('global.form.fieldRequired') }}
                                    </template>
                                    <template
                                      v-else-if="
                                        $v.vmReconnectValues.vmInterval
                                          .required &&
                                        !$v.vmReconnectValues.vmInterval.pattern
                                      "
                                    >
                                      {{
                                        $t('pagePolicies.vmVMValueLimits', {
                                          min: 15,
                                          max: 30,
                                        })
                                      }}
                                    </template>
                                  </b-form-invalid-feedback>
                                </b-form-group>
                              </b-col>
                              <b-col cols="12" md="3" class="mb-3">
                                <b-form-group
                                  id="input-group-vm-count-host1"
                                  :label="$t('pagePolicies.retryCount')"
                                  label-for="input-vm-count-host1"
                                >
                                  <b-form-input
                                    id="input-vm-count-host1"
                                    v-model="vmReconnectValues.vmCount"
                                    data-test-id="input-vmcount-host1"
                                    type="number"
                                    aria-describedby="power-help-text"
                                    :disabled="
                                      userPrivilege !== privilegesId.admin
                                    "
                                    :state="
                                      getValidationState(
                                        $v.vmReconnectValues.vmCount,
                                      )
                                    "
                                    @input="
                                      $v.vmReconnectValues.vmCount.$touch()
                                    "
                                  ></b-form-input>
                                  <b-form-invalid-feedback role="alert">
                                    <template
                                      v-if="
                                        !$v.vmReconnectValues.vmCount.required
                                      "
                                    >
                                      {{ $t('global.form.fieldRequired') }}
                                    </template>
                                    <template
                                      v-else-if="
                                        $v.vmReconnectValues.vmCount.required &&
                                        !$v.vmReconnectValues.vmCount.pattern
                                      "
                                    >
                                      {{
                                        $t('pagePolicies.vmVMValueLimits', {
                                          min: 3,
                                          max: 6,
                                        })
                                      }}
                                    </template>
                                  </b-form-invalid-feedback>
                                </b-form-group>
                              </b-col>
                              <b-col
                                cols="12"
                                md="3"
                                class="d-flex align-items-center mb-3"
                              >
                                <b-button
                                  variant="primary"
                                  type="submit"
                                  :disabled="
                                    userPrivilege !== privilegesId.admin
                                  "
                                  data-test-id="button-saveVMReconnectValues-host1"
                                  @click="saveVMReconnectValues"
                                >
                                  <icon-save />
                                  {{ $t('global.action.save') }}
                                </b-button>
                              </b-col>
                            </b-row>
                          </div>
                        </b-tab>

                        <!-- Host 2 Tab -->
                        <b-tab
                          v-if="isMultiHostEnabled"
                          :title="$t('pagePolicies.vmc1')"
                          :disabled="vmcStateHost2 === null"
                        >
                          <b-row class="mb-3">
                            <b-col
                              lg="12"
                              class="d-flex align-items-center justify-content-between"
                            >
                              <span>{{
                                $t('pagePolicies.enableVirtualMedia')
                              }}</span>
                              <b-form-checkbox
                                id="vmcSwitchHost2"
                                v-model="vmcStateHost2"
                                data-test-id="policies-toggle-vmc-host2"
                                switch
                                :disabled="userPrivilege !== privilegesId.admin"
                                @change="changeVmcStateHost2"
                              >
                                <span class="sr-only">
                                  {{ $t('pagePolicies.vmc') }} - Host 2
                                </span>
                                <span v-if="vmcStateHost2">
                                  {{ $t('global.status.enabled') }}
                                </span>
                                <span v-else>{{
                                  $t('global.status.disabled')
                                }}</span>
                              </b-form-checkbox>
                            </b-col>
                          </b-row>

                          <div v-if="vmcStateHost2 && !isMultiHostEnabled">
                            <b-row>
                              <b-col cols="12" md="3" class="mb-3">
                                <b-form-group
                                  id="input-group-vm-interval-host2"
                                  :label="$t('pagePolicies.retryInterval')"
                                  label-for="input-vm-interval-host2"
                                >
                                  <b-form-input
                                    id="input-vm-interval-host2"
                                    v-model="vmReconnectValuesHost2.vmInterval"
                                    :disabled="
                                      userPrivilege !== privilegesId.admin
                                    "
                                    data-test-id="input-vminterval-host2"
                                    type="number"
                                    aria-describedby="power-help-text"
                                    :state="
                                      getValidationState(
                                        $v.vmReconnectValuesHost2.vmInterval,
                                      )
                                    "
                                    @input="
                                      $v.vmReconnectValuesHost2.vmInterval.$touch()
                                    "
                                  ></b-form-input>
                                  <b-form-invalid-feedback role="alert">
                                    <template
                                      v-if="
                                        !$v.vmReconnectValuesHost2.vmInterval
                                          .required
                                      "
                                    >
                                      {{ $t('global.form.fieldRequired') }}
                                    </template>
                                    <template
                                      v-else-if="
                                        $v.vmReconnectValuesHost2.vmInterval
                                          .required &&
                                        !$v.vmReconnectValuesHost2.vmInterval
                                          .pattern
                                      "
                                    >
                                      {{
                                        $t('pagePolicies.vmVMValueLimits', {
                                          min: 15,
                                          max: 30,
                                        })
                                      }}
                                    </template>
                                  </b-form-invalid-feedback>
                                </b-form-group>
                              </b-col>
                              <b-col cols="12" md="3" class="mb-3">
                                <b-form-group
                                  id="input-group-vm-count-host2"
                                  :label="$t('pagePolicies.retryCount')"
                                  label-for="input-vm-count-host2"
                                >
                                  <b-form-input
                                    id="input-vm-count-host2"
                                    v-model="vmReconnectValuesHost2.vmCount"
                                    data-test-id="input-vmcount-host2"
                                    type="number"
                                    aria-describedby="power-help-text"
                                    :disabled="
                                      userPrivilege !== privilegesId.admin
                                    "
                                    :state="
                                      getValidationState(
                                        $v.vmReconnectValuesHost2.vmCount,
                                      )
                                    "
                                    @input="
                                      $v.vmReconnectValuesHost2.vmCount.$touch()
                                    "
                                  ></b-form-input>
                                  <b-form-invalid-feedback role="alert">
                                    <template
                                      v-if="
                                        !$v.vmReconnectValuesHost2.vmCount
                                          .required
                                      "
                                    >
                                      {{ $t('global.form.fieldRequired') }}
                                    </template>
                                    <template
                                      v-else-if="
                                        $v.vmReconnectValuesHost2.vmCount
                                          .required &&
                                        !$v.vmReconnectValuesHost2.vmCount
                                          .pattern
                                      "
                                    >
                                      {{
                                        $t('pagePolicies.vmVMValueLimits', {
                                          min: 3,
                                          max: 6,
                                        })
                                      }}
                                    </template>
                                  </b-form-invalid-feedback>
                                </b-form-group>
                              </b-col>
                              <b-col
                                cols="12"
                                md="3"
                                class="d-flex align-items-center mb-3"
                              >
                                <b-button
                                  variant="primary"
                                  type="submit"
                                  :disabled="
                                    userPrivilege !== privilegesId.admin
                                  "
                                  data-test-id="button-saveVMReconnectValues-host2"
                                  @click="saveVMReconnectValuesHost2"
                                >
                                  <icon-save />
                                  {{ $t('global.action.save') }}
                                </b-button>
                              </b-col>
                            </b-row>
                          </div>
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </b-col>
                </b-row>
                <!-- SOL Console Section with Dual Host Support -->
                <b-row v-if="isSolEnabled" class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-4 w-75">
                      <dt>{{ $t('pagePolicies.solssh') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.solDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                </b-row>
                <b-row v-if="isSolEnabled" class="setting-section">
                  <b-col lg="7">
                    <!-- Tab Navigation for SOL Console -->
                    <b-card no-body class="vm-card">
                      <b-tabs pills card>
                        <!-- SOL Console Tab -->
                        <b-tab :title="$t('pagePolicies.solssh')" active>
                          <b-row v-if="!isMultiSolMode" class="mb-3">
                            <b-col
                              lg="12"
                              class="d-flex align-items-center justify-content-between"
                            >
                              <span>{{
                                $t('pagePolicies.enableSolService')
                              }}</span>
                              <b-form-checkbox
                                id="solSwitch"
                                v-model="solState"
                                data-test-id="policies-toggle-sol"
                                switch
                                :disabled="
                                  userPrivilege === privilegesId.readOnly
                                "
                                @change="changeSOLState"
                              >
                                <span class="sr-only">
                                  {{ $t('pagePolicies.solssh') }}
                                </span>
                                <span v-if="solState">
                                  {{ $t('global.status.enabled') }}
                                </span>
                                <span v-else>{{
                                  $t('global.status.disabled')
                                }}</span>
                              </b-form-checkbox>
                            </b-col>
                          </b-row>

                          <div v-if="solState && !isMultiSolMode">
                            <b-row>
                              <b-col cols="12" md="3" class="mb-3">
                                <b-form-group
                                  id="input-group-sol-port"
                                  :label="$t('pagePolicies.solSshPortLabel')"
                                  label-for="input-sol-port"
                                >
                                  <b-form-input
                                    id="input-solSsh-port"
                                    v-model.number="solSshPort"
                                    data-test-id="input-solSshPort"
                                    type="number"
                                    :disabled="
                                      userPrivilege === privilegesId.readOnly
                                    "
                                    aria-describedby="power-help-text"
                                    :state="getValidationState($v.solSshPort)"
                                    @input="$v.solSshPort.$touch()"
                                  ></b-form-input>
                                  <b-form-invalid-feedback role="alert">
                                    <template v-if="!$v.solSshPort.required">
                                      {{ $t('global.form.fieldRequired') }}
                                    </template>
                                    <template
                                      v-else-if="!$v.solSshPort.pattern"
                                    >
                                      {{
                                        $t(
                                          'pagePolicies.solSshPortValueLimits',
                                          {
                                            min: 1,
                                            max: 65535,
                                          },
                                        )
                                      }}
                                    </template>
                                  </b-form-invalid-feedback>
                                </b-form-group>
                              </b-col>
                              <b-col
                                cols="12"
                                md="3"
                                class="d-flex align-items-center mb-3"
                              >
                                <b-button
                                  variant="primary"
                                  type="submit"
                                  :disabled="
                                    userPrivilege === privilegesId.readOnly
                                  "
                                  data-test-id="power-button-saveIpmiPortValue"
                                  @click="saveSolSshPortValue"
                                >
                                  <icon-save />
                                  {{ $t('global.action.save') }}
                                </b-button>
                              </b-col>
                            </b-row>
                          </div>

                          <div
                            v-if="isMultiSolMode && multiSolSshList.length > 0"
                          >
                            <dl class="mt-3 mb-4">
                              <dt>{{ $t('pagePolicies.multiSolSsh') }}</dt>
                              <dd>
                                {{ $t('pagePolicies.multiSolSshDescription') }}
                              </dd>
                            </dl>
                            <div>
                              <b-row
                                v-for="solService in multiSolSshList"
                                :key="solService.Id"
                                class="mb-3"
                              >
                                <b-col
                                  lg="7"
                                  class="d-flex align-items-center justify-content-between"
                                >
                                  <dl class="mt-3 mr-4 w-75">
                                    <dt>
                                      {{
                                        $t('pagePolicies.solSshService', {
                                          solId: solService.Id,
                                        })
                                      }}
                                    </dt>
                                  </dl>
                                </b-col>
                                <b-col lg="3" class="session-timeout">
                                  <b-form-checkbox
                                    :id="`solSwitch-${solService.Id}`"
                                    :checked="!solService.Masked"
                                    :data-test-id="`policies-toggle-sol-${solService.Id}`"
                                    switch
                                    :disabled="
                                      userPrivilege === privilegesId.readOnly
                                    "
                                    @change="
                                      changeMultiSOLState(solService.Id, $event)
                                    "
                                  >
                                    <span class="sr-only">
                                      {{
                                        $t('pagePolicies.solSshService', {
                                          solId: solService.Id,
                                        })
                                      }}
                                    </span>
                                    <span v-if="solService.Masked == false">
                                      {{ $t('global.status.enabled') }}
                                    </span>
                                    <span v-else>{{
                                      $t('global.status.disabled')
                                    }}</span>
                                  </b-form-checkbox>
                                </b-col>
                              </b-row>
                            </div>
                          </div>
                        </b-tab>

                        <!-- SOL Console 1 Tab -->
                        <b-tab
                          v-if="isMultiHostEnabled"
                          :title="$t('pagePolicies.policiessolssh1')"
                          :disabled="solStateHost2 === null"
                        >
                          <b-row v-if="!isMultiSolModeHost2" class="mb-3">
                            <b-col
                              lg="12"
                              class="d-flex align-items-center justify-content-between"
                            >
                              <span>{{
                                $t('pagePolicies.enableSol1Service')
                              }}</span>
                              <b-form-checkbox
                                id="solSwitchHost2"
                                v-model="solStateHost2"
                                data-test-id="policies-toggle-sol-host2"
                                switch
                                :disabled="
                                  userPrivilege === privilegesId.readOnly
                                "
                                @change="changeSOLStateHost2"
                              >
                                <span class="sr-only">
                                  {{ $t('pagePolicies.solssh1') }} - Host 2
                                </span>
                                <span v-if="solStateHost2">
                                  {{ $t('global.status.enabled') }}
                                </span>
                                <span v-else>{{
                                  $t('global.status.disabled')
                                }}</span>
                              </b-form-checkbox>
                            </b-col>
                          </b-row>

                          <div v-if="solStateHost2 && !isMultiSolModeHost2">
                            <b-row>
                              <b-col cols="12" md="3" class="mb-3">
                                <b-form-group
                                  id="input-group-sol-port-host2"
                                  :label="$t('pagePolicies.solSshPortLabel')"
                                  label-for="input-sol-port-host2"
                                >
                                  <b-form-input
                                    id="input-solSsh-port-host2"
                                    v-model.number="solSshPortHost2"
                                    data-test-id="input-solSshPort-host2"
                                    type="number"
                                    :disabled="
                                      userPrivilege === privilegesId.readOnly
                                    "
                                    aria-describedby="power-help-text"
                                    :state="
                                      getValidationState($v.solSshPortHost2)
                                    "
                                    @input="$v.solSshPortHost2.$touch()"
                                  ></b-form-input>
                                  <b-form-invalid-feedback role="alert">
                                    <template
                                      v-if="!$v.solSshPortHost2.required"
                                    >
                                      {{ $t('global.form.fieldRequired') }}
                                    </template>
                                    <template
                                      v-else-if="!$v.solSshPortHost2.pattern"
                                    >
                                      {{
                                        $t(
                                          'pagePolicies.solSshPortValueLimits',
                                          {
                                            min: 1,
                                            max: 65535,
                                          },
                                        )
                                      }}
                                    </template>
                                  </b-form-invalid-feedback>
                                </b-form-group>
                              </b-col>
                              <b-col
                                cols="12"
                                md="3"
                                class="d-flex align-items-center mb-3"
                              >
                                <b-button
                                  variant="primary"
                                  type="submit"
                                  :disabled="
                                    userPrivilege === privilegesId.readOnly
                                  "
                                  data-test-id="button-savesolSshPortValue-host2"
                                  @click="saveSolSshPortValueHost2"
                                >
                                  <icon-save />
                                  {{ $t('global.action.save') }}
                                </b-button>
                              </b-col>
                            </b-row>
                          </div>

                          <div
                            v-if="
                              isMultiSolModeHost2 &&
                              multiSolSshListHost2.length > 0
                            "
                          >
                            <dl class="mt-3 mb-4">
                              <dt>{{ $t('pagePolicies.multiSolSsh') }}</dt>
                              <dd>
                                {{ $t('pagePolicies.multiSolSshDescription') }}
                              </dd>
                            </dl>
                            <div>
                              <b-row
                                v-for="solService in multiSolSshListHost2"
                                :key="solService.Id"
                                class="mb-3"
                              >
                                <b-col
                                  lg="7"
                                  class="d-flex align-items-center justify-content-between"
                                >
                                  <dl class="mt-3 mr-4 w-75">
                                    <dt>
                                      {{
                                        $t('pagePolicies.solSshService', {
                                          solId: solService.Id,
                                        })
                                      }}
                                    </dt>
                                  </dl>
                                </b-col>
                                <b-col lg="3" class="session-timeout">
                                  <b-form-checkbox
                                    :id="`solSwitch-host2-${solService.Id}`"
                                    :checked="!solService.Masked"
                                    :data-test-id="`policies-toggle-sol-host2-${solService.Id}`"
                                    switch
                                    :disabled="
                                      userPrivilege === privilegesId.readOnly
                                    "
                                    @change="
                                      changeMultiSOLStateHost2(
                                        solService.Id,
                                        $event,
                                      )
                                    "
                                  >
                                    <span class="sr-only">
                                      {{
                                        $t('pagePolicies.solSshService', {
                                          solId: solService.Id,
                                        })
                                      }}
                                    </span>
                                    <span v-if="solService.Masked == false">
                                      {{ $t('global.status.enabled') }}
                                    </span>
                                    <span v-else>{{
                                      $t('global.status.disabled')
                                    }}</span>
                                  </b-form-checkbox>
                                </b-col>
                              </b-row>
                            </div>
                          </div>
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </b-col>
                </b-row>
                <b-row class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dt>{{ $t('pagePolicies.ssdpProtocol') }}</dt>
                      <dd>{{ $t('pagePolicies.ssdpDescription') }}</dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-checkbox
                      id="ssdpSwitch"
                      v-model="ssdpState"
                      data-test-id="policies-toggle-sol"
                      switch
                      :disabled="userPrivilege !== privilegesId.admin"
                      @change="changeSSDPLState"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.ssdpProtocol') }}
                      </span>
                      <span v-if="ssdpState">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <b-row v-if="ssdpState" class="setting-section">
                  <b-col cols="3" class="d-flex align-items-center">
                    <dl class="mt-3 mr-4 w-75">
                      <dt>
                        <b>{{ $t('pagePolicies.SsdpPortLabel') }}</b>
                      </dt>
                      <dd>
                        {{ ssdpPortValue }}
                      </dd>
                    </dl>
                  </b-col>
                </b-row>
                <b-row class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dt>{{ $t('pagePolicies.snmpProtocol') }}</dt>
                      <dd>{{ $t('pagePolicies.snmpDescription') }}</dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-checkbox
                      id="snmpSwitch"
                      v-model="snmpState"
                      data-test-id="policies-toggle-sol"
                      switch
                      :disabled="userPrivilege !== privilegesId.admin"
                      @change="changeSNMPState"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.snmpProtocol') }}
                      </span>
                      <span v-if="snmpState">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <b-row v-if="snmpState" class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dd>{{ $t('pagePolicies.snmpv1Description') }}</dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-checkbox
                      id="snmpv1Switch"
                      v-model="snmpv1State"
                      data-test-id="policies-toggle-sol"
                      switch
                      :disabled="userPrivilege !== privilegesId.admin"
                      @change="changeSNMPv1State"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.snmpv1') }}
                      </span>
                      <span v-if="snmpv1State">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <b-row v-if="snmpState" class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dd>{{ $t('pagePolicies.snmpv2cDescription') }}</dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-checkbox
                      id="snmpv2cSwitch"
                      v-model="snmpv2cState"
                      data-test-id="policies-toggle-sol"
                      switch
                      :disabled="userPrivilege !== privilegesId.admin"
                      @change="changeSNMPv2cState"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.snmpv2c') }}
                      </span>
                      <span v-if="snmpv2cState">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <b-row v-if="snmpState" class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dd>{{ $t('pagePolicies.snmpv3Description') }}</dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-checkbox
                      id="snmpv3Switch"
                      v-model="snmpv3State"
                      data-test-id="policies-toggle-sol"
                      switch
                      :disabled="userPrivilege !== privilegesId.admin"
                      @change="changeSNMPv3State"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.snmpv3') }}
                      </span>
                      <span v-if="snmpv3State">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <b-row class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dt>{{ $t('pagePolicies.openSslFipsLable') }}</dt>
                      <dd>{{ $t('pagePolicies.openSslFipsDescription') }}</dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-checkbox
                      id="sslFipsSwitch"
                      v-model="openSslFipsState"
                      data-test-id="policies-toggle-sol"
                      switch
                      :disabled="userPrivilege !== privilegesId.admin"
                      @change="changeOpenSslFipsState"
                    >
                      <span class="sr-only">
                        {{ $t('pagePolicies.openSslFipsLable') }}
                      </span>
                      <span v-if="openSslFipsState">
                        {{ $t('global.status.enabled') }}
                      </span>
                      <span v-else>{{ $t('global.status.disabled') }}</span>
                    </b-form-checkbox>
                  </b-col>
                </b-row>
              </page-section>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <page-section
                :section-title="$t('pagePolicies.configurationPolicies')"
              >
                <b-row class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dt>{{ $t('pagePolicies.webSessionTimeOut') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.webSessionTimeOutDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout text-right mb-3">
                    <b-form-group>
                      <b-form-input
                        id="web-session-timeout"
                        v-model="webSessionTimeoutValue"
                        data-test-id="web-session-timeout"
                        aria-describedby="power-help-text"
                        type="text"
                        :disabled="userPrivilege !== privilegesId.admin"
                        :state="getValidationState($v.webSessionTimeoutValue)"
                        @input="$v.webSessionTimeoutValue.$touch()"
                      >
                        <template #first>
                          <b-form-select-option :value="null" disabled>
                            {{ $t('global.form.selectAnOption') }}
                          </b-form-select-option>
                        </template>
                      </b-form-input>
                      <b-form-invalid-feedback role="alert">
                        <template v-if="!$v.webSessionTimeoutValue.required">
                          {{ $t('global.form.fieldRequired') }}
                        </template>
                        <template
                          v-else-if="!$v.webSessionTimeoutValue.pattern"
                        >
                          {{
                            $t('pagePolicies.webSessionTimeoutLimits', {
                              min: 30,
                              max: 86400,
                            })
                          }}
                        </template>
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-button
                      variant="primary"
                      type="submit"
                      data-test-id="button-web-session-timeout"
                      :disabled="userPrivilege !== privilegesId.admin"
                      @click="saveWebSessionTimeoutValue"
                    >
                      <icon-save />
                      {{ $t('global.action.save') }}
                    </b-button>
                  </b-col>
                </b-row>
                <b-row v-if="isKVMEnabled" class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dt>{{ $t('pagePolicies.kvmSessionTimeOut') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.kvmSessionTimeOutDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout text-right mt-3">
                    <b-form-group>
                      <b-form-input
                        id="kvm-session"
                        v-model="kvmSessionTimeOutValue"
                        data-test-id="kvm-session-timeout"
                        type="text"
                        :disabled="userPrivilege !== privilegesId.admin"
                        aria-describedby="power-help-text"
                        :state="getValidationState($v.kvmSessionTimeOutValue)"
                        @input="$v.kvmSessionTimeOutValue.$touch()"
                      ></b-form-input>
                      <b-form-invalid-feedback role="alert">
                        <template v-if="!$v.kvmSessionTimeOutValue.required">
                          {{ $t('global.form.fieldRequired') }}
                        </template>
                        <template
                          v-else-if="!$v.kvmSessionTimeOutValue.pattern"
                        >
                          {{
                            $t('pagePolicies.kvmTimeoutValueLimits', {
                              min: 30,
                              max: 86400,
                            })
                          }}
                        </template>
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-button
                      variant="primary"
                      type="submit"
                      data-test-id="button-kvm-session-timeout"
                      :disabled="userPrivilege !== privilegesId.admin"
                      @click="saveKVMSessionTimeoutValue"
                    >
                      <icon-save />
                      {{ $t('global.action.save') }}
                    </b-button>
                  </b-col>
                </b-row>
                <!--SOL Non-Volatile Bit Rate Section with Dual Host Support -->
                <b-row class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-4 w-75">
                      <dt>{{ $t('pagePolicies.solBitRateTitle') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.solBitRateDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                </b-row>
                <!-- Tab Navigation for SOL Non-Volatile Bit Rate -->
                <b-row class="setting-section">
                  <b-col lg="7">
                    <b-card no-body class="vm-card">
                      <b-tabs pills card>
                        <!-- SOL Non-Volatile Bit Rate Tab -->
                        <b-tab :title="$t('pagePolicies.solBitRateTab')" active>
                          <b-row v-if="isSolEnabled">
                            <b-col cols="12" md="4" class="mb-4 m0">
                              <b-form-group
                                id="input-group-sol-baudRate"
                                :label="$t('pagePolicies.solBitRate')"
                                label-for="input-sol-baudRate"
                              >
                                <b-form-select
                                  id="sol-baudRate"
                                  v-model="baudRateState"
                                  :disabled="
                                    userPrivilege !== privilegesId.admin
                                  "
                                  data-test-id="sol-select-baudRate"
                                  :options="baudRateOptions"
                                ></b-form-select>
                              </b-form-group>
                            </b-col>
                            <b-col
                              cols="12"
                              md="3"
                              class="d-flex align-items-center mb-3 m0"
                            >
                              <b-button
                                variant="primary"
                                type="submit"
                                :disabled="userPrivilege !== privilegesId.admin"
                                data-test-id="sol-button-saveBaudRateValue"
                                @click="saveBaudRateValue"
                              >
                                <icon-save />
                                {{ $t('global.action.save') }}
                              </b-button>
                            </b-col>
                          </b-row>
                        </b-tab>

                        <!-- SOL 1 Non-Volatile Bit Rate Tab -->
                        <b-tab
                          v-if="isMultiHostEnabled"
                          :title="$t('pagePolicies.sol1BitRateTab')"
                          :disabled="solStateHost2 === null"
                        >
                          <div v-if="isMultiHostEnabled">
                            <b-row>
                              <b-col cols="12" md="4" class="mb-4 m0">
                                <b-form-group
                                  id="input-group-sol1-baudRate"
                                  :label="$t('pagePolicies.solBitRate')"
                                  label-for="input-sol1-baudRate"
                                >
                                  <b-form-select
                                    id="sol1-baudRate"
                                    v-model="baudRate1State"
                                    :disabled="
                                      userPrivilege !== privilegesId.admin
                                    "
                                    data-test-id="sol1-select-baudRate"
                                    :options="baudRateOptions"
                                  ></b-form-select>
                                </b-form-group>
                              </b-col>
                              <b-col
                                cols="12"
                                md="3"
                                class="d-flex align-items-center mb-3 m0"
                              >
                                <b-button
                                  variant="primary"
                                  type="submit"
                                  :disabled="
                                    userPrivilege !== privilegesId.admin
                                  "
                                  data-test-id="sol1-button-saveBaudRateValue"
                                  @click="saveBaudRate1Value"
                                >
                                  <icon-save />
                                  {{ $t('global.action.save') }}
                                </b-button>
                              </b-col>
                            </b-row>
                          </div>
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </b-col>
                </b-row>
                <b-row class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dt>{{ $t('pagePolicies.complexity') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.complexityDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-select
                      id="complexity"
                      v-model="complexityState"
                      :disabled="userPrivilege !== privilegesId.admin"
                      :options="complexityOptions"
                      @change="changeComplexity"
                    >
                    </b-form-select>
                  </b-col>
                </b-row>
                <b-row class="setting-section">
                  <b-col
                    lg="7"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <dl class="mt-3 mr-3 w-75">
                      <dt>{{ $t('pagePolicies.passwordHistory') }}</dt>
                      <dd>
                        {{ $t('pagePolicies.passwordHistoryDescription') }}
                      </dd>
                    </dl>
                  </b-col>
                  <b-col lg="3" class="session-timeout">
                    <b-form-select
                      id="password-history"
                      v-model="passwordHistoryState"
                      :disabled="userPrivilege !== privilegesId.admin"
                      :options="passwordHistoryOptions"
                      @change="changePasswordHistory"
                    >
                    </b-form-select>
                  </b-col> </b-row
              ></page-section>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <page-section
                class="page-section"
                :section-title="$t('pagePolicies.maxSession')"
              >
                <b-row>
                  <b-col xl="10">
                    <b-table
                      ref="table"
                      responsive="md"
                      show-empty
                      :fields="maxSessionServicesField"
                      :items="maxSessionServicesInfo"
                      :empty-text="$t('global.table.emptyMessage')"
                      head-variant="light"
                    >
                    </b-table>
                  </b-col>
                </b-row>
              </page-section>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import PageTitle from '@/components/Global/PageTitle';
import PageSection from '@/components/Global/PageSection';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import { required } from 'vuelidate/lib/validators';
import VuelidateMixin from '@/components/Mixins/VuelidateMixin.js';
import { mapState } from 'vuex';
import IconSave from '@carbon/icons-vue/es/save/20';
import { privilegesId } from '@/store/modules/GlobalStore';
import { mapGetters } from 'vuex';
import RuntimeConfig from '@/utilities/RuntimeConfig';
import FeatureMixin from '@/components/Mixins/FeatureMixin';
export default {
  name: 'Policies',
  components: { PageTitle, PageSection, IconSave },
  mixins: [LoadingBarMixin, BVToastMixin, VuelidateMixin, FeatureMixin],
  beforeRouteLeave(to, from, next) {
    this.hideLoader();
    next();
  },
  data() {
    return {
      policiesOverlay: false,
      privilegesId,
      baudRate: '',
      sessionTimeOutOptions: [
        { value: 1800, text: this.$t('pagePolicies.options.30minutes') },
        { value: 3600, text: this.$t('pagePolicies.options.1hour') },
        { value: 7200, text: this.$t('pagePolicies.options.2hours') },
        { value: 14400, text: this.$t('pagePolicies.options.4hours') },
        { value: 28800, text: this.$t('pagePolicies.options.8hours') },
        { value: 86400, text: this.$t('pagePolicies.options.1day') },
      ],
      complexityOptions: [
        { value: 'Disabled', text: this.$t('pagePolicies.disabled') },
        { value: 'Low', text: this.$t('pagePolicies.low') },
        { value: 'Medium', text: this.$t('pagePolicies.medium') },
        { value: 'High', text: this.$t('pagePolicies.high') },
      ],
      passwordHistoryOptions: [
        { value: 0, text: 0 },
        { value: 1, text: 1 },
        { value: 2, text: 2 },
        { value: 3, text: 3 },
        { value: 4, text: 4 },
        { value: 5, text: 5 },
      ],
      baudRateOptions: [
        { value: '9600', text: '9600' },
        { value: '19200', text: '19200' },
        { value: '38400', text: '38400' },
        { value: '57600', text: '57600' },
        { value: '115200', text: '115200' },
      ],
      maxSessionServicesField: [
        process.env.VUE_APP_ONETREE_KVM_ENABLED === 'true'
          ? {
              key: 'kvmMaxSession',
              label: this.$t('pagePolicies.kvmMaxSession'),
              class: 'text-center',
            }
          : null,
        {
          key: 'redfishMaxSession',
          label: this.$t('pagePolicies.redfishMaxSession'),
          class: 'text-center',
        },
        process.env.VUE_APP_MODIFY_SSH_POLICY_DISABLED === 'true'
          ? null
          : {
              key: 'sshMaxSession',
              label: this.$t('pagePolicies.sshMaxSession'),
              class: 'text-center',
            },
        process.env.VUE_APP_ONETREE_MEDIA_REDIRECT_ENABLED === 'true'
          ? {
              key: 'vmMaxSession',
              label: this.$t('pagePolicies.vmMaxSession'),
              class: 'text-center',
            }
          : null,
        {
          key: 'webMaxSession',
          label: this.$t('pagePolicies.webMaxSession'),
          class: 'text-center',
        },
      ],
      kvmSessionTimeOutValue: this.$store.getters['policies/kvmSessionTimeout'],
      webSessionTimeoutValue:
        this.$store.getters['policies/sessionTimeoutValue'],
      kvmPort: this.$store.getters['policies/kvmPortValue'],
      webPort: this.$store.getters['policies/webPortValue'],
      modifySSHPolicyDisabled:
        process.env.VUE_APP_MODIFY_SSH_POLICY_DISABLED === 'true',
      isSolEnabled: process.env.VUE_APP_ONETREE_SOL_ENABLED === 'true',
      isKVMEnabled: process.env.VUE_APP_ONETREE_KVM_ENABLED === 'true',
      isVmediaEnabled:
        process.env.VUE_APP_ONETREE_MEDIA_REDIRECT_ENABLED === 'true',
      DisplaySection: false,
      vmReconnectValues: {
        vmCount: '',
        vmInterval: '',
      },
      vmReconnectValuesHost2: {
        vmCount: '',
        vmInterval: '',
      },
      // kvmPortHost2: this.$store.getters['policies/kvmPortValueHost2'] || '',
    };
  },
  computed: {
    ...mapGetters('global', ['userPrivilege']),
    isMultiHostEnabled() {
      return RuntimeConfig.isMultiHostEnabled();
    },
    sshProtocolState: {
      get() {
        return this.$store.getters['policies/sshProtocolEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    ipmiProtocolState: {
      get() {
        return this.$store.getters['policies/ipmiProtocolEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    rtadState: {
      get() {
        if (this.$store.getters['policies/rtadEnabled'] === 'Enabled') {
          return true;
        } else {
          return false;
        }
      },
      set(newValue) {
        return newValue;
      },
    },
    vtpmState: {
      get() {
        if (this.$store.getters['policies/vtpmEnabled'] === 'Enabled') {
          return true;
        } else {
          return false;
        }
      },
      set(newValue) {
        return newValue;
      },
    },
    kvmState: {
      get() {
        return this.$store.getters['policies/kvmServiceEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    kvmStateHost2: {
      get() {
        const value = this.$store.getters['policies/kvmServiceEnabledHost2'];
        return value === null ? null : value;
      },
      set(newValue) {
        return newValue;
      },
    },
    // kvmPortHost2: {
    //   get() {
    //     return this.$store.getters['policies/kvmPortValueHost2'];
    //   },
    //   set(newValue) {
    //     return newValue;
    //   },
    // },
    vmcState: {
      get() {
        return this.$store.getters['policies/virtualMediaServiceEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    vmcStateHost2: {
      get() {
        const value =
          this.$store.getters['policies/virtualMediaServiceEnabledHost2'];
        return value === null ? null : value;
      },
      set(newValue) {
        return newValue;
      },
    },
    solState: {
      get() {
        return this.$store.getters['policies/solSshServiceEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    solStateHost2: {
      get() {
        const value = this.$store.getters['policies/solSshServiceEnabledHost2'];
        return value === null ? null : value;
      },
      set(newValue) {
        return newValue;
      },
    },
    ssdpState: {
      get() {
        return this.$store.getters['policies/ssdpProtocolEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    snmpState: {
      get() {
        return this.$store.getters['snmp/snmpProtocolEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    snmpv1State: {
      get() {
        return this.$store.getters['snmp/snmpv1Enabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    snmpv2cState: {
      get() {
        return this.$store.getters['snmp/snmpv2cEnabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    snmpv3State: {
      get() {
        return this.$store.getters['snmp/snmpv3Enabled'];
      },
      set(newValue) {
        return newValue;
      },
    },
    openSslFipsState: {
      get() {
        return this.$store.getters['policies/sslFipsProtocolEnabled'];
      },
      set(newValue) {
        this.$store.commit('policies/setSslFipsProtocolEnabled', newValue);
      },
    },
    solSshPort: {
      get() {
        return this.$store.getters['policies/solSshPortValue'];
      },
      set(newValue) {
        this.$store.dispatch('policies/setSolSshPortUpdatedValue', newValue);
      },
    },
    complexityState: {
      get() {
        return this.$store.getters['policies/complexity'];
      },
      set(newValue) {
        this.$store.commit('policies/setComplexity', newValue);
      },
    },
    passwordHistoryState: {
      get() {
        return this.$store.getters['policies/passwordHistory'];
      },
      set(newValue) {
        this.$store.commit('policies/setPasswordHistory', newValue);
      },
    },
    baudRateState: {
      get() {
        return this.$store.getters['policies/solBitRate'];
      },
      set(newValue) {
        this.$store.commit('policies/setSolBitRate', newValue);
      },
    },
    ssdpPortValue() {
      return this.$store.getters['policies/ssdpPortValue'];
    },
    maxSessionServicesInfo() {
      return this.$store.getters['policies/maxSessions'];
    },
    isMultiSolMode() {
      return this.$store.getters['policies/isMultiSolMode'];
    },
    multiSolSshList() {
      return this.$store.getters['policies/multiSolSshList'] || [];
    },
    isMultiSolModeHost2() {
      return this.$store.getters['policies/isMultiSolModeHost2'];
    },
    multiSolSshListHost2() {
      return this.$store.getters['policies/multiSolSshListHost2'] || [];
    },
    solSshPortHost2: {
      get() {
        return this.$store.getters['policies/solSshPortValueHost2'];
      },
      set(newValue) {
        return newValue;
      },
    },
    baudRate1State: {
      get() {
        return this.$store.getters['policies/sol1BitRate'];
      },
      set(newValue) {
        this.$store.commit('policies/setSol1BitRate', newValue);
      },
    },
    ...mapState('policies', [
      'kvmSessionTimeout',
      'kvmPortValue',
      'webPortValue',
      'sessionTimeoutValue',
      'vmReconnectData',
      'vmReconnectDataHost2',
    ]),
  },
  watch: {
    kvmSessionTimeout: function (value) {
      this.kvmSessionTimeOutValue = value;
    },
    kvmPortValue: function (value) {
      this.kvmPort = value;
    },
    webPortValue: function (value) {
      this.webPort = value;
    },
    sessionTimeoutValue: function (value) {
      this.webSessionTimeoutValue = value;
    },
    vmReconnectData: function (value) {
      this.vmReconnectValues.vmCount = value.RetryCount;
      this.vmReconnectValues.vmInterval = value.RetryInterval;
    },
    vmReconnectDataHost2: function (value) {
      this.vmReconnectValuesHost2.vmCount = value.RetryCount;
      this.vmReconnectValuesHost2.vmInterval = value.RetryInterval;
    },
  },
  created() {
    this.startLoader();
    Promise.all([
      // this.$store.dispatch('policies/getBiosStatus'),
      this.$store.dispatch('policies/getNetworkProtocolStatus'),
      this.$store.dispatch('policies/getSessionTimeout'),
      this.$store.dispatch('policies/getKvmServiceStatus'),
      this.$store.dispatch('policies/getAccountService'),
      this.$store.dispatch('policies/getSslFipsStatus'),
      this.$store.dispatch('snmp/getSNMPProtocolStatus'),
      process.env.VUE_APP_ONETREE_SOL_ENABLED === 'true'
        ? this.$store.dispatch('policies/getSolBitRateData')
        : Promise.resolve(),
      process.env.VUE_APP_ONETREE_MEDIA_REDIRECT_ENABLED === 'true'
        ? this.$store.dispatch('policies/getVMReconnect')
        : Promise.resolve(),
      this.isMultiHostEnabled
        ? this.$store.dispatch('policies/getSol1BitRateData')
        : Promise.resolve(),
    ]).finally(() => this.endLoader());
  },
  validations() {
    return {
      kvmSessionTimeOutValue: {
        required,
        pattern: function (pw) {
          return this.webKvmSessionTimeoutValidation(pw);
        },
      },
      webSessionTimeoutValue: {
        required,
        pattern: function (pw) {
          return this.webKvmSessionTimeoutValidation(pw);
        },
      },
      kvmPort: {
        required,
        pattern: function (pw) {
          return this.kvmPortValueValidation(pw);
        },
      },
      // kvmPortHost2: {
      //   required,
      //   pattern: function (pw) {
      //     return this.kvmPortValueValidation(pw);
      //   },
      // },
      webPort: {
        required,
        pattern: function (pw) {
          return this.webPortValueValidation(pw);
        },
      },
      solSshPort: {
        required,
        pattern: function (pw) {
          return this.solSshValueValidation(pw);
        },
      },
      solSshPortHost2: {
        required,
        pattern: function (pw) {
          return this.solSshValueValidation(pw);
        },
      },
      vmReconnectValues: {
        vmInterval: {
          required,
          pattern: function (pw) {
            return this.vmRetryIntervalValidation(pw);
          },
        },
        vmCount: {
          required,
          pattern: function (pw) {
            return this.vmRetryCountValidation(pw);
          },
        },
      },
      vmReconnectValuesHost2: {
        vmInterval: {
          required,
          pattern: function (pw) {
            return this.vmRetryIntervalValidation(pw);
          },
        },
        vmCount: {
          required,
          pattern: function (pw) {
            return this.vmRetryCountValidation(pw);
          },
        },
      },
    };
  },
  methods: {
    changeIpmiProtocolState(state) {
      this.$store
        .dispatch('policies/saveIpmiProtocolState', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeSshProtocolState(state) {
      this.$store
        .dispatch('policies/saveSshProtocolState', state)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeRtadState(state) {
      this.$store
        .dispatch('policies/saveRtadState', state ? 'Enabled' : 'Disabled')
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeVtpmState(state) {
      this.$store
        .dispatch('policies/saveVtpmState', state ? 'Enabled' : 'Disabled')
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeKmvState(state) {
      this.$store
        .dispatch('policies/saveKvmState', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeKmvStateHost2(state) {
      this.$store
        .dispatch('policies/saveKvmStateHost2', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeVmcState(state) {
      this.startLoader();
      this.$store
        .dispatch('policies/saveVmcState', state ? true : false)
        .then((message) => {
          if (!state) {
            if (this.$store.state.virtualMedia.vmStarted > 0) {
              this.$root.$emit('stop-vmedia');
            }
            this.endLoader();
          } else {
            setTimeout(() => {
              this.$store
                .dispatch('policies/getVMReconnect')
                .catch(() => this.endLoader())
                .finally(() => this.endLoader());
            }, 20000); // wait for the Virtual media service configuration success
          }
          this.successToast(message);
        })
        .catch(({ message }) => {
          this.errorToast(message);
          this.endLoader();
        });
    },
    changeVmcStateHost2(state) {
      this.startLoader();
      this.$store
        .dispatch('policies/saveVmcStateHost2', state ? true : false)
        .then((message) => {
          if (!state) {
            // Handle stop media for host 2 if needed
            this.endLoader();
          } else {
            setTimeout(() => {
              this.$store
                .dispatch('policies/getVMReconnect')
                .catch(() => this.endLoader())
                .finally(() => this.endLoader());
            }, 20000);
          }
          this.successToast(message);
        })
        .catch(({ message }) => {
          this.errorToast(message);
          this.endLoader();
        });
    },
    changeSOLState(state) {
      this.$store
        .dispatch('policies/saveSOLSshState', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeSOLStateHost2(state) {
      this.$store
        .dispatch('policies/saveSOLSshStateHost2', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeMultiSOLState(solId, enabled) {
      this.$store
        .dispatch('policies/saveMultiSOLSshState', { solId, enabled })
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeMultiSOLStateHost2(solId, enabled) {
      this.$store
        .dispatch('policies/saveMultiSOLSshStateHost2', { solId, enabled })
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeSSDPLState(state) {
      this.$store
        .dispatch('policies/saveSSDPProtocolState', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveSolSshPortValue() {
      this.$v.solSshPort.$touch();
      if (this.$v.solSshPort.$invalid) return;
      this.$store
        .dispatch('policies/saveSolSshPortState', parseInt(this.solSshPort))
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveSolSshPortValueHost2() {
      this.$v.solSshPortHost2.$touch();
      if (this.$v.solSshPortHost2.$invalid) return;
      this.$store
        .dispatch(
          'policies/saveSolSshPortStateHost2',
          parseInt(this.solSshPortHost2),
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveWebSessionTimeoutValue() {
      this.$v.webSessionTimeoutValue.$touch();
      if (this.$v.webSessionTimeoutValue.$invalid) return;
      this.$store
        .dispatch(
          'policies/saveWebSessionTimeoutValue',
          parseInt(this.webSessionTimeoutValue),
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeComplexity() {
      this.$store
        .dispatch('policies/saveComplexity', this.complexityState)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changePasswordHistory() {
      this.$store
        .dispatch(
          'policies/savePasswordHistory',
          parseInt(this.passwordHistoryState),
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeSNMPState(state) {
      this.$store
        .dispatch('snmp/saveSnmpProtocolState', state ? true : false)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    changeSNMPv1State(state) {
      const snmpversion = {};
      snmpversion.versionType = 1;
      snmpversion.snmpVersionEnabled = state ? true : false;
      this.$store
        .dispatch('snmp/saveSnmpVersionState', snmpversion)
        .then((message) => this.successToast(message + ': SNMPv1.'))
        .catch(({ message }) => this.errorToast(message + ': SNMPv1.'));
    },
    changeSNMPv2cState(state) {
      const snmpversion = {};
      snmpversion.versionType = 2;
      snmpversion.snmpVersionEnabled = state ? true : false;
      this.$store
        .dispatch('snmp/saveSnmpVersionState', snmpversion)
        .then((message) => this.successToast(message + ': SNMPv2c.'))
        .catch(({ message }) => this.errorToast(message + ': SNMPv2c.'));
    },
    changeSNMPv3State(state) {
      const snmpversion = {};
      snmpversion.versionType = 3;
      snmpversion.snmpVersionEnabled = state ? true : false;
      this.$store
        .dispatch('snmp/saveSnmpVersionState', snmpversion)
        .then((message) => this.successToast(message + ': SNMPv3.'))
        .catch(({ message }) => this.errorToast(message + ': SNMPv3.'));
    },
    changeOpenSslFipsState(state) {
      this.$bvModal
        .msgBoxConfirm(this.$tc('pagePolicies.toast.openSSLFIPSConfirmation'), {
          title: this.$tc('pagePolicies.modal.confirmTitle'),
          okTitle: this.$t('global.action.ok'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'ok',
        })
        .then((confirmed) => {
          if (confirmed) {
            console.log('confirmed');
            this.$store.commit(
              'policies/setSslFipsProtocolEnabled',
              state ? true : false,
            );
            this.$store
              .dispatch(
                'policies/saveSslFipsProtocolState',
                state ? true : false,
              )
              .then((message) => {
                this.successToast(message);
                this.$bvModal
                  .msgBoxOk(this.$tc('pagePolicies.modal.informationMessage'), {
                    title: this.$tc('global.action.success'),
                  })
                  .then((addConfirmed) => {
                    if (addConfirmed) {
                      this.policiesOverlay = true;
                    }
                  });
              })
              .catch(({ message }) => this.errorToast(message));
          } else {
            this.$store.commit('policies/setSslFipsProtocolEnabled', !state);
          }
        });
    },
    saveKVMSessionTimeoutValue() {
      this.$v.kvmSessionTimeOutValue.$touch();
      if (this.$v.kvmSessionTimeOutValue.$invalid) return;
      this.$store
        .dispatch(
          'policies/saveKVMSessionTimeout',
          parseInt(this.kvmSessionTimeOutValue),
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveKVMPortValue() {
      this.$v.kvmPort.$touch();
      if (this.$v.kvmPort.$invalid) return;
      this.$bvModal
        .msgBoxConfirm(this.$tc('pagePolicies.modal.kvmPortConfirmation'), {
          title: this.$tc('pagePolicies.modal.kvmPortTitle'),
          okTitle: this.$tc('global.action.ok'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'ok',
        })
        .then((confirmation) => {
          if (confirmation) {
            this.$store
              .dispatch('policies/saveKVMPortValue', parseInt(this.kvmPort))
              .then((message) => this.successToast(message))
              .catch(({ message }) => this.errorToast(message));
          }
        });
    },
    saveKVMPortValueHost2() {
      this.$v.kvmPortHost2.$touch();
      if (this.$v.kvmPortHost2.$invalid) return;
      this.$bvModal
        .msgBoxConfirm(this.$tc('pagePolicies.modal.kvm1PortConfirmation'), {
          title: this.$tc('pagePolicies.modal.kvm1ortTitle'),
          okTitle: this.$tc('global.action.ok'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'ok',
        })
        .then((confirmation) => {
          if (confirmation) {
            this.$store
              .dispatch(
                'policies/saveKVMPortValueHost2',
                parseInt(this.kvmPortHost2),
              )
              .then((message) => this.successToast(message))
              .catch(({ message }) => this.errorToast(message));
          }
        });
    },
    saveWebPortValue() {
      this.$v.webPort.$touch();
      if (this.$v.webPort.$invalid) return;
      this.$bvModal
        .msgBoxConfirm(this.$tc('pagePolicies.modal.webPortConfirmation'), {
          title: this.$tc('pagePolicies.modal.webPortTitle'),
          okTitle: this.$tc('global.action.ok'),
          cancelTitle: this.$t('global.action.cancel'),
          autoFocusButton: 'ok',
        })
        .then((confirmation) => {
          if (confirmation) {
            this.$store
              .dispatch('policies/saveWebPortValue', parseInt(this.webPort))
              .then((message) => {
                this.successToast(message);
                this.$store.dispatch('authentication/logout');
              })
              .catch(({ message }) => this.errorToast(message));
          }
        });
    },
    saveBaudRateValue() {
      this.$store
        .dispatch('policies/saveSolBitRateValue', this.baudRateState)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveVMReconnectValues() {
      this.$v.vmReconnectValues.$touch();
      if (this.$v.vmReconnectValues.$invalid) return;

      this.$store
        .dispatch('policies/saveVMReconnectValue', this.vmReconnectValues)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveVMReconnectValuesHost2() {
      this.$v.vmReconnectValuesHost2.$touch();
      if (this.$v.vmReconnectValuesHost2.$invalid) return;

      this.$store
        .dispatch(
          'policies/saveVMReconnectValueHost2',
          this.vmReconnectValuesHost2,
        )
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    saveBaudRate1Value() {
      this.$store
        .dispatch('policies/saveSol1BitRateValue', this.baudRate1State)
        .then((message) => this.successToast(message))
        .catch(({ message }) => this.errorToast(message));
    },
    webKvmSessionTimeoutValidation(val) {
      if (
        !/^(3[0-9]|[4-9][0-9]|[1-9][0-9]{2}|[1-9][0-9]{3}|[1-7][0-9]{4}|8[0-5][0-9]{3}|86[0-3][0-9]{2}|86400)$/.test(
          val,
        )
      ) {
        return false;
      }
      return true;
    },
    kvmPortValueValidation(val) {
      if (
        !/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          val,
        )
      ) {
        return false;
      }
      return true;
    },
    webPortValueValidation(val) {
      if (
        !/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          val,
        )
      ) {
        return false;
      }
      return true;
    },
    solSshValueValidation(val) {
      if (
        !/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(
          val,
        )
      ) {
        return false;
      }
      return true;
    },
    vmRetryIntervalValidation(val) {
      return this.validateRange(val, 15, 30);
    },
    vmRetryCountValidation(val) {
      return this.validateRange(val, 3, 6);
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-section {
  border-bottom: 1px solid gray('300');
}

.session-timeout {
  align-self: center;
}

.page-section {
  margin-bottom: 1rem;
}

.m0 {
  margin: 0 !important;
}
</style>
