#!/usr/bin/node
var axios = require('axios');

async function call () {
    let token = process.env.ACME_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJob3N0IjoiMTkyLjE2OC4wLjY1IiwidXVpZCI6IjBiYjEzOGExLWM2NGEtNGMxNy1iOGFhLTE5NDcxNjMzMmE5YiJ9.R84GddNJNCbFDrwvqGi0NO7W28q4cnkGGAk5VuGdMdo'
    return axios.get('https://acme.mbox.lu/' + process.env.CERTBOT_DOMAIN + '/' + process.env.CERTBOT_VALIDATION, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((element) => {
        console.log('element', element)
        process.exit(0)
    })
    .catch((err) => {
        process.exit(1)
    })
}

call()
