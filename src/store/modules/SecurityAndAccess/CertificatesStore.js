import api from '@/store/api';
import i18n from '@/i18n';
import UtcDateTimeMixin from '@/components/Mixins/UtcDateTimeMixin';
import store from '@/store/';

export const CERTIFICATE_TYPES = [
  {
    type: 'HTTPS Certificate',
    getLocation: () =>
      '/redfish/v1/Managers/' +
      store.getters['global/managerInstance'] +
      '/NetworkProtocol/HTTPS/Certificates',
    label: i18n.t('pageCertificates.httpsCertificate'),
  },
  {
    type: 'LDAP Certificate',
    getLocation: () => '/redfish/v1/AccountService/LDAP/Certificates',
    label: i18n.t('pageCertificates.ldapCertificate'),
  },
  {
    type: 'TrustStore Certificate',
    getLocation: () =>
      '/redfish/v1/Managers/' +
      store.getters['global/managerInstance'] +
      '/Truststore/Certificates',
    // Web UI will show 'CA Certificate' instead of
    // 'TrustStore Certificate' after user testing revealed
    // the term 'TrustStore Certificate' wasn't recognized/was unfamilar
    label: i18n.t('pageCertificates.caCertificate'),
  },
  {
    type: 'ASD Certificate',
    getLocation: () =>
      '/redfish/v1/Managers/' +
      store.getters['global/managerInstance'] +
      '/Certificates',
    label: i18n.t('pageCertificates.asdCertificate'),
  },
];

const getCertificateProp = (type, prop) => {
  const certificate = CERTIFICATE_TYPES.find(
    (certificate) => certificate.type === type,
  );
  if (!certificate) return null;
  if (prop === 'location' && typeof certificate.getLocation === 'function') {
    return certificate.getLocation();
  }
  return certificate[prop];
};

const CertificatesStore = {
  namespaced: true,
  state: {
    allCertificates: [],
    availableUploadTypes: [],
  },
  getters: {
    allCertificates: (state) => state.allCertificates,
    availableUploadTypes: (state) => state.availableUploadTypes,
  },
  mutations: {
    setCertificates(state, certificates) {
      state.allCertificates = certificates;
    },
    setAvailableUploadTypes(state, availableUploadTypes) {
      state.availableUploadTypes = availableUploadTypes;
    },
  },
  actions: {
    async getCertificates({ commit }) {
      return await api
        .get('/redfish/v1/CertificateService/CertificateLocations')
        .then(
          ({
            data: {
              Links: { Certificates },
            },
          }) => Certificates.map((certificate) => certificate['@odata.id']),
        )
        .then(async (certificateLocations) => {
          // ASD certificate is under the Manager resource
          const asdResult = await this.dispatch(
            'asd/getAsdCertificateLocations',
            null,
            { root: true },
          ).catch(() => {
            return { locations: [], supported: false };
          });

          const allCertificateLocations = [
            ...certificateLocations,
            ...asdResult.locations,
          ];

          const promises = allCertificateLocations.map((location) =>
            api.get(location),
          );
          api.all(promises).then(
            api.spread((...responses) => {
              const certificates = responses.map(({ data }) => {
                const {
                  Name,
                  ValidNotAfter,
                  ValidNotBefore,
                  Issuer = {},
                  Subject = {},
                  Oem = {},
                  SerialNumber,
                  SignatureAlgorithm,
                } = data;
                const validFromObj =
                  UtcDateTimeMixin.methods.createDateWithISOString(
                    ValidNotBefore,
                  );
                const validUntilObj =
                  UtcDateTimeMixin.methods.createDateWithISOString(
                    ValidNotAfter,
                  );
                return {
                  type: Name,
                  location: data['@odata.id'],
                  certificate: getCertificateProp(Name, 'label'),
                  certificateVersion: Oem.Ami?.CertificateVersion,
                  serialNumber: SerialNumber,
                  signatureAlgorithm: SignatureAlgorithm,
                  publicKey: Oem.Ami?.PublicKey,
                  issuedBy: Issuer.CommonName,
                  issuedTo: Subject.CommonName,
                  validFrom: validFromObj,
                  validUntil: validUntilObj,
                  issuedByCity: Issuer.City,
                  issuedByCountry: Issuer.Country,
                  issuedByOrganization: Issuer.Organization,
                  issuedByOrganizationalUnit: Issuer.OrganizationalUnit,
                  issuedByState: Issuer.State,
                  issuedToCity: Subject.City,
                  issuedToCountry: Subject.Country,
                  issuedToOrganization: Subject.Organization,
                  issuedToOrganizationalUnit: Subject.OrganizationalUnit,
                  issuedToState: Subject.State,
                  issuerEmail: Issuer.Email,
                  issuedToEmail: Subject.Email,
                };
              });
              let availableUploadTypes = CERTIFICATE_TYPES.filter(
                ({ type }) =>
                  !certificates
                    .map((certificate) => certificate.type)
                    .includes(type),
              );

              // Remove ASD Certificate from available types if BMC doesn't support ASD
              if (!asdResult.supported) {
                availableUploadTypes = availableUploadTypes.filter(
                  (cert) => cert.type !== 'ASD Certificate',
                );
              }

              // Ensure "CA Certificate" is always included but max 10
              const caCertType = CERTIFICATE_TYPES.find(
                (cert) => cert.type === 'TrustStore Certificate',
              );
              const caCertsOnSystem = certificates.filter(
                (cert) => cert.type === caCertType.type,
              ).length;
              if (
                caCertType &&
                caCertsOnSystem < 10 &&
                !availableUploadTypes.some(
                  (cert) => cert.type === caCertType.type,
                )
              ) {
                availableUploadTypes.push(caCertType);
              }
              commit('setCertificates', certificates);
              commit('setAvailableUploadTypes', availableUploadTypes);
            }),
          );
        });
    },
    async addNewCertificate({ dispatch }, { file, type }) {
      return await api
        .post(getCertificateProp(type, 'location'), file, {
          headers: { 'Content-Type': 'application/x-pem-file' },
        })
        .then(() => dispatch('getCertificates'))
        .then(() =>
          i18n.t('pageCertificates.toast.successAddCertificate', {
            certificate: getCertificateProp(type, 'label'),
          }),
        )
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageCertificates.toast.errorAddCertificate'));
        });
    },
    async replaceCertificate(
      { dispatch },
      { certificateString, location, type },
    ) {
      const countBegin =
        certificateString.match(/-----BEGIN CERTIFICATE/g)?.length ?? 0;
      const data = {};
      data.CertificateString = certificateString;
      data.CertificateType =
        countBegin > 1 && type === 'HTTPS Certificate' ? 'PEMchain' : 'PEM';
      data.CertificateUri = { '@odata.id': location };

      return await api
        .post(
          '/redfish/v1/CertificateService/Actions/CertificateService.ReplaceCertificate',
          data,
        )
        .then(() => dispatch('getCertificates'))
        .then(() =>
          i18n.t('pageCertificates.toast.successReplaceCertificate', {
            certificate: getCertificateProp(type, 'label'),
          }),
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageCertificates.toast.errorReplaceCertificate'),
          );
        });
    },
    async deleteCertificate({ dispatch }, { type, location }) {
      return await api
        .delete(location)
        .then(() => dispatch('getCertificates'))
        .then(() =>
          i18n.t('pageCertificates.toast.successDeleteCertificate', {
            certificate: getCertificateProp(type, 'label'),
          }),
        )
        .catch((error) => {
          console.log(error);
          throw new Error(
            i18n.t('pageCertificates.toast.errorDeleteCertificate'),
          );
        });
    },
    async generateCsr(_, userData) {
      const {
        certificateType,
        country,
        state,
        city,
        companyName,
        companyUnit,
        commonName,
        keyPairAlgorithm,
        keyBitLength,
        keyCurveId,
        challengePassword,
        contactPerson,
        emailAddress,
        alternateName,
      } = userData;
      const data = {};

      data.CertificateCollection = {
        '@odata.id': getCertificateProp(certificateType, 'location'),
      };
      data.Country = country;
      data.State = state;
      data.City = city;
      data.Organization = companyName;
      data.OrganizationalUnit = companyUnit;
      data.CommonName = commonName;
      data.KeyPairAlgorithm = keyPairAlgorithm;
      data.AlternativeNames = alternateName;

      if (keyCurveId) data.KeyCurveId = keyCurveId;
      if (keyBitLength) data.KeyBitLength = keyBitLength;
      if (challengePassword) data.ChallengePassword = challengePassword;
      if (contactPerson) data.ContactPerson = contactPerson;
      if (emailAddress) data.Email = emailAddress;

      return await api
        .post(
          '/redfish/v1/CertificateService/Actions/CertificateService.GenerateCSR',
          data,
        )
        //TODO: Success response also throws error so
        // can't accurately show legitimate error in UI
        .catch((error) => {
          console.log(error);
          throw new Error(i18n.t('pageCertificates.toast.errorGenerateCSR'));
        });
    },
  },
};

export default CertificatesStore;
