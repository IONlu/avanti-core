#!/usr/bin/node
var axios = require('axios');

async function call () {
    let token = process.env.ACME_TOKEN
    if (token) {
        return axios.get('https://acme.mbox.lu/' + process.env.CERTBOT_DOMAIN + '/' + process.env.CERTBOT_VALIDATION, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((element) => {
            if (element) {
                throw new Error(element.data)
                process.exit(1)
            }
        })
        .catch((err) => {
            process.exit(1)
        })
    } else {
        throw new Error('ACME TOKEN MISSING')
    }
}

call()
