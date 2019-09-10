# Marketing app dashboard
Dashboard to consume from sockets and publish message to a micro service solution.
The application works as a messages dashboard with capability to show the top 5 tags created and an option to show the percentages as graphics. A searching engine allows the user to display their tag on a pie chart format.
The whole applications allows responsive layout.

# How to use
`npm i`

`ojet serve`

## Dependencies
1. [Exposer microservice](https://github.com/annie60/microservice)
2. [Notifications server](https://github.com/annie60/socketio-nodejs)

# Demo
![Creates messages and notifies user for refresh](demo/NewMessage.gif)
![Get notification for new hash tags](demo/NewTag.gif)
![Shows current percentage for tags created](demo/Graphics.gif)
