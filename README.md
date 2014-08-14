ESPot - ElasticSearch Honeypot
==============================
An Elasticsearch honeypot written in NodeJS, to capture every attempts to exploit [CVE-2014-3120].

Prerequisite
============
* NodeJS - v0.10.x
* NodeJS Package Manager - npm v1.4.x

Install
========
Download and extract to /opt/espot, then run followwing command:

    $ cd /opt/espot
    $ npm install
    $ mv config.js-sample config.js
Configure config.js 

    module.exports = {
        default_response: 'default', // default = 1.1.1, available = 0.90.0, 0.90.5, 1.1.1, 1.2.1, 1.2.2, 1.3.1
        logging: {
            sqlite: {
                enable: true,
                dbpath: __dirname + "/logs/attack.db"
            },
            http_push: {
                enable: false,
                url: "http://localhost/path/path?query=string"
            }
        },
        tz: 'GMT+8' // Timezone
    };


Misc
====
###HTTP Push###

ESPot will send post request with following json data to provided url in config.js
    
    {
        payload: <payload>,
        payload_key: <payload key>,
        ip: <ip address>,
        timestamp: <unix timestamp>,
        raw_request: <raw url request>
    }

###Run as deamon###
If you would like to run ESPot as deamon, you will need [forever]

    $ npm install -g forever
    $ forever start app.js

License
========
Source code of ESPot is released under the [General Public License version 3].

[CVE-2014-3120]:http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-3120
[General Public License version 3]:http://www.gnu.org/licenses/gpl-3.0.html
[forever]:https://github.com/nodejitsu/forever