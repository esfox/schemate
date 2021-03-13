import knex from 'knex';

export default knex(
  {
    client: 'sqlite',
    connection: {
      filename: './sample.sqlite',
    },
    useNullAsDefault: true,
  });
