let config = {
  __DEGUGGING__: true,
  backEndServer: 'http://localhost:3012',
  auth0domain: 'sfgmc.auth0.com',
  auth0clientId: 's81wlD3rI6LHqeNknqfxsbQN0nNnamLT',
  alertD: function(...args) {
    if (this.__DEGUGGING__) {
      args.map(arg => {
        console.log(arg);
      });
    }
  }
};

export default config;
