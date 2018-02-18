
module.exports = class Idler {

  constructor(minutes, log) {
    this.log = log;
    this.delay = minutes*60*1000;
    this.monitor(10);
  }

  monitor(seconds) {
    this.monitor = setInterval(() => {
      if(this.triggerTime) {
        this.log(`${new Date()} idler timer fires in ${(this.triggerTime-(new Date()))/(60*1000)} minutes`);
      }
    }, seconds*1000);
  }

  start() {
    this.startTime = new Date();
    this.triggerTime = new Date(this.startTime.getTime() + this.delay);

    this.log(`${new Date()} starting idler`);
    this.log(`${new Date()} idler will fire in ${this.delay/(60*1000)} minutes`);
    this.log('=============');

    this.timeout = setTimeout(() => {
      this.log('=============');
      this.log(`${new Date()} idler timeout fired! measured delay=${((new Date())-this.startTime)/(60*1000)} minutes`);
      clearInterval(this.monitor);
    }, this.delay);

  }
}
