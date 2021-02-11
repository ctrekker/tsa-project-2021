const Config = {
    backendUrl: 'http://localhost:8000',
};
Config.endpoint = (suffix) => Config.backendUrl + '/api' + suffix;
Config.fetch = (endpoint, opts={
    method: 'GET'
}) => {
    return new Promise((resolve, reject) => {
        fetch(Config.endpoint(endpoint), {
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            },
            ...opts
        }).then(res => res.json())
        .then(resolve)
        .catch(reject);
    });
};

export default Config;