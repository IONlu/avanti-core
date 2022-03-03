const whois = require('whois-json');
module.exports = (domain) => {
    return callWhois(domain)
}

async function callWhois (domain) {
    try {
        return new Promise((resolve, reject) => {
            return getWhois(domain).then((element) => {
                resolve(element)
            })
            .catch((err) => {
                reject(err)
            })
        })

    } catch (err) {
        return err
    }
}

async function getWhois (domain) {
    try {
        var results = await whois(domain)
        return new Promise((resolve, reject) => {
            let stringifiedResult = JSON.stringify(results, null, 2)
            stringifiedResult = JSON.parse(stringifiedResult)

            if (stringifiedResult && (stringifiedResult.domain || stringifiedResult.domainname || stringifiedResult.domainName)) {
                resolve(stringifiedResult)
            } else {
                reject({
                    status: 'success',
                    message: 'Domain entry doesnt exist'
                })
            }
        })
    } catch (err) {
        return new Promise((resolve, reject) => {
            let error = err
            if (error) {
                if (error.errno === 'ECONNRESET') {
                    reject({
                        status: 'error',
                        message: 'Connection has been reset'
                    })
                } else {
                    reject({
                        status: 'error',
                        message: 'Couldnt get Whois'
                    })
                }
            }
        })
    }
}
