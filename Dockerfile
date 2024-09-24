#syntax=docker.io/docker/dockerfile:1.7-labs
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable pnpm && corepack install -g pnpm@latest-9
COPY pnpm-lock.yaml ./
RUN pnpm fetch
ADD  . ./
RUN pnpm install -r --offline

RUN pnpm run prisma:generate
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

FROM base AS development
CMD pnpm run prisma:generate && pnpm run start:dev $APP_NAME


FROM base AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN pnpm run build ${APP_NAME}
RUN pnpm prune --prod #besk
ENV MAIN_FILE ./dist/apps/${APP_NAME}/main
CMD node $MAIN_FILE