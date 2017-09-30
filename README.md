Reddit domains
==================================


Get unique domains of subreddits until a date and sort both top and controversial.

Getting Started
---------------

```sh

# Install dependencies
npm install

# Start development live-reload server
PORT=8080 npm run dev

# Start production server:
PORT=8080 npm start

curl -X GET \
  http://localhost:8080/api/domains/programming
```
Set your settings in the `src/config.json` file.

You can replace `programming` url param by any topics of your choice.


Docker Support
------
```sh
cd reddit-domain

# Build your docker
docker build -t es6/api-service .
#            ^      ^           ^
#          tag  tag name      Dockerfile location

# run your docker
docker run -p 8080:8080 es6/api-service
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port   

```


