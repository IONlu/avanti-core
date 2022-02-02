#!/usr/bin/node
var axios = require('axios');

async function call () {
    let token = process.env.ACME_TOKEN
    if (token) {
        await axios.get('https://acme.mbox.lu/' + process.env.CERTBOT_DOMAIN + '/' + process.env.CERTBOT_VALIDATION, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((element) => {
            return element
        })
        .catch((err) => {
            return err
        })
        process.exit(0)
    } else {
        throw new Error('ACME TOKEN MISSING')
    }
}

call()
