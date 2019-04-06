# oforce-junior-full-stack-app

Front-end: React<br>
Back-end: Node/PostgreSQL

### Important things to note

postgreSQL server's db name should be 'ron_quotes'.

To setup our db's tables schema, run this command while in the server directory<br>
knex migrate:rollback && knex migrate:latest

I decided to make the users unique based on their IP address, so to test that, we would have to change the IP_address manually within the db, or a VPN would need to be used.
