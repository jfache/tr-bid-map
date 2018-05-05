'use strict';

var mysql = require('mysql')
var tunnel = require('tunnel-ssh');
var mysqlssh = require('mysql-ssh');
var fs = require('fs');

var _client = {
	CA: null,
	US: null
};

module.exports = {
	init: function () {
        // mysqlssh.connect(sshConfig, mysqlCAConfig).then(client => {
        // 	_client["CA"] = client
        // });

        // mysqlssh.connect(sshConfig, mysqlUSConfig).then(client => {
        //     _client["US"] = client
        // });

        _client["US"] = mysql.createPool(mysqlUSProdConfig)
        _client["CA"] = mysql.createPool(mysqlCAProdConfig)
	},
	query: function(query,region, cb) {
	    console.log(query)
        _client[region].query(query, (err, rows, fields) => {
            if (err) {
                console.log(err);
                cb(err, null);
                return;
            }
            var result = {'rows': rows, 'fields': fields}
            cb(null, result);
        })
	},

	quaryWithParams: function(query, param, region, cb) {
		var $this = module.exports;
		$this.query(mysql.format(query, param), region, cb);
	}
}
