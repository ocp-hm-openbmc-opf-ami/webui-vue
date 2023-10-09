import AppLayout from '@/layouts/AppLayout.vue';
import ChangePassword from '@/views/ChangePassword';
import Sessions from '@/views/SecurityAndAccess/Sessions';
import ConsoleLayout from '@/layouts/ConsoleLayout.vue';
import Bsod from '@/views/Settings/Bsod';
import DateTime from '@/views/Settings/DateTime';
import EventLogs from '@/views/Logs/EventLogs';
import Firmware from '@/views/Operations/Firmware';
import Inventory from '@/views/HardwareStatus/Inventory';
import Ldap from '@/views/SecurityAndAccess/Ldap';
import Kvm from '@/views/Operations/Kvm';
import FactoryDefault from '@/views/Operations/FactoryDefault';
import KvmConsole from '@/views/Operations/Kvm/KvmConsole';
import UserManagement from '@/views/SecurityAndAccess/UserManagement';
import Login from '@/views/Login';
import LoginLayout from '@/layouts/LoginLayout';
import SmtpSettings from '@/views/Settings/SMTP';
import EventFilter from '@/views/PEF/EventFilter';
import AlertDestination from '@/views/PEF/AlertDestination';
import Network from '@/views/Settings/Network';
import Vlan from '@/views/Settings/Vlan';
import Overview from '@/views/Overview';
import PageNotFound from '@/views/PageNotFound';
import PostCodeLogs from '@/views/Logs/PostCodeLogs';
import ProfileSettings from '@/views/ProfileSettings';
import RebootBmc from '@/views/Operations/RebootBmc';
import Policies from '@/views/SecurityAndAccess/Policies';
import Sensors from '@/views/HardwareStatus/Sensors';
import SerialOverLan from '@/views/Operations/SerialOverLan';
import SerialOverLanConsole from '@/views/Operations/SerialOverLan/SerialOverLanConsole';
import ServerPowerOperations from '@/views/Operations/ServerPowerOperations';
import Certificates from '@/views/SecurityAndAccess/Certificates';
import VirtualMedia from '@/views/Operations/VirtualMedia';
import Power from '@/views/ResourceManagement/Power';
import i18n from '@/i18n';
import Dumps from '@/views/Logs/Dumps';
import ACD from '@/views/HostSystemDiagnostics/ACD';
import Asd from '@/views/HostSystemDiagnostics/Asd';

const roles = {
  administrator: 'Administrator',
  operator: 'Operator',
  readonly: 'ReadOnly',
  noaccess: 'NoAccess',
};

const routes = [
  {
    path: '/login',
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: Login,
        meta: {
          title: i18n.t('appPageTitle.login'),
        },
      },
      {
        path: '/change-password',
        name: 'change-password',
        component: ChangePassword,
        meta: {
          title: i18n.t('appPageTitle.changePassword'),
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/console',
    component: ConsoleLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'serial-over-lan-console',
        name: 'serial-over-lan-console',
        component: SerialOverLanConsole,
        meta: {
          title: i18n.t('appPageTitle.serialOverLan'),
        },
      },
      {
        path: 'kvm',
        name: 'kvm-console',
        component: KvmConsole,
        meta: {
          title: i18n.t('appPageTitle.kvm'),
        },
      },
    ],
  },
  {
    path: '/',
    meta: {
      requiresAuth: true,
    },
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'overview',
        component: Overview,
        meta: {
          title: i18n.t('appPageTitle.overview'),
        },
      },
      {
        path: '/profile-settings',
        name: 'profile-settings',
        component: ProfileSettings,
        meta: {
          title: i18n.t('appPageTitle.profileSettings'),
        },
      },
      {
        path: '/logs/dumps',
        name: 'dumps',
        component: Dumps,
        meta: {
          title: i18n.t('appPageTitle.dumps'),
        },
      },
      {
        path: '/logs/event-logs',
        name: 'event-logs',
        component: EventLogs,
        meta: {
          title: i18n.t('appPageTitle.eventLogs'),
        },
      },
      {
        path: '/logs/post-code-logs',
        name: 'post-code-logs',
        component: PostCodeLogs,
        meta: {
          title: i18n.t('appPageTitle.postCodeLogs'),
        },
      },
      {
        path: '/hardware-status/inventory',
        name: 'inventory',
        component: Inventory,
        meta: {
          title: i18n.t('appPageTitle.inventory'),
        },
      },
      {
        path: '/hardware-status/sensors',
        name: 'sensors',
        component: Sensors,
        meta: {
          title: i18n.t('appPageTitle.sensors'),
        },
      },
      {
        path: '/security-and-access/sessions',
        name: 'sessions',
        component: Sessions,
        meta: {
          title: i18n.t('appPageTitle.sessions'),
        },
      },
      {
        path: '/security-and-access/ldap',
        name: 'ldap',
        component: Ldap,
        meta: {
          title: i18n.t('appPageTitle.ldap'),
        },
      },
      {
        path: '/security-and-access/user-management',
        name: 'user-management',
        component: UserManagement,
        meta: {
          title: i18n.t('appPageTitle.userManagement'),
        },
      },
      {
        path: '/security-and-access/policies',
        name: 'policies',
        component: Policies,
        meta: {
          title: i18n.t('appPageTitle.policies'),
        },
      },
      {
        path: '/security-and-access/certificates',
        name: 'certificates',
        component: Certificates,
        meta: {
          title: i18n.t('appPageTitle.certificates'),
        },
      },
      {
        path: '/settings/date-time',
        name: 'date-time',
        component: DateTime,
        meta: {
          title: i18n.t('appPageTitle.dateTime'),
        },
      },
      {
        path: '/settings/bsod',
        name: 'bsod',
        component: Bsod,
        meta: {
          title: i18n.t('appPageTitle.bsod'),
        },
      },
      {
        path: '/operations/kvm',
        name: 'kvm',
        component: Kvm,
        meta: {
          title: i18n.t('appPageTitle.kvm'),
        },
      },
      {
        path: '/operations/factory-default',
        name: 'factory-default',
        component: FactoryDefault,
        meta: {
          title: i18n.t('appPageTitle.FactoryDefault'),
        },
      },
      {
        path: '/operations/firmware',
        name: 'firmware',
        component: Firmware,
        meta: {
          title: i18n.t('appPageTitle.firmware'),
        },
      },
      {
        path: '/settings/smtp',
        name: 'smtpSettings',
        component: SmtpSettings,
        meta: {
          title: i18n.t('appPageTitle.smtpSettings'),
        },
      },
      {
        path: '/pef/eventFilter',
        name: 'eventFilter',
        component: EventFilter,
        meta: {
          title: i18n.t('appPageTitle.eventFilter'),
        },
      },
      {
        path: '/pef/alertDestination',
        name: 'alertDestination',
        component: AlertDestination,
        meta: {
          title: i18n.t('appPageTitle.alertDestination'),
        },
      },
      {
        path: '/settings/network',
        name: 'network',
        component: Network,
        meta: {
          title: i18n.t('appPageTitle.network'),
        },
      },
      {
        path: '/settings/vlan',
        name: 'vlan',
        component: Vlan,
        meta: {
          title: i18n.t('appPageTitle.vlan'),
        },
      },
      {
        path: '/host-system-diagnostics/acd',
        name: 'autonomous-crash-dump',
        component: ACD,
        meta: {
          title: i18n.t('appPageTitle.autonomousCrashDump'),
        },
      },
      {
        path: '/host-system-diagnostics/asd',
        name: 'asd',
        component: Asd,
        meta: {
          title: i18n.t('appPageTitle.asd'),
        },
      },
      {
        path: '/resource-management/power',
        name: 'power',
        component: Power,
        meta: {
          title: i18n.t('appPageTitle.power'),
        },
      },
      {
        path: '/operations/reboot-bmc',
        name: 'reboot-bmc',
        component: RebootBmc,
        meta: {
          title: i18n.t('appPageTitle.rebootBmc'),
        },
      },
      {
        path: '/operations/serial-over-lan',
        name: 'serial-over-lan',
        component: SerialOverLan,
        meta: {
          title: i18n.t('appPageTitle.serialOverLan'),
          exclusiveToRoles: [roles.administrator],
        },
      },
      {
        path: '/operations/server-power-operations',
        name: 'server-power-operations',
        component: ServerPowerOperations,
        meta: {
          title: i18n.t('appPageTitle.serverPowerOperations'),
        },
      },
      {
        path: '/operations/virtual-media',
        name: 'virtual-media',
        component: VirtualMedia,
        meta: {
          title: i18n.t('appPageTitle.virtualMedia'),
          exclusiveToRoles: [roles.administrator],
        },
      },
    ],
  },
];
if (process.env.VUE_APP_ONDEMAND_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/on-demand',
    name: 'on-demand',
    component: () =>
      import(
        /* webpackChunkName: "OnDemandInformation" */ '@/views/Settings/OnDemand'
      ),
    meta: {
      title: i18n.t('appPageTitle.onDemand'),
    },
  });
}
if (process.env.VUE_APP_RAID_ENABLED == 'true') {
  routes[2].children.push(
    {
      path: '/raid/adapter',
      name: 'adapter',
      component: () =>
        import(/* webpackChunkName: "Adapter" */ '@/views/RAID/Adapter'),
      meta: {
        title: i18n.t('appPageTitle.adapter'),
      },
    },
    {
      path: '/raid/physical-device',
      name: 'physical-device',
      component: () =>
        import(
          /* webpackChunkName: "PhysicalStorage" */ '@/views/RAID/PhysicalStorage'
        ),
      meta: {
        title: i18n.t('appPageTitle.physicalDevice'),
      },
    },
    {
      path: '/raid/logical-device',
      name: 'logical-device',
      component: () =>
        import(
          /* webpackChunkName: "LogicalStorage" */ '@/views/RAID/LogicalStorage/LogicalStorage.vue'
        ),
      meta: {
        title: i18n.t('appPageTitle.logicalDevice'),
      },
    },
    {
      path: '/raid/create-logical-device',
      name: 'create-logical-device',
      component: () =>
        import(
          /* webpackChunkName: "CreateLogicalStorage" */ '@/views/RAID/LogicalStorage/CreateLogicalStorage.vue'
        ),
      meta: {
        title: i18n.t('appPageTitle.createLogicalDevice'),
      },
    }
  );
}
if (process.env.VUE_APP_NVME_ENABLED == 'true') {
  routes[2].children.push({
    path: '/nvme-information',
    name: 'nvme-information',
    component: () =>
      import(
        /* webpackChunkName: "NvmeInformation" */ '@/views/NvmeInformation'
      ),
    meta: {
      title: i18n.t('appPageTitle.nvmeInformation'),
    },
  });
}

if (process.env.VUE_APP_NIC_ENABLED == 'true') {
  routes[2].children.push({
    path: '/nic',
    name: 'nic-information',
    component: () =>
      import(/* webpackChunkName: "nicInformation" */ '@/views/Nic'),
    meta: {
      title: i18n.t('appPageTitle.nicInformation'),
    },
  });
}
routes[2].children.push({
  path: '*',
  name: 'page-not-found',
  component: PageNotFound,
  meta: {
    title: i18n.t('appPageTitle.pageNotFound'),
  },
});

export default routes;
