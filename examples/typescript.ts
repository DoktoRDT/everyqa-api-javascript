import { UserEntity, UsersApi } from 'everyqa-client';
import { AxiosResponse } from 'axios';

const API_KEY = 'Bearer tb9vqZwFhpNzjtvRu8PNngkGbaFup4D5cQG8yrH9W7SKUphaDuoBg19oZ1ytYwGW';

const usersApi = new UsersApi({
  apiKey: API_KEY,
});

(async () => {
  // Axios Response with UserEntity in "data" field
  const userRes: AxiosResponse<UserEntity> = await usersApi.getUser();

  const user: UserEntity = userRes.data;

  console.log('User Info: ', user);
})()
  .catch(console.log);
