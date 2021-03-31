import axios from './axios';

let instance = axios.create();
instance.defaults.baseURL = 'http://127.0.0.1:9999';
// ...

export default instance;