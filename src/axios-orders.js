import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-3461b.firebaseio.com/'
});

export default instance;
