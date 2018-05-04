'use strict';
var dealer_service = require('../../services/dealer.js');
var async = require('async');
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
        async.waterfall([
            function(next) {
                dealer_service.getAllTradeId('CA', next);
            },
            function(result, next) {
                dealer_service.getAllTradeId('US', (err, data) => {
                    next(null, result.rows.concat(data.rows));
                });
            }
        ], function(err, result) {
            res.status(200);
            res.json(result);
        });
    }
};
