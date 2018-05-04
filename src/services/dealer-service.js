import dealers from '../data/dealers.json';
import trades from '../data/trades.json';
import { findWhere } from 'underscore';

export function getDealerFromTradeId(tradeId) {
    let trade = findWhere(trades, {
        region: 'CA',
        tradeID: tradeId
    });

    if (!trade) {
        return getDefaultDealer();
    }

    return getDealer(trade.dealerID);
}

export function getDealer(dealerId) {
    let dealer = findWhere(dealers, {
        region: 'CA',
        id: dealerId
    });

    if (!dealer) {
        return getDefaultDealer();
    }

    return dealer;
}

export function getDefaultDealer() {
    return {
        name: 'Unknown'
    };
}

export default {
    getDealerFromTradeId,
    getDealer
};
