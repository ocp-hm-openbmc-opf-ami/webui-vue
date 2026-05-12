<template>
  <div>
    <header id="page-header">
      <a
        class="link-skip-nav btn btn-light"
        href="#main-content"
        @click="setFocus"
      >
        {{ $t('appHeader.skipToContent') }}
      </a>

      <b-navbar type="dark" :aria-label="$t('appHeader.applicationHeader')">
        <!-- Left aligned nav items -->
        <b-button
          id="app-header-trigger"
          class="nav-trigger"
          aria-hidden="true"
          type="button"
          variant="link"
          :class="{ open: isNavigationOpen }"
          @click="toggleNavigation"
        >
          <icon-close
            v-if="isNavigationOpen"
            :title="$t('appHeader.titleHideNavigation')"
          />
          <icon-menu
            v-if="!isNavigationOpen"
            :title="$t('appHeader.titleShowNavigation')"
          />
        </b-button>
        <b-navbar-nav class="navbar-logo">
          <b-navbar-brand
            class="mr-0"
            to="/"
            data-test-id="appHeader-container-overview"
          >
            <img
              class="header-logo"
              width="250px"
              src="../../assets/images/dashboard_header_product_logo.svg"
              :alt="altLogo"
            />
          </b-navbar-brand>
          <div v-if="isNavTagPresent" :key="routerKey" class="pl-2 nav-tags">
            <span>|</span>
            <span class="pl-3 asset-tag">{{ assetTag }}</span>
            <span class="pl-3">{{ modelType }}</span>
            <span class="pl-3">{{ serialNumber }}</span>
          </div>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto helper-menu language_dropdown">
          <b-nav-item>
            <b-form-select
              id="language"
              v-model="$i18n.locale"
              class="input language_overview"
              :options="languages"
              data-test-id="login-select-language"
              @change="languageChange"
            ></b-form-select>
          </b-nav-item>
          <b-nav-item
            v-if="biosFeatureEnabled && !isExternalUser"
            data-test-id="appHeader-container-bios"
            @click="openBios()"
          >
            <div>
              <icon-info class="iconInfo" :title="$t('appHeader.bios')" />
              <span class="responsive-text">{{ $t('appHeader.bios') }}</span>
            </div>
          </b-nav-item>
          <b-nav-item
            to="/logs/event-logs"
            data-test-id="appHeader-container-health"
          >
            <status-icon :status="healthStatusIcon" />
            {{ $t('appHeader.health') }}
          </b-nav-item>
          <b-nav-item
            v-if="isKVMandPowerEnabled"
            to="/operations/server-power-operations"
            data-test-id="appHeader-container-power"
          >
            <status-icon :status="serverStatusIcon" />
            {{ $t('appHeader.power') }}
          </b-nav-item>
          <!-- Using LI elements instead of b-nav-item to support semantic button elements -->
          <li class="nav-item">
            <b-button
              id="app-header-refresh"
              variant="link"
              data-test-id="appHeader-button-refresh"
              @click="refresh"
            >
              <icon-renew
                class="iconRenew"
                :title="$t('appHeader.titleRefresh')"
              />
              <span class="responsive-text">{{ $t('appHeader.refresh') }}</span>
            </b-button>
            <b-button
              v-if="tfaFeatureEnabled"
              id="app-header-tfa"
              variant="link"
              data-test-id="appHeader-button-tfa"
              @click="clickTfa"
            >
              <enable-tfa-icon v-if="tfaUserEnabled" class="enableTfa" />
              <disable-tfa-icon v-if="!tfaUserEnabled" class="iconRenew" />
              <span class="responsive-text">{{ $t('appHeader.2fa') }}</span>
            </b-button>
            <b-modal
              id="modal-center"
              centered
              :title="$t('appHeader.setupTwoFactorAuthentication')"
              size="lg"
              @hide="handleModalClose"
            >
              <b-alert show variant="warning" class="mb-3">
                <strong>{{ $t('appHeader.tfaWarningMessage') }}</strong>
              </b-alert>
              <p class="my-4">
                {{ $t('appHeader.qrCodeLabel') }}
              </p>
              <div class="align-center">
                <qrcode-vue :value="qrCodeUrl" :size="QrCodeSize"></qrcode-vue>
              </div>
              <hr />
              <p class="mt-4">
                {{ $t('appHeader.backupCodeLable') }}
              </p>
              <ul>
                <li
                  v-for="(code, index) in recoveryCode"
                  :key="index"
                  class="my-1"
                >
                  {{ code }}
                </li>
              </ul>
              <template #modal-footer>
                <b-button
                  variant="secondary"
                  data-test-id="2fa-close-button"
                  @click="requestModalClose"
                >
                  {{ $t('global.action.close') }}
                </b-button>
              </template>
            </b-modal>
          </li>
          <li class="nav-item">
            <b-dropdown
              id="app-header-user"
              variant="link"
              right
              data-test-id="appHeader-container-user"
            >
              <template #button-content>
                <icon-avatar
                  class="iconAvatar"
                  :title="$t('appHeader.titleProfile')"
                />
                <span class="responsive-text">{{ username }}</span>
              </template>
              <b-dropdown-item
                to="/profile-settings"
                data-test-id="appHeader-link-profile"
                >{{ $t('appHeader.profileSettings') }}
              </b-dropdown-item>
              <b-dropdown-item
                data-test-id="appHeader-link-logout"
                @click="logout"
              >
                {{ $t('appHeader.logOut') }}
              </b-dropdown-item>
            </b-dropdown>
          </li>
        </b-navbar-nav>
      </b-navbar>
    </header>
    <loading-bar />
  </div>
</template>

<script>
import BVToastMixin from '@/components/Mixins/BVToastMixin';
import IconAvatar from '@carbon/icons-vue/es/user--avatar/20';
import IconClose from '@carbon/icons-vue/es/close/20';
import IconMenu from '@carbon/icons-vue/es/menu/20';
import IconRenew from '@carbon/icons-vue/es/renew/20';
import EnableTfaIcon from '@carbon/icons-vue/es/locked/20';
import DisableTfaIcon from '@carbon/icons-vue/es/unlocked/20';
import StatusIcon from '@/components/Global/StatusIcon';
import LoadingBar from '@/components/Global/LoadingBar';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';
import QrcodeVue from 'qrcode.vue';
import { mapState } from 'vuex';
import IconInfo from '@carbon/icons-vue/es/information--filled/20';
import FeatureMixin from '@/components/Mixins/FeatureMixin';
import i18n from '@/i18n';

export default {
  name: 'AppHeader',
  components: {
    IconAvatar,
    IconClose,
    IconMenu,
    IconRenew,
    IconInfo,
    EnableTfaIcon,
    DisableTfaIcon,
    StatusIcon,
    LoadingBar,
    QrcodeVue,
  },
  mixins: [BVToastMixin, LoadingBarMixin, FeatureMixin],
  props: {
    routerKey: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      QrCodeSize: 300,
      tfaUserEnabled: this.$store.getters['authentication/tfaEnabled'],
      tfaFeatureEnabled:
        process.env.VUE_APP_ONETREE_2FA_ENABLED &&
        this.$store.getters['authentication/tfaFeatureEnabled'],
      biosFeatureEnabled:
        process.env.VUE_APP_ONETREE_RTP_ENABLED &&
        !this.isFeatureEnabled('VUE_APP_ONETREE_PSM_ENABLED'),
      qrCodeUrl: '',
      recoveryCode: [],
      isNavigationOpen: false,
      isShowingCloseConfirmation: false,
      isClosingAfterAction: false,
      altLogo: process.env.VUE_APP_COMPANY_NAME || 'AMI',
      licenseStatus: this.$store.getters['license/isLicense'],
      serverStatusIcon: 'secondary', // Set default value
      languages: [
        {
          value: 'en-US',
          text: 'US - English',
        },
        {
          value: 'ru',
          text: 'Russian - Русский',
        },
      ],
    };
  },
  computed: {
    isNavTagPresent() {
      return false;
    },
    isKVMandPowerEnabled() {
      return (
        process.env.VUE_APP_ONETREE_POWER_ENABLED === 'true' &&
        process.env.VUE_APP_ONETREE_KVM_ENABLED === 'true'
      );
    },
    assetTag() {
      return this.$store.getters['global/assetTag'];
    },
    modelType() {
      return this.$store.getters['global/modelType'];
    },
    serialNumber() {
      return this.$store.getters['global/serialNumber'];
    },
    isAuthorized() {
      return this.$store.getters['global/isAuthorized'];
    },
    userPrivilege() {
      return this.$store.getters['global/userPrivilege'];
    },
    serverStatus() {
      return this.$store.getters['dashboard/powerStatus'];
    },
    healthStatus() {
      return this.$store.getters['dashboard/healthStatus'];
    },
    healthStatusIcon() {
      return this.$store.getters['dashboard/healthStatusIcon'];
    },
    username() {
      return this.$store.getters['global/username'];
    },
    isExternalUser() {
      return this.$store.getters['authentication/isExternalUser'];
    },
    ...mapState('license', ['isLicense']),
  },
  watch: {
    isAuthorized(value) {
      if (value === false) {
        this.errorToast(this.$t('global.toast.unAuthDescription'), {
          title: this.$t('global.toast.unAuthTitle'),
        });
      }
    },
    isLicense(value) {
      this.licenseStatus = value;
    },
    serverStatus(newValue) {
      this.serverStatusIcon = this.computeServerStatusIcon(newValue);
    },
  },
  created() {
    this.$store.dispatch('authentication/resetStoreState');
    if (this.licenseStatus) {
      this.$store.dispatch('license/getUserAlertCount');
    }

    // Ensure server status icon is set on page load
    this.serverStatusIcon = this.computeServerStatusIcon(
      this.$store.getters['dashboard/powerStatus'],
    );
    window.events.listen('powerActionServerStatus', () => {
      this.serverStatusIcon = this.computeServerStatusIcon(
        this.$store.getters['dashboard/powerStatus'],
      );
    });

    // Dispatch Vuex action to fetch dashboard data instead of individual API calls
    this.$store
      .dispatch('dashboard/fetchDashboardData')
      .catch((error) => console.error(error))
      .finally(() => this.endLoader());
    if (process.env.VUE_APP_CHINESE_ZH_CN_LANGUAGE_SUPPORT == 'true')
      this.languages.push({
        value: 'zh-CN',
        text: 'China - 中文 (简体)',
      });
    if (process.env.VUE_APP_TAIWAN_ZH_TW_LANGUAGE_SUPPORT == 'true')
      this.languages.push({
        value: 'zh-TW',
        text: 'Taiwan - 中文 (正體)',
      });
    if (process.env.VUE_APP_GERMAN_DE_LANGUAGE_SUPPORT == 'true')
      this.languages.push({
        value: 'de-DE',
        text: 'Germany - Deutsch',
      });
  },
  mounted() {
    this.$root.$on(
      'change-is-navigation-open',
      (isNavigationOpen) => (this.isNavigationOpen = isNavigationOpen),
    );
  },
  methods: {
    computeServerStatusIcon(status) {
      switch (status) {
        case 'on':
          return 'success';
        case 'error':
          return 'danger';
        case 'diagnosticMode':
          return 'warning';
        case 'off':
        default:
          return 'secondary';
      }
    },
    openBios() {
      window.open('/bios/Index.html', 'BIOS');
    },
    refresh() {
      this.$emit('refresh');
    },
    clickTfa() {
      if (this.tfaUserEnabled) {
        this.$bvModal
          .msgBoxConfirm(this.$tc('pageTfa.modal.confirmMessage'), {
            title: this.$tc('pageTfa.modal.confirmation'),
            okTitle: this.$tc('global.action.yes'),
            cancelTitle: this.$t('global.action.no'),
          })
          .then((disable) => {
            if (disable) {
              this.startLoader();
              this.$store
                .dispatch('authentication/disableTfa')
                .then(() => {
                  this.tfaUserEnabled =
                    this.$store.getters['authentication/tfaEnabled'];
                })
                .catch(({ message }) => this.errorToast(message))
                .finally(() => this.endLoader());
            }
          });
      } else {
        this.startLoader();
        this.$store
          .dispatch('authentication/enableTfa')
          .then((response) => {
            this.tfaUserEnabled =
              this.$store.getters['authentication/tfaEnabled'];
            this.recoveryCode = response.RecoveryCodes;
            this.qrCodeUrl = response.Url;
            this.isShowingCloseConfirmation = false;
            this.isClosingAfterAction = false;
            this.$bvModal.show('modal-center');
          })
          .catch(({ message }) => this.errorToast(message))
          .finally(() => this.endLoader());
      }
    },
    logout() {
      this.$store.dispatch('authentication/logout');
    },
    toggleNavigation() {
      this.$root.$emit('toggle-navigation');
    },
    setFocus(event) {
      event.preventDefault();
      this.$root.$emit('skip-navigation');
    },
    handleModalClose(bvEvent) {
      if (this.isClosingAfterAction) {
        this.isClosingAfterAction = false;
        this.isShowingCloseConfirmation = false;
        return;
      }
      bvEvent.preventDefault();
      if (this.isShowingCloseConfirmation) {
        return;
      }

      this.isShowingCloseConfirmation = true;

      // Show confirmation dialog
      this.$bvModal
        .msgBoxConfirm(this.$t('appHeader.tfaCloseConfirmMessage'), {
          title: this.$t('appHeader.tfaCloseConfirmTitle'),
          okTitle: this.$t('global.action.yes'),
          cancelTitle: this.$t('global.action.no'),
        })
        .then((confirmed) => {
          if (confirmed) {
            this.tfaUserEnabled =
              this.$store.getters['authentication/tfaEnabled'];
            this.isClosingAfterAction = true;
            this.isShowingCloseConfirmation = false;
            this.$nextTick(() => {
              this.$bvModal.hide('modal-center');
            });
            this.successToast(this.$t('pageTfa.toast.tfaEnabled'));
          } else {
            this.startLoader();
            this.$store
              .dispatch('authentication/disableTfa')
              .then(() => {
                this.tfaUserEnabled =
                  this.$store.getters['authentication/tfaEnabled'];
                this.isClosingAfterAction = true;
                this.isShowingCloseConfirmation = false;
                this.$nextTick(() => {
                  this.$bvModal.hide('modal-center');
                });
                this.infoToast(this.$t('pageTfa.toast.setupCancelled'));
              })
              .catch(({ message }) => {
                this.errorToast(message);
                this.isShowingCloseConfirmation = false;
              })
              .finally(() => this.endLoader());
          }
        })
        .catch(() => {
          this.isShowingCloseConfirmation = false;
        });
    },
    requestModalClose() {
      this.$bvModal.hide('modal-center');
    },
    languageChange() {
      this.$store.commit('global/setLanguagePreference', i18n.locale);
      localStorage.setItem('storedLanguage', i18n.locale);
      this.$emit('languageChange');
    },
  },
};
</script>

<style lang="scss">
.iconInfo {
  margin-bottom: 3px;
  margin-right: 3px;
}
@mixin focus-box-shadow($padding-color: $navbar-color, $outline-color: $white) {
  box-shadow:
    inset 0 0 0 3px $padding-color,
    inset 0 0 0 5px $outline-color;
}
.app-header {
  .link-skip-nav {
    position: absolute;
    top: -60px;
    left: 0.5rem;
    z-index: $zindex-popover;
    transition: $duration--moderate-01 $exit-easing--expressive;
    &:focus {
      top: 0.5rem;
      transition-timing-function: $entrance-easing--expressive;
    }
  }
  .navbar-text,
  .nav-link,
  .btn-link {
    color: color('white') !important;
    fill: currentColor;
    padding: 0.68rem 1rem !important;

    &:hover {
      background-color: theme-color-level(light, 10);
    }
    &:active {
      background-color: theme-color-level(light, 9);
    }
    &:focus {
      @include focus-box-shadow;
      outline: 0;
    }
  }

  .nav-item {
    fill: theme-color('light');
  }

  .navbar {
    padding: 0;
    background-color: $navbar-color;

    .helper-menu {
      @include media-breakpoint-down(sm) {
        background-color: gray('800');
        width: 100%;
        justify-content: flex-end;

        .nav-link,
        .btn {
          padding: $spacer / 1.125 $spacer / 2;
        }

        .nav-link:focus,
        .btn:focus {
          @include focus-box-shadow($gray-800);
        }
      }

      .responsive-text {
        @include media-breakpoint-down(xs) {
          @include sr-only;
        }
      }
    }
    .navbar-logo {
      padding-left: 1px;
    }
  }

  .navbar-nav {
    @include media-breakpoint-up($responsive-layout-bp) {
      padding: 0 $spacer;
    }
    align-items: center;

    .navbar-brand,
    .nav-link {
      transition: $focus-transition;
    }
    .nav-tags {
      color: theme-color-level(light, 3);
      @include media-breakpoint-down(xs) {
        @include sr-only;
      }
      .asset-tag {
        @include media-breakpoint-down($responsive-layout-bp) {
          @include sr-only;
        }
      }
    }
  }

  .nav-trigger {
    fill: theme-color('light');
    width: $header-height;
    height: $header-height;
    transition: none;
    display: inline-flex;
    flex: 0 0 20px;
    align-items: center;

    svg {
      margin: 0;
    }

    &:hover {
      fill: theme-color('light');
      background-color: theme-color-level(light, 10);
    }

    &.open {
      background-color: gray('800');
    }

    @include media-breakpoint-up($responsive-layout-bp) {
      display: none;
    }
  }

  .dropdown-menu {
    min-width: 7rem;
    margin-top: 0;

    @include media-breakpoint-only(md) {
      margin-top: 4px;
    }
  }

  .navbar-expand {
    @include media-breakpoint-down(sm) {
      flex-flow: wrap;
    }
  }
}

.navbar-brand {
  padding: $spacer/2;
  height: $header-height;
  line-height: 1;
  &:focus {
    box-shadow:
      inset 0 0 0 3px $navbar-color,
      inset 0 0 0 5px color('white');
    outline: 0;
  }
}
.dropdown-item {
  &:hover {
    color: #d99b51;
    background-color: #ffffff;
  }
}
.align-center {
  text-align: center;
}
.app-header {
  .language_overview {
    color: #ffffff !important;
    background-color: #161616 !important;
    option {
      background-color: #ffffff !important;
      color: #161616 !important;
    }
  }
  .language_dropdown {
    .nav-link:focus {
      box-shadow:
        inset 0 0 0 3px #161616,
        inset 0 0 0 5px #161616;
    }
    .nav-link:hover {
      background-color: #161616 !important;
    }
    .custom-select:focus {
      box-shadow:
        inset 0 0 0 3px #161616,
        inset 0 0 0 5px #161616 !important;
    }
    .custom-select:active {
      border: 2px solid #ffffff !important;
    }
    .custom-select {
      border: 2px solid #ffffff;
      background: #ffffff
        url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='white' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
        right 0.75rem center/8px 10px no-repeat;
    }
  }
}
</style>
