import IconDashboard from '@carbon/icons-vue/es/dashboard/16';
import IconTextLinkAnalysis from '@carbon/icons-vue/es/text-link--analysis/16';
import IconDataCheck from '@carbon/icons-vue/es/data--check/16';
import IconSettingsAdjust from '@carbon/icons-vue/es/settings--adjust/16';
import IconSettings from '@carbon/icons-vue/es/settings/16';
import IconSecurity from '@carbon/icons-vue/es/security/16';
import IconChevronUp from '@carbon/icons-vue/es/chevron--up/16';
import IconDataBase from '@carbon/icons-vue/es/data--base--alt/16';
import IconNic from '@carbon/icons-vue/es/network--2/16';
import IconObjectStorage from '@carbon/icons-vue/es/object-storage/16';
import IconHostSystemDiagnostics from '@carbon/icons-vue/es/laptop/16';
import IconStorageRequest from '@carbon/icons-vue/es/storage-request/16';

const roles = {
  administrator: 'Administrator',
  operator: 'Operator',
  readonly: 'ReadOnly',
  noaccess: 'NoAccess',
};

const AppNavigationMixin = {
  components: {
    iconOverview: IconDashboard,
    iconLogs: IconTextLinkAnalysis,
    iconHealth: IconDataCheck,
    iconControl: IconSettingsAdjust,
    iconSettings: IconSettings,
    iconSecurityAndAccess: IconSecurity,
    iconExpand: IconChevronUp,
    iconResourceManagement: IconDataBase,
    iconNic: IconNic,
    iconObjectStorage: IconObjectStorage,
    iconHostSystemDiagnostics: IconHostSystemDiagnostics,
    iconStorageRequest: IconStorageRequest,
  },
  data() {
    return this.renderNavigationItems();
  },
  methods: {
    renderNavigationItems() {
      let navigationItemsList = {};
      navigationItemsList.navigationItems = [
        {
          id: 'overview',
          label: this.$t('appNavigation.overview'),
          route: '/',
          icon: 'iconOverview',
        },
        {
          id: 'logs',
          label: this.$t('appNavigation.logs'),
          icon: 'iconLogs',
          children: [
            {
              id: 'dumps',
              label: this.$t('appNavigation.dumps'),
              route: '/logs/dumps',
            },
            {
              id: 'event-logs',
              label: this.$t('appNavigation.eventLogs'),
              route: '/logs/event-logs',
            },
            {
              id: 'post-code-logs',
              label: this.$t('appNavigation.postCodeLogs'),
              route: '/logs/post-code-logs',
            },
          ],
        },
        {
          id: 'hardware-status',
          label: this.$t('appNavigation.hardwareStatus'),
          icon: 'iconHealth',
          children: [
            {
              id: 'inventory',
              label: this.$t('appNavigation.inventory'),
              route: '/hardware-status/inventory',
            },
            {
              id: 'sensors',
              label: this.$t('appNavigation.sensors'),
              route: '/hardware-status/sensors',
            },
          ],
        },
        {
          id: 'operations',
          label: this.$t('appNavigation.operations'),
          icon: 'iconControl',
          children: [
            {
              id: 'kvm',
              label: this.$t('appNavigation.kvm'),
              route: '/operations/kvm',
            },
            {
              id: 'factory-default',
              label: this.$t('appNavigation.factoryDefault'),
              route: '/operations/factory-default',
            },
            {
              id: 'firmware',
              label: this.$t('appNavigation.firmware'),
              route: '/operations/firmware',
            },
            {
              id: 'reboot-bmc',
              label: this.$t('appNavigation.rebootBmc'),
              route: '/operations/reboot-bmc',
            },
            {
              id: 'serial-over-lan',
              label: this.$t('appNavigation.serialOverLan'),
              route: '/operations/serial-over-lan',
              exclusiveToRoles: [roles.administrator],
            },
            {
              id: 'server-power-operations',
              label: this.$t('appNavigation.serverPowerOperations'),
              route: '/operations/server-power-operations',
            },
            {
              id: 'virtual-media',
              label: this.$t('appNavigation.virtualMedia'),
              route: '/operations/virtual-media',
              exclusiveToRoles: [roles.administrator],
            },
          ],
        },
        {
          id: 'settings',
          label: this.$t('appNavigation.settings'),
          icon: 'iconSettings',
          children: [
            {
              id: 'bsod',
              label: this.$t('appNavigation.bsod'),
              route: '/settings/bsod',
            },
            {
              id: 'date-time',
              label: this.$t('appNavigation.dateTime'),
              route: '/settings/date-time',
            },
            {
              id: 'network',
              label: this.$t('appNavigation.network'),
              route: '/settings/network',
            },
            {
              id: 'vlan',
              label: this.$t('appNavigation.vlan'),
              route: '/settings/vlan',
            },
            {
              id: 'smtp',
              label: this.$t('appNavigation.smtpSettings'),
              route: '/settings/smtp',
            },
            {
              id: 'Auto-Video-Settings',
              label: this.$t('appNavigation.autovideo'),
              route: '/settings/Autovideo',
            },
          ],
        },
        {
          id: 'platform-event-filter',
          label: this.$t('appNavigation.pef'),
          icon: 'iconLogs',
          children: [
            {
              id: 'event-filter',
              label: this.$t('appNavigation.eventFilter'),
              route: '/pef/eventFilter',
            },
            {
              id: 'alert-destination',
              label: this.$t('appNavigation.alertDestination'),
              route: '/pef/alertDestination',
            },
          ],
        },
        {
          id: 'security-and-access',
          label: this.$t('appNavigation.securityAndAccess'),
          icon: 'iconSecurityAndAccess',
          children: [
            {
              id: 'sessions',
              label: this.$t('appNavigation.sessions'),
              route: '/security-and-access/sessions',
            },
            {
              id: 'ldap',
              label: this.$t('appNavigation.ldap'),
              route: '/security-and-access/ldap',
            },
            {
              id: 'user-management',
              label: this.$t('appNavigation.userManagement'),
              route: '/security-and-access/user-management',
            },
            {
              id: 'policies',
              label: this.$t('appNavigation.policies'),
              route: '/security-and-access/policies',
            },
            {
              id: 'certificates',
              label: this.$t('appNavigation.certificates'),
              route: '/security-and-access/certificates',
            },
          ],
        },
        {
          id: 'host-system-diagnostics',
          label: this.$t('appNavigation.hostSystemDiagnostics'),
          icon: 'iconLogs',
          children: [
            {
              id: 'acd',
              label: this.$t('appNavigation.autonomousCrashDump'),
              route: '/host-system-diagnostics/acd',
            },
            {
              id: 'asd',
              label: this.$t('appNavigation.asd'),
              route: '/host-system-diagnostics/asd',
            },
          ],
        },
        {
          id: 'resource-management',
          label: this.$t('appNavigation.resourceManagement'),
          icon: 'iconResourceManagement',
          children: [
            {
              id: 'power',
              label: this.$t('appNavigation.power'),
              route: '/resource-management/power',
            },
          ],
        },
      ];
      if (process.env.VUE_APP_RAID_ENABLED === 'true') {
        navigationItemsList.navigationItems.push({
          id: 'raid',
          label: this.$t('appNavigation.raidManagement'),
          icon: 'iconStorageRequest',
          children: [
            {
              id: 'adapter',
              label: this.$t('appNavigation.adapter'),
              route: '/raid/adapter',
            },
            {
              id: 'physical-device',
              label: this.$t('appNavigation.physicalDevice'),
              route: '/raid/physical-device',
            },
            {
              id: 'logical-device',
              label: this.$t('appNavigation.logicalDevice'),
              route: '/raid/logical-device',
            },
          ],
        });
      }
      if (process.env.VUE_APP_NVME_ENABLED === 'true') {
        navigationItemsList.navigationItems.push({
          id: 'nvmeInformation',
          label: this.$t('appNavigation.nvmeInformation'),
          route: '/nvme-information',
          icon: 'iconObjectStorage',
        });
      }
      if (process.env.VUE_APP_NIC_ENABLED === 'true') {
        navigationItemsList.navigationItems.push({
          id: 'nic',
          label: this.$t('appNavigation.nicInformation'),
          icon: 'iconNic',
          route: '/nic',
        });
      }
      if (process.env.VUE_APP_ONDEMAND_ENABLED === 'true') {
        navigationItemsList.navigationItems[4].children.push({
          id: 'OnDemand',
          label: this.$t('appNavigation.onDemand'),
          route: '/settings/on-demand',
        });
      }
      return navigationItemsList;
    },
  },
};

export default AppNavigationMixin;
