#!/usr/bin/node
var axios = require('axios');
var dotenv = require('dotenv');

async function call () {
    const target = process.env.AVANTI_PATH || '/opt/avanti';
    // init dotenv
    dotenv.config({
        path: target + '/.env'
    });

    if (!process.env.ACME_SERVER_URL) {
        throw new Error('ACME SERVER URL MISSING IN CONFIG')
    }

    let token = process.env.ACME_TOKEN
    if (token) {
        await axios.get(process.env.ACME_SERVER_URL + '/' + process.env.CERTBOT_DOMAIN + '/' + process.env.CERTBOT_VALIDATION, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((element) => {
            process.exit(0)
            return element
        })
        .catch((err) => {
            process.exit(1)
            return err
        })

    } else {
        throw new Error('ACME TOKEN MISSING')
    }
}

call()
