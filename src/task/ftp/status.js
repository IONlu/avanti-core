import exec from '../../exec.js';

export const run = async () => {
    try {
        await exec('service proftpd status', {}, null, {
            SYSTEMD_PAGER: ''
        });
        return 'Service is running';
    } catch (e) {
        throw new Error('Service is unavailable');
    }
};
