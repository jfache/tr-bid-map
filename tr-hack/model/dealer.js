/**
 * activitybuydetails.js
 *
 * Created by kylewbanks on 16-01-20.
 */
'use strict';

/**
 * ActivityBuyDetails Constructor.
 *
 * @param options {Object}
 * @constructor
 */
function Dealer(options) {
    options = options || {};

    this.id = options.id;
    this.lat = options.lat;
    this.long = options.long;
    this.name = options.name;
}

/**
 * @public
 * @type {Dealer}
 */
module.exports = Dealer;
