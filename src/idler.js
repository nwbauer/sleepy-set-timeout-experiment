
module.exports = class Idler {

  constructor(minutes) {
    this.delay = minutes*60*1000;
    this.monitor(10);
  }

  monitor(seconds) {
    this.monitor = setInterval(() => {
      if(this.triggerTime) {
        console.log(`${new Date()} idler timer fires in ${(this.triggerTime-(new Date()))/(60*1000)} minutes`);
      }
    }, seconds*1000);
  }

  start() {
    this.triggerTime = new Date(new Date().getTime() + this.delay);
    console.log(`${new Date()} starting idler`);
    console.log(`${new Date()} idler will fire in ${this.delay/(60*1000)} minutes`);
    console.log('=============');
    this.timeout = setTimeout(() => {
      console.log('=============');
      console.log(`${new Date()} idler timeout fired!`);
      clearInterval(this.monitor);
    }, this.delay);
  }
}
