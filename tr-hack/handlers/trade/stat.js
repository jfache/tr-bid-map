'use strict';
var dealer_service = require('../../services/dealer.js');
var async = require('async');
var _ = require('underscore');
/**
 * Operations on /dealer/list
 */
module.exports = {
    /**
     * summary: Get all the dealers
     * description:
     * parameters:
     * produces:
     * responses: 200, default
     */
    post: function getDealers(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        //dealer_service.init()
        async.waterfall([
            function(next) {
                dealer_service.currentStats('CA', next);
            },
            function(caData, next) {
                dealer_service.currentStats('US', (err, usData) => {
                    caData.rows.bidder = _.uniq(caData.rows[0].bidder.split(',')).length;
                    usData.rows.bidder = _.uniq(usData.rows[0].bidder.split(',')).length;

                    let result = {
                        sellers: caData.rows[0].sellers + usData.rows[0].sellers,
                        totalValueBids: caData.rows[0].totalValueBids + usData.rows[0].totalValueBids,
                        totalNumberBids: caData.rows[0].totalNumberBids + usData.rows[0].totalNumberBids,
                        bidder: caData.rows[0].bidder.length + usData.rows[0].bidder.length
                    };

                    next(null, result);
                });
            }
        ], function(err, result){
            res.status(200)
            res.json(result);
        });
    }
};
