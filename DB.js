import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

const devOrmConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 8080,
  username: 'chicken_check',
  password: 'lasalle2016',
  database: 'apigame',
};

export default devOrmConfig; 