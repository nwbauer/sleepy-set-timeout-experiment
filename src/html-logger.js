const $ = require('jquery');

module.exports = class HtmlLogger {

  constructor(elementId) {
    const $el = $(elementId);
    this.list = $('<ul></ul>');
    this.list.appendTo($el);
  }

  log(string) {
    const listItem = $('<li></li>');
    listItem.html(string);
    this.list.append(listItem);
  }

}