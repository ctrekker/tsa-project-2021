const Config = {
    backendUrl: 'http://localhost:8000',
};
Config.endpoint = (suffix) => Config.backendUrl + '/api' + suffix


export default Config;