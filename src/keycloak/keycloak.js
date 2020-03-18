import Keycloak from 'keycloak-js';

const optionsDefaults = {
  config: {
    realm: 'SBB_Public',
    url: 'https://sso-dev.sbb.ch/auth',
    clientId: 'ea8e101c'
  },
  init: {
    onLoad: 'check-sso'
  },
  idpHint: 'adfs_sbb_prod'
}

export default {
  install(Vue, opts) {
    const options = {...optionsDefaults, ...opts};
    const keycloak = Keycloak(options.config);

    keycloak.onAuthRefreshSuccess = function() {
      options.onTokenUpdated(keycloak);
    }

    keycloak.onAuthSuccess = function() { 
      // renew token if it's about to expire within 60 seconds
      setInterval(() => keycloak.updateToken(60).error(() => {
          // hide app maybe?
          keycloak.clearToken()
      }), 10000); // run check every 10 seconds
    }

    keycloak.init({ onLoad: 'check-sso' }).success((authenticated) => {
      if (authenticated) {
          options.onTokenUpdated(keycloak);
          options.onReady();
      } else {
          keycloak.login({
              idpHint: 'adfs_sbb_prod'
          })
      }
    }).error(() => {
      // what a shame
    });

  }
}