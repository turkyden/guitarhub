# Strapi application

A quick description of your strapi application

``` js
mongo --port 27017

use admin

db.createUser(
  {
    user: "adminUser",
    pwd: "adminPass",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```
