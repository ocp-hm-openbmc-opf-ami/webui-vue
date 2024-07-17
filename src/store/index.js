import Vue from 'vue';
import Vuex from 'vuex';

import GlobalStore from './modules/GlobalStore';
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
import PowerSupplyStore from './modules/HardwareStatus/PowerSupplyStore';
import MemoryStore from './modules/HardwareStatus/MemoryStore';
import FanStore from './modules/HardwareStatus/FanStore';
import ChassisStore from './modules/HardwareStatus/ChassisStore';
import BmcStore from './modules/HardwareStatus/BmcStore';
import ProcessorStore from './modules/HardwareStatus/ProcessorStore';
import AssemblyStore from './modules/HardwareStatus/AssemblyStore';
import PostCodeLogsStore from './modules/Logs/PostCodeLogsStore';
import PoliciesStore from './modules/SecurityAndAccess/PoliciesStore';
import FactoryResetStore from './modules/Operations/FactoryResetStore';
import KeyClearStore from './modules/Operations/KeyClearStore';
import FactoryDefaultStore from './modules/Operations/FactoryDefault';
import WebSocketPlugin from './plugins/WebSocketPlugin';
import DateTimeStore from './modules/Settings/DateTimeStore';
import VirtualMediaStore from './modules/Operations/VirtualMediaStore';
import KvmStore from './modules/Operations/KvmStore';
import NicStore from './modules/Nic/Nic';
import NvmeInformationStore from './modules/NvmeInformation/NvmeInformationStore';
import AutonomousCrashDumpStore from './modules/HostSystemDiagnostics/AcdStore';
import AsdStore from './modules/HostSystemDiagnostics/AsdStore';
import OnDemand from './modules/Settings/OnDemand';
import RaidStore from './modules/Raid/RaidStore';
import BackupAndRestore from './modules/Operations/BackupAndRestore';
import SNMPStore from './modules/Settings/SNMPStore';
import FireWallStore from './modules/Settings/FireWallStore';
import CupsStore from './modules/Settings/CupsStore';
import BondStore from './modules/Settings/BondStore';
import LicenseStore from './modules/Settings/LicenseStore';
import SystemInfoStore from './modules/SystemInventory/SystemInventoryStore';
import NetworkDDNSStore from './modules/Settings/NetworkDDNSStore';
import NetworkLinkStore from './modules/Settings/NetworkLinkStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    global: GlobalStore,
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
    powerSupply: PowerSupplyStore,
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
    memory: MemoryStore,
    fan: FanStore,
    chassis: ChassisStore,
    bmc: BmcStore,
    processors: ProcessorStore,
    assemblies: AssemblyStore,
    postCodeLogs: PostCodeLogsStore,
    virtualMedia: VirtualMediaStore,
    kvm: KvmStore,
    policies: PoliciesStore,
    factoryReset: FactoryResetStore,
    keyClear: KeyClearStore,
    FactoryDefault: FactoryDefaultStore,
    nic: NicStore,
    nvme: NvmeInformationStore,
    acd: AutonomousCrashDumpStore,
    asd: AsdStore,
    ondemand: OnDemand,
    raid: RaidStore,
    backupAndRestore: BackupAndRestore,
    snmp: SNMPStore,
    fireWall: FireWallStore,
    cups: CupsStore,
    bond: BondStore,
    license: LicenseStore,
    SystemStore: SystemInfoStore,
    ddnsNetwork: NetworkDDNSStore,
    networkLink: NetworkLinkStore,
  },
  plugins: [WebSocketPlugin],
});
