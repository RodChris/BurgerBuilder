import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-e06fd.firebaseio.com/'
});

export default instance;
