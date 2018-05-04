'use strict';
var dealer_service = require('../../services/dealer.js');
var async = require('async')
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
        var params = req.body;
        dealer_service.getTrade(params.region, req.params.id, (err, result) => {
            res.status(200);
            res.json(result.rows[0]);
        });

        // dealer_service.getAllDealers((err, data) => {
        //
        //     res.status(200);
        //     res.json(data.rows);
        // });
    }
};
