import dealers from '../data/dealers.json';
import trades from '../data/trades.json';
import { findWhere } from 'underscore';

export function getDealerFromTradeId(tradeId, region = 'CA') {
    let trade = findWhere(trades, {
        region: region,
        tradeID: tradeId
    });

    if (!trade) {
        return getDefaultDealer();
    }

    return getDealer(trade.dealerID);
}

export function getDealer(dealerId, region = 'CA') {
    let dealer = findWhere(dealers, {
        region: region,
        id: dealerId
    });

    if (!dealer) {
        return getDefaultDealer();
    }

    return dealer;
}

function getDefaultDealer() {
    return {
        name: 'Unknown'
    };
}

export default {
    getDealerFromTradeId,
    getDealer
};
