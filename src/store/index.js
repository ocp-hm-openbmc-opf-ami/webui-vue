import Vue from 'vue';
import Vuex from 'vuex';

import GlobalStore from './modules/GlobalStore';
import DashboardStore from './modules/Dashboard/DashboardStore';
import AuthenticationStore from './modules/Authentication/AuthenticanStore';
import BsodStore from './modules/Settings/BsodStore';
import SessionsStore from './modules/SecurityAndAccess/SessionsStore';
import LdapStore from './modules/SecurityAndAccess/LdapStore';
import UserManagementStore from './modules/SecurityAndAccess/UserManagementStore';
import CertificatesStore from './modules/SecurityAndAccess/CertificatesStore';
import FirmwareStore from './modules/Operations/FirmwareStore';
import BootSettingsStore from './modules/Operations/BootSettingsStore';
import ControlStore from './modules/Operations/ControlStore';
import PowerControlStore from './modules/ResourceManagement/PowerControlStore';
import PowerPolicyStore from './modules/Settings/PowerPolicyStore';
import NetworkStore from './modules/Settings/NetworkStore';
import VlanStore from './modules/Settings/VlanStore';
import SMTPStore from './modules/Settings/SMTPStore';
import EventFilterStore from './modules/Pef/EventFilterStore';
import EventLogStore from './modules/Logs/EventLogStore';
import DumpsStore from './modules/Logs/DumpsStore';
import SensorsStore from './modules/HardwareStatus/SensorsStore';
import ServerLedStore from './modules/HardwareStatus/ServerLedStore';
import SystemStore from './modules/HardwareStatus/SystemStore';
import ChassisStore from './modules/HardwareStatus/ChassisStore';
import BmcStore from './modules/HardwareStatus/BmcStore';
import PostCodeLogsStore from './modules/Logs/PostCodeLogsStore';
import SbmrLogsStore from './modules/Logs/SbmrLogStore';
import PoliciesStore from './modules/SecurityAndAccess/PoliciesStore';
import FactoryResetStore from './modules/Operations/FactoryResetStore';
import KeyClearStore from './modules/Operations/KeyClearStore';
import FactoryDefaultStore from './modules/Operations/FactoryDefault';
import DateTimeStore from './modules/Settings/DateTimeStore';
import VirtualMediaStore from './modules/Operations/VirtualMediaStore';
import VirtualMediaStoreHost02 from './modules/Operations/VirtualMediaStoreHost02';
import KvmStore from './modules/Operations/KvmStore';
import Kvm1Store from './modules/Operations/Kvm1Store';
import NicStore from './modules/Nic/Nic';
import NvmeInformationStore from './modules/NvmeInformation/NvmeInformationStore';
import AutonomousCrashDumpStore from './modules/HostSystemDiagnostics/AcdStore';
import AsdStore from './modules/HostSystemDiagnostics/AsdStore';
import RaidStore from './modules/Raid/RaidStore';
import LogicalSl8Store from './modules/Raid/Sl8/LogicalSl8Store';
import LogicalStore from './modules/Raid/LogicalStore';
import PhysicalStore from './modules/Raid/PhysicalStore';
import RaidEventLogStore from './modules/Raid/RaidEventLogStore';
import RaidSl8Store from './modules/Raid/Sl8/RaidSl8Store';
import PhysicalSl8Store from './modules/Raid/Sl8/PhysicalSl8Store';
import RaidFirmwareUpdate from './modules/Raid/FirmwareUpdateStore';
import ArrayDrivesSl8Store from './modules/Raid/Sl8/ArrayDrivesSl8Store';
import BackupAndRestore from './modules/Operations/BackupAndRestore';
import SNMPStore from './modules/Settings/SNMPStore';
import FireWallStore from './modules/Settings/FireWallStore';
import CupsStore from './modules/Settings/CupsStore';
import BondStore from './modules/Settings/BondStore';
import LicenseStore from './modules/Settings/LicenseStore';
import SystemInfoStore from './modules/SystemInventory/SystemInventoryStore';
import NetworkDDNSStore from './modules/Settings/NetworkDDNSStore';
import NetworkLinkStore from './modules/Settings/NetworkLinkStore';
import ADDCStore from './modules/Settings/ADDCStore';
import Ncsi from './modules/Settings/NcsiStore';
import PamOrderStore from './modules/Settings/PamOrderStore';
import TaskStore from './modules/Operations/TaskStore';
import NodeManagerStore from './modules/Settings/NodeManagerStore';
import VideoLogStore from './modules/Logs/VideoLogStore';
import AutoVideoStore from './modules/Settings/AutoVideoStore';
import PreserveConfigStore from './modules/Operations/PreserveConfigurationStore';
import RadiusStore from './modules/SecurityAndAccess/RadiusStore';
import AmdRemoteDebugStore from './modules/HostSystemDiagnostics/AmdRemoteDebugStore';
import IPMIEventLogStore from './modules/Logs/IPMIEventLogStore';
import Gpu from './modules/Settings/GpuStore';
import AdvancedLogSettingsStore from './modules/Settings/AdvancedLogSettingsStore';
import FruStore from './modules/Fru/FruStore';
import DeviceOwnerTransfershipStore from './modules/Settings/DeviceOwnerTransfershipStore';
import SpdmStore from './modules/Settings/SPDMStore';
import PowerShelfStore from './modules/PowerShelf/PowerShelfStore';
import PowerEquipmentStore from './modules/PowerShelf/PowerEquipmentStore';
import Kvm1ControlStore from './modules/Operations/kvm1ControlStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    global: GlobalStore,
    dashboard: DashboardStore,
    authentication: AuthenticationStore,
    bsod: BsodStore,
    sessions: SessionsStore,
    dateTime: DateTimeStore,
    ldap: LdapStore,
    userManagement: UserManagementStore,
    firmware: FirmwareStore,
    serverBootSettings: BootSettingsStore,
    controls: ControlStore,
    powerControl: PowerControlStore,
    powerPolicy: PowerPolicyStore,
    network: NetworkStore,
    vlan: VlanStore,
    smtp: SMTPStore,
    eventFilter: EventFilterStore,
    eventLog: EventLogStore,
    dumps: DumpsStore,
    sensors: SensorsStore,
    serverLed: ServerLedStore,
    certificates: CertificatesStore,
    system: SystemStore,
    chassis: ChassisStore,
    bmc: BmcStore,
    postCodeLogs: PostCodeLogsStore,
    sbmrCodeLogs: SbmrLogsStore,
    virtualMedia: VirtualMediaStore,
    virtualMediaHost02: VirtualMediaStoreHost02,
    kvm: KvmStore,
    kvm1: Kvm1Store,
    policies: PoliciesStore,
    factoryReset: FactoryResetStore,
    keyClear: KeyClearStore,
    FactoryDefault: FactoryDefaultStore,
    nic: NicStore,
    nvme: NvmeInformationStore,
    acd: AutonomousCrashDumpStore,
    asd: AsdStore,
    raid: RaidStore,
    logicalDrive: LogicalStore,
    physical: PhysicalStore,
    raidEventLog: RaidEventLogStore,
    raidSl8Store: RaidSl8Store,
    physicalSl8: PhysicalSl8Store,
    raidFirmwareUpdate: RaidFirmwareUpdate,
    logicalSl8: LogicalSl8Store,
    arrayDrivesSl8Store: ArrayDrivesSl8Store,
    backupAndRestore: BackupAndRestore,
    snmp: SNMPStore,
    fireWall: FireWallStore,
    cups: CupsStore,
    bond: BondStore,
    license: LicenseStore,
    SystemStore: SystemInfoStore,
    ddnsNetwork: NetworkDDNSStore,
    networkLink: NetworkLinkStore,
    addc: ADDCStore,
    ncsi: Ncsi,
    pamOrder: PamOrderStore,
    task: TaskStore,
    nmConfiguration: NodeManagerStore,
    videoLog: VideoLogStore,
    autoVideo: AutoVideoStore,
    preserveConfig: PreserveConfigStore,
    radius: RadiusStore,
    amdRemoteDebug: AmdRemoteDebugStore,
    ipmiEventLog: IPMIEventLogStore,
    gpu: Gpu,
    advancedLog: AdvancedLogSettingsStore,
    fru: FruStore,
    deviceOwnerTransfership: DeviceOwnerTransfershipStore,
    spdm: SpdmStore,
    powerShelf: PowerShelfStore,
    powerEquipment: PowerEquipmentStore,
    kvm1Control: Kvm1ControlStore,
  },
});
