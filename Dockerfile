FROM node:6.10.3

# Add our user and group first to make sure their IDs get assigned consistently
RUN groupadd -r app && useradd -r -g app app

# Create a directory where the application code should live and set it as the
# current working directory
RUN mkdir -p /usr/src/app/tmp
WORKDIR /usr/src/app

# Only copy the package.json which specifies package dependencies. This is will
# ensure that packages are only re-installed if they are changed.
COPY package.json /usr/src/app/
RUN npm install --production
RUN chown -R app:app /usr/src/app/node_modules

# Copy the application source code and run the optional build step.
COPY ./dist /usr/src/app

# Change the ownership of the application code and switch to the unprivileged user.
# TODO: negate node_modules folder instead of specifying all other app related files
RUN chown -R app:app /usr/src/app/index.js && chown -R app:app /usr/src/app/config.js && chown -R app:app /usr/src/app/app.js && chown -R app:app /usr/src/app/utils && chown -R app:app /usr/src/app/routes && chown -R app:app /usr/src/app/models && chown -R app:app /usr/src/app/controllers
USER app

EXPOSE 3000

CMD [ "node", "index.js" ]
