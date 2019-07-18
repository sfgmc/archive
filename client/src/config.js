
let config = {
  __DEGUGGING__: true,
  backEndServer: 'http://localhost:3012',
  alertD: function (...args) {
    if (this.__DEGUGGING__) {
      args.map((arg) => {
        console.log(arg);
      });
    }
  },
}



export default config