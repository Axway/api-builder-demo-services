# See the README.md for usage and configuration info
FROM node:8-alpine
ARG NPM_REGISTRY=https://registry.npmjs.org/
COPY . /app
WORKDIR /app
RUN npm --registry "$NPM_REGISTRY" install --production --no-optional
CMD ["npm", "start"]

