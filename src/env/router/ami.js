import AppLayout from '@/layouts/AppLayout.vue';
import ChangePassword from '@/views/ChangePassword';
import TwoFactorAuthentication from '@/views/TwoFactorAuthentication';
import Sessions from '@/views/SecurityAndAccess/Sessions';
import ConsoleLayout from '@/layouts/ConsoleLayout.vue';
import Bsod from '@/views/Settings/Bsod';
import DateTime from '@/views/Settings/DateTime';
import EventLogs from '@/views/Logs/EventLogs';
import Firmware from '@/views/Operations/Firmware';
import PreserveConfiguration from '@/views/Operations/PreserveConfiguration';
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
import Network from '@/views/Settings/Network';
import Vlan from '@/views/Settings/Vlan';
import Overview from '@/views/Overview';
import PageNotFound from '@/views/PageNotFound';
import PostCodeLogs from '@/views/Logs/PostCodeLogs';
import PowerRestorePolicy from '@/views/Settings/PowerRestorePolicy';
import ProfileSettings from '@/views/ProfileSettings';
import RebootBmc from '@/views/Operations/RebootBmc';
import Policies from '@/views/SecurityAndAccess/Policies';
import Sensors from '@/views/HardwareStatus/Sensors';
import SerialOverLan from '@/views/Operations/SerialOverLan';
import SerialOverLanConsole from '@/views/Operations/SerialOverLan/SerialOverLanConsole';
import ServerPowerOperations from '@/views/Operations/ServerPowerOperations';
import Certificates from '@/views/SecurityAndAccess/Certificates';
import VirtualMedia from '@/views/Operations/VirtualMedia';
import i18n from '@/i18n';
import Dumps from '@/views/Logs/Dumps';
import SnmpSettings from '@/views/Settings/SNMP';
import Tasks from '@/views/Operations/Task/Tasks.vue';
import License from '@/views/Settings/License';
import systemInventory from '@/views/SystemInventory/SystemInventory';
import DDNS from '../../views/Settings/NetworkDDNS';
import PAM from '../../views/Settings/PamOrder/PamOrder';
import AutoVideoSettings from '@/views/Settings/AutoVideoSettings';
import VideoLogs from '@/views/Logs/VideoLogs';
import IPMIEventLog from '@/views/Logs/IPMIEventLogs';
import AdvancedLogSettings from '@/views/Settings/AdvancedLogSettings/AdvancedLogSettings.vue';
import Gpgpu from '@/views/Settings/Gpgpu';
import Addc from '@/views/HostSystemDiagnostics/Addc';
import ACD from '@/views/HostSystemDiagnostics/ACD';
import Asd from '@/views/HostSystemDiagnostics/Asd';
import AmdRemoteDebug from '@/views/HostSystemDiagnostics/AmdRemoteDebug/AmdRemoteDebug.vue';
import Adapter from '@/views/RAID/Adapter';
import PhysicalStorage from '@/views/RAID/PhysicalStorage';
import LogicalStorage from '@/views/RAID/LogicalStorage/LogicalStorage.vue';
import BrcmCreateLogicalStorage from '@/views/RAID/LogicalStorage/BrcmCreateLogicalStorage.vue';
import MsccCreateLogicalStorage from '@/views/RAID/LogicalStorage/MsccCreateLogicalStorage.vue';
import Topology from '@/views/RAID/Topology/Topology.vue';
import RaidEventLog from '@/views/RAID/EventLog/RaidEventLog.vue';
import NvmeInformation from '@/views/NvmeInformation';
import Nic from '@/views/Nic';
import Radius from '@/views/SecurityAndAccess/Radius';
import Power from '@/views/ResourceManagement/Power';
import CUPS from '@/views/Settings/CUPS';
import NodeManager from '@/views/Settings/NodeManager';
import BackupAndRestore from '@/views/Operations/BackupAndRestore';
import Ncsi from '@/views/Settings/Ncsi';
import FireWall from '@/views/Settings/FireWall';
import NetworkLink from '@/views/Settings/NetworkLink/NetworkLink';
import Bond from '@/views/Settings/Bond';
import DeviceOwnerTransfership from '@/views/Settings/DeviceOwnerTransfership/DeviceOwnerTransfership.vue';

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
      {
        path: '/two-factor-authentication',
        name: 'tfa',
        component: TwoFactorAuthentication,
        meta: {
          title: i18n.t('appPageTitle.tfa'),
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
        path: '/security-and-access/user-management',
        name: 'user-management',
        component: UserManagement,
        meta: {
          title: i18n.t('appPageTitle.userManagement'),
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
        path: '/operations/factory-default',
        name: 'factory-default',
        component: FactoryDefault,
        meta: {
          title: i18n.t('appPageTitle.FactoryDefault'),
        },
      },
      {
        path: '/operations/preserve-configuration',
        name: 'preserve',
        component: PreserveConfiguration,
        meta: {
          title: i18n.t('appPageTitle.preserve'),
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
        path: '/operations/reboot-bmc',
        name: 'reboot-bmc',
        component: RebootBmc,
        meta: {
          title: i18n.t('appPageTitle.rebootBmc'),
        },
      },
      {
        path: '/operations/tasks',
        name: 'tasks',
        component: Tasks,
        meta: {
          title: i18n.t('appPageTitle.tasks'),
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
        path: '/settings/pam',
        name: 'pam',
        component: PAM,
        meta: {
          title: i18n.t('appPageTitle.pam'),
        },
      },
      {
        path: '/settings/advanced-log',
        name: 'advanced-log-settings',
        component: AdvancedLogSettings,
        meta: {
          title: i18n.t('appPageTitle.advancedLogSettings'),
        },
      },
    ],
  },
];
if (process.env.VUE_APP_ONETREE_GPGPU_ENABLED == 'true') {
  routes[2].children.push({
    path: '/gpgpu',
    name: 'gpgpu',
    component: Gpgpu,
    meta: {
      title: i18n.t('appPageTitle.gpgpu'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_AMD_ADDC_ENABLED == 'true') {
  routes[2].children.push({
    path: '/host-system-diagnostics/addc',
    name: 'addc',
    component: Addc,
    meta: {
      title: i18n.t('appPageTitle.addc'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_ACD_ENABLED == 'true') {
  routes[2].children.push({
    path: '/host-system-diagnostics/acd',
    name: 'autonomous-crash-dump',
    component: ACD,
    meta: {
      title: i18n.t('appPageTitle.autonomousCrashDump'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_ASD_ENABLED == 'true') {
  routes[2].children.push({
    path: '/host-system-diagnostics/asd',
    name: 'asd',
    component: Asd,
    meta: {
      title: i18n.t('appPageTitle.asd'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_AMDREMOTEDBG_ENABLED == 'true') {
  routes[2].children.push({
    path: '/host-system-diagnostics/amd-remote-debug',
    name: 'amd-remote-debug',
    component: AmdRemoteDebug,
    meta: {
      title: i18n.t('appPageTitle.amdRemoteDebug'),
    },
  });
}
if (
  process.env.VUE_APP_ONETREE_MSCCRAID_ENABLED == 'true' ||
  process.env.VUE_APP_ONETREE_BRCMRAID_ENABLED == 'true'
) {
  routes[2].children.push(
    {
      path: '/raid/adapter',
      name: 'adapter',
      component: Adapter,
      meta: {
        title: i18n.t('appPageTitle.adapter'),
      },
    },
    {
      path: '/raid/physical-device',
      name: 'physical-device',
      component: PhysicalStorage,
      meta: {
        title: i18n.t('appPageTitle.physicalDevice'),
      },
    },
    {
      path: '/raid/logical-device',
      name: 'logical-device',
      component: LogicalStorage,
      meta: {
        title: i18n.t('appPageTitle.logicalDevice'),
      },
    },
    {
      path: '/raid/brcm-create-logical-device',
      name: 'create-logical-device',
      component: BrcmCreateLogicalStorage,
      meta: {
        title: i18n.t('appPageTitle.createLogicalDevice'),
      },
    },
    {
      path: '/raid/mscc-create-logical-device',
      name: 'create-logical-device',
      component: MsccCreateLogicalStorage,
      meta: {
        title: i18n.t('appPageTitle.createLogicalDevice'),
      },
    },
    {
      path: '/raid/topology',
      name: 'raid-topology',
      component: Topology,
      meta: {
        title: i18n.t('appPageTitle.raidTopology'),
      },
    },
    {
      path: '/raid/raid-event-log',
      name: 'raid-event-log',
      component: RaidEventLog,
      meta: {
        title: i18n.t('appPageTitle.raidEventLog'),
      },
    },
  );
}
if (
  process.env.VUE_APP_ONETREE_NVME_ENABLED == 'true' ||
  process.env.VUE_APP_ONETREE_NVMEBASIC_ENABLED == 'true'
) {
  routes[2].children.push({
    path: '/nvme-information',
    name: 'nvme-information',
    component: NvmeInformation,
    meta: {
      title: i18n.t('appPageTitle.nvmeInformation'),
    },
  });
}

if (process.env.VUE_APP_ONETREE_NIC_ENABLED == 'true') {
  routes[2].children.push({
    path: '/nic',
    name: 'nic-information',
    component: Nic,
    meta: {
      title: i18n.t('appPageTitle.nicInformation'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_RTP_ENABLED == 'true') {
  routes[2].children.push({
    path: '/system-inventory',
    name: 'system-inventory',
    component: systemInventory,
    meta: {
      title: i18n.t('appPageTitle.systemInventory'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_RADIUS_CLIENT_ENABLED == 'true') {
  routes[2].children.push({
    path: '/security-and-access/radius',
    name: 'radius',
    component: Radius,
    meta: {
      title: i18n.t('appPageTitle.radius'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_AMD_POWERCAP_ENABLED == 'true') {
  routes[2].children.push({
    path: '/resource-management/power',
    name: 'power',
    component: Power,
    meta: {
      title: i18n.t('appPageTitle.power'),
    },
  });
}

if (process.env.VUE_APP_ONETREE_INTELSIPACK_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/cups',
    name: 'cups',
    component: CUPS,
    meta: {
      title: i18n.t('appPageTitle.cups'),
    },
  });
}

if (process.env.VUE_APP_ONETREE_INTELSIPACK_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/node-manager',
    name: 'nodeManager',
    component: NodeManager,
    meta: {
      title: i18n.t('appPageTitle.nodeManager'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_BACKUP_RESTORE_ENABLED == 'true') {
  routes[2].children.push({
    path: '/operations/backup-and-restore',
    name: 'backup-and-restore',
    component: BackupAndRestore,
    meta: {
      title: i18n.t('appPageTitle.backupAndRestore'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_NETWORK_NCSI_SUPPORT_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/ncsi',
    name: 'ncsi',
    component: Ncsi,
    meta: {
      title: i18n.t('appPageTitle.ncsi'),
    },
  });
}
if (
  process.env.VUE_APP_ONETREE_NETWORK_SYSTEM_FIREWALL_SUPPORT_ENABLED == 'true'
) {
  routes[2].children.push({
    path: '/settings/firewall',
    name: 'FireWall',
    component: FireWall,
    meta: {
      title: i18n.t('appPageTitle.systemFirewall'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_RTP_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/network-link',
    name: 'networkLink',
    component: NetworkLink,
    meta: {
      title: i18n.t('appPageTitle.networkLink'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_NETWORK_BONDING_SUPPORT_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/bond',
    name: 'Bond',
    component: Bond,
    meta: {
      title: i18n.t('appPageTitle.bond'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_GPGPU_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/device-owner-transfership',
    name: 'device-owner-transfership',
    component: DeviceOwnerTransfership,
    meta: {
      title: i18n.t('appPageTitle.deviceOwnerTransfership'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_SMTP_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/smtp',
    name: 'smtpSettings',
    component: SmtpSettings,
    meta: {
      title: i18n.t('appPageTitle.smtpSettings'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_POWER_RESTORE_POLICY_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/power-restore-policy',
    name: 'power-restore-policy',
    component: PowerRestorePolicy,
    meta: {
      title: i18n.t('appPageTitle.powerRestorePolicy'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_SNMP_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/snmp',
    name: 'snmp',
    component: SnmpSettings,
    meta: {
      title: i18n.t('appPageTitle.snmpSettings'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_KVM_ENABLED == 'true') {
  routes[2].children.push({
    path: '/logs/video-log',
    name: 'video-log',
    component: VideoLogs,
    meta: {
      title: i18n.t('appPageTitle.videoLog'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_KVM_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/bsod',
    name: 'bsod',
    component: Bsod,
    meta: {
      title: i18n.t('appPageTitle.bsod'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_KVM_ENABLED == 'true') {
  routes[2].children.push({
    path: '/operations/kvm',
    name: 'kvm',
    component: Kvm,
    meta: {
      title: i18n.t('appPageTitle.kvm'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_KVM_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/auto-video',
    name: 'auto-video',
    component: AutoVideoSettings,
    meta: {
      title: i18n.t('appPageTitle.autoVideo'),
    },
  });
}
if (process.env.VUE_APP_OBMC_DEBUG_COLLECTOR_ENABLED == 'true') {
  routes[2].children.push({
    path: '/logs/dumps',
    name: 'dumps',
    component: Dumps,
    meta: {
      title: i18n.t('appPageTitle.dumps'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_SEL_ENABLED == 'true') {
  routes[2].children.push({
    path: '/logs/event-logs',
    name: 'event-logs',
    component: EventLogs,
    meta: {
      title: i18n.t('appPageTitle.eventLogs'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_SEL_ENABLED == 'true') {
  routes[2].children.push({
    path: '/logs/ipmi-event-log',
    name: 'ipmi-event-log',
    component: IPMIEventLog,
    meta: {
      title: i18n.t('appPageTitle.ipmiEventLog'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_POSTCODE_ENABLED == 'true') {
  routes[2].children.push({
    path: '/logs/post-code-logs',
    name: 'post-code-logs',
    component: PostCodeLogs,
    meta: {
      title: i18n.t('appPageTitle.postCodeLogs'),
    },
  });
}
if (process.env.VUE_APP_OBMC_LEDS_ENABLED == 'true') {
  routes[2].children.push({
    path: '/hardware-status/inventory',
    name: 'inventory',
    component: Inventory,
    meta: {
      title: i18n.t('appPageTitle.inventory'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_SENSORS_ENABLED == 'true') {
  routes[2].children.push({
    path: '/hardware-status/sensors',
    name: 'sensors',
    component: Sensors,
    meta: {
      title: i18n.t('appPageTitle.sensors'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_SOL_ENABLED == 'true') {
  routes[2].children.push({
    path: '/operations/serial-over-lan',
    name: 'serial-over-lan',
    component: SerialOverLan,
    meta: {
      title: i18n.t('appPageTitle.serialOverLan'),
      exclusiveToRoles: [roles.administrator],
    },
  });
}
if (process.env.VUE_APP_ONETREE_POWER_ENABLED == 'true') {
  routes[2].children.push({
    path: '/operations/server-power-operations',
    name: 'server-power-operations',
    component: ServerPowerOperations,
    meta: {
      title: i18n.t('appPageTitle.serverPowerOperations'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_MEDIA_REDIRECT_ENABLED == 'true') {
  routes[2].children.push({
    path: '/operations/virtual-media',
    name: 'virtual-media',
    component: VirtualMedia,
    meta: {
      title: i18n.t('appPageTitle.virtualMedia'),
      exclusiveToRoles: [roles.administrator, roles.operator, roles.readonly],
    },
  });
}
if (process.env.VUE_APP_ONETREE_NTP_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/date-time',
    name: 'date-time',
    component: DateTime,
    meta: {
      title: i18n.t('appPageTitle.dateTime'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_NETWORK_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/network',
    name: 'network',
    component: Network,
    meta: {
      title: i18n.t('appPageTitle.network'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_NETWORK_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/network-ddns',
    name: 'network-DDNS',
    component: DDNS,
    meta: {
      title: i18n.t('appPageTitle.networkDDNS'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_NETWORK_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/vlan',
    name: 'vlan',
    component: Vlan,
    meta: {
      title: i18n.t('appPageTitle.vlan'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_LICENSE_ENABLED == 'true') {
  routes[2].children.push({
    path: '/settings/license',
    name: 'License',
    component: License,
    meta: {
      title: i18n.t('appPageTitle.License'),
    },
  });
}
if (process.env.VUE_APP_ONETREE_SESSION_ENABLED == 'true') {
  routes[2].children.push({
    path: '/security-and-access/sessions',
    name: 'sessions',
    component: Sessions,
    meta: {
      title: i18n.t('appPageTitle.sessions'),
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
