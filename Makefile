.PHONY: help install seed images server debug test coverage clean-coverage new-migration migrate rollback guard-% upgrade-packages

include .env

# Which files to test
file=all

help:
	@echo
	@echo "Please use 'make <target>' where <target> is one of"
	@echo "  server         to start the server"
	@echo "  debug          to start the server in debug mode"
	@echo "  test           to run all tests"
	@echo "  test file=name to run a specific file's tests"
	@echo "  coverage       to generate and review test coverage reports"
	@echo "  install        to install modules and run migrations"
	@echo "  seed           to seed a fresh database with sample data"
	@echo "  images         to sync images to s3"
	@echo

# Install the required NPM modules and run migrations
install:
	@npm update
	@npm install
	@npm run knex -- migrate:latest

# Seed DB with dev character
seed:
ifeq (${MODE},dev)
	@npm run knex -- seed:run
else
	@echo "Cannot be run in production!"
endif

# Sync local images to S3
images:
	@rclone sync img/ s3-images:chatandslash/img --config=rclone.conf

# Run the server!
dev:
ifeq (${MODE},dev)
	@NODE_ENV=development npx nodemon index.js | ./node_modules/.bin/bunyan
else
	@echo "Use PM2 to run in production."
endif

# Debug the server
debug:
ifeq (${MODE},dev)
	@echo "Starting up in debug mode..."
	@NODE_ENV=development node debug --harmony index.js
else
	@echo "Cannot debug in production."
endif

# Run tests
test:
	@NODE_ENV=test npm run knex -- migrate:latest --env test
ifeq (${file},all)
	@NODE_ENV=test jest --forceExit
else
	@NODE_ENV=test jest $(file) --verbose
endif

# Create test coverage report
coverage: clean-coverage
	@NODE_ENV=test jest --forceExit --coverage
	@open coverage/lcov-report/index.html

clean-coverage:
	@rm -rf coverage

# Symlink to slacksimple folder for development
startslacksimpledev:
	@mv node_modules/slacksimple node_modules/slacksimple-old
	@ln -s ../../slacksimple/ node_modules/slacksimple
	@mv .git/hooks/pre-commit .git/hooks/pre-commit.bak
	@cp .pre-commit .git/hooks/pre-commit
	@chmod a+x .git/hooks/pre-commit

# Remove symlink to slacksimple folder
stopslacksimpledev:
	@rm node_modules/slacksimple
	@mv node_modules/slacksimple-old node_modules/slacksimple
	@rm .git/hooks/pre-commit
	@mv .git/hooks/pre-commit.bak .git/hooks/pre-commit

# Add a new migration
create-migration:
ifndef name
	$(error Migration name must be specified)
endif
	@npm run knex -- migrate:make ${name}

# Migrate to latest
migrate:
	@npm run knex -- migrate:latest

# Rollback most recent migration
rollback:
	@npm run knex -- migrate:rollback

# Upgrade all node packages to latest version
upgrade-packages:
	@ncu -u
	@npm install