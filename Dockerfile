FROM node:14.15-alpine
ARG NPM_TOKEN
WORKDIR /app/zempie
COPY . .
RUN echo //npm.pkg.github.com/:_authToken=$NPM_TOKEN >> .npmrc
RUN yarn
RUN yarn build
RUN yarn install --production
FROM node:14.15-alpine
WORKDIR /app
COPY --from=0 /app/zempie/dist ./dist
COPY --from=0 /app/zempie/package.json .
COPY --from=0 /app/zempie/node_modules ./node_modules
COPY --from=0 /app/zempie/firebase-authentication-zempie.json .
EXPOSE 5000
CMD ["yarn", "start:prod"]