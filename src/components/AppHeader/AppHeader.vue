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
        <b-navbar-nav class="ml-auto helper-menu">
          <b-nav-item
            to="/logs/event-logs"
            data-test-id="appHeader-container-health"
          >
            <status-icon :status="healthStatusIcon" />
            {{ $t('appHeader.health') }}
          </b-nav-item>
          <b-nav-item
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
              @hidden="resetForm"
            >
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
              <template #modal-footer="{ close }">
                <b-button
                  variant="secondary"
                  data-test-id="2fa-close-button"
                  @click="close()"
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

export default {
  name: 'AppHeader',
  components: {
    IconAvatar,
    IconClose,
    IconMenu,
    IconRenew,
    EnableTfaIcon,
    DisableTfaIcon,
    StatusIcon,
    LoadingBar,
    QrcodeVue,
  },
  mixins: [BVToastMixin, LoadingBarMixin],
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
        process.env.VUE_APP_TFA &&
        this.$store.getters['authentication/tfaFeatureEnabled'],
      qrCodeUrl: '',
      recoveryCode: [],
      isNavigationOpen: false,
      altLogo: process.env.VUE_APP_COMPANY_NAME || 'AMI',
      licenseStatus: this.$store.getters['license/isLicense'],
    };
  },
  computed: {
    isNavTagPresent() {
      return false;
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
      return this.$store.getters['system/serverStatus'];
    },
    healthStatus() {
      return this.$store.getters['eventLog/healthStatus'];
    },
    serverStatusIcon() {
      switch (this.serverStatus) {
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
    healthStatusIcon() {
      switch (this.healthStatus) {
        case 'OK':
          return 'success';
        case 'Warning':
          return 'warning';
        case 'Critical':
          return 'danger';
        default:
          return 'secondary';
      }
    },
    username() {
      return this.$store.getters['global/username'];
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
    isLicense: function (value) {
      this.licenseStatus = value;
    },
  },
  created() {
    // Reset auth state to check if user is authenticated based
    // on available browser cookies
    this.$store.dispatch('authentication/resetStoreState');
    if (this.licenseStatus) {
      this.$store.dispatch('license/getUserAlertCount');
    }
  },
  mounted() {
    this.$root.$on(
      'change-is-navigation-open',
      (isNavigationOpen) => (this.isNavigationOpen = isNavigationOpen),
    );
  },
  methods: {
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
    resetForm() {
      this.tfaUserEnabled = true;
    },
  },
};
</script>

<style lang="scss">
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
</style>
