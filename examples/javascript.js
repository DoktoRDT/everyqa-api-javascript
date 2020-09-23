const PublicApi = require('everyqa-api');

const API_KEY = 'Bearer tb9vqZwFhpNzjtvRu8PNngkGbaFup4D5cQG8yrH9W7SKUphaDuoBg19oZ1ytYwGW';

const client = PublicApi.ApiClient.instance

client.authentications['Bearer'].apiKey = API_KEY;

const usersApi = new PublicApi.UsersApi();

(async () => {

  const user = await usersApi.getUser();

  console.log('User Info: ', user);
})()
  .catch(console.log);
