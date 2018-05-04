'use strict';
var db = require('./database.js');
var moment = require('moment');

/**
 * Operations on /dealer/list
 */
module.exports = {
    init: function(){
        db.init();
    },
    getAllDealers: function(region, cb) {
        let query = 'SELECT "?" as region, id, display_name as name, latitude, longitude FROM dealer WHERE is_active = TRUE';
        db.query(query.replace('?', region), region, cb);
    },

    getTrade: function (region, id, cb) {
        let query = 'SELECT "?" as region, id as tradeID, dealer_id as dealerID, thumbnail_url as url  FROM trade_appraisal WHERE trade_state in (0, 1, 10, 6) AND id = ?';

        db.quaryWithParams(query, [region, id], region, cb);
    },

    getAllTradeId: function (region, cb) {
        let query = 'SELECT "?" as region, id as tradeID, dealer_id as dealerID, thumbnail_url as url  FROM trade_appraisal WHERE trade_state in (0, 1, 10, 6)';

        db.query(query.replace('?', region), region, cb);
    },

    currentStats: function (region, cb) {
        let current = moment().format('YYYY-MM-DD') + ' 05:00:00';

        let query = 'SELECT "?" as region,' +
            '  COUNT(DISTINCT seller) AS sellers,' +
            '  SUM(total_top_bids) AS totalValueBids,' +
            '  SUM(total_bids) AS totalNumberBids,' +
            '  GROUP_CONCAT(unique_bidder SEPARATOR \',\' ) AS bidder ' +
            'FROM (' +
            '  SELECT' +
            '    a.trade_appraisal_id,' +
            '    tr.dealer_id AS seller,' +
            '    GROUP_CONCAT(DISTINCT (us.dealer_id) SEPARATOR \',\') AS unique_bidder,' +
            '    MAX(ab.amount)                                             AS total_top_bids,' +
            '    count(ab.id)                                               AS total_bids' +
            '  FROM' +
            '    auction_bid ab' +
            '    INNER JOIN auction a ON ab.auction_id = a.id' +
            '    INNER JOIN trade_appraisal tr ON tr.id = a.trade_appraisal_id' +
            '    INNER JOIN appuser us ON us.id = ab.bid_by_user_id' +
            '  WHERE ab.bid_time >= \'' + current + '\'' +
            '  GROUP BY ab.auction_id' +
            ') AS tbl;';
        db.query(query.replace('?', region), region, cb);
    }
};