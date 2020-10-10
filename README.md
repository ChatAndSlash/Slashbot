# ChatAndSlash - Slashbot

[![DeepScan Grade](https://deepscan.io/api/projects/944/branches/1902/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=944&bid=1902)

Gameplay service for Chat & Slash.  Reads in events from RabbitMQ, performs gameplay actions indicated, then sends the results back out through RabbitMQ.

This code is provided under the MIT license, and no support will be provided.  Feel free to fork it and modify as you please, just know that I likely will not be available to answer any questions about it.

If you do end up doing something interesting with this code, a link back would be appreciated, but is not required.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Ensure you have at least at least the following versions of the following programs:
  * Node.js v8.9.1+
  * MySQL 5.7+
  * RabbitMQ 3.6.14+
  * PHP 7.1+
* Create a Slack development app, copying settings from other development apps.
* Make sure a copy of Chatterbox is running with development app settings.
* Customize your .env file with the appropriate connection strings, etc.

### Installing

Run `make install` from the project folder, then probably `make seed` if you're Dan.

Run `make dev` to start the service in development mode.  You should be able to issue commands from your Slack development team/channel (`/look` is a great test command).

### ESLint

Eslint might barf on you.  Make sure it's installed globally, then make sure you've also installed the following packages globally:

- eslint-plugin-import
- eslint-import-resolver-alias

## Running tests

To test all files, run `make test`.  To test a single file, run `make test file=FILENAME`.

## Deployment

Use DM to deploy to live servers.  See that project's README.  NOTE: DM is not yet publicly available.

## Built With

* [Slacksimple](https://github.com/DanHulton/slackwrapper) - A simple Slack API wrapper with attachment-formatting utilities.
* [i18n-node](https://github.com/mashpie/i18n-node) - Simple internationalization library.
* [node-mysql2](https://github.com/sidorares/node-mysql2) - Promise-compatible MySQL library.
* [Jest](http://facebook.github.io/jest/docs/getting-started.html) - Testing library from Facebook.
* [Mixwith](https://github.com/DanHulton/mixwith.js) - Multiple inheritance library.
* [amqp.node](https://github.com/squaremo/amqp.node) - AMQP library for interfacing with RabbitMQ.
* [dotenv](https://github.com/motdotla/dotenv) - Load environment variables from a .env file.
* [Hashids](http://hashids.org/) - Generates unique IDS for processing payments.

## Authors

[Dan Hulton](http://www.danhulton.com)