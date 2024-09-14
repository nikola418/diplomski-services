#syntax=docker.io/docker/dockerfile:1.7-labs
FROM node:20-alpine AS base
ARG APP_NAME
ENV APP_NAME=${APP_NAME}
WORKDIR /app
RUN corepack enable pnpm && corepack install -g pnpm@latest-9
COPY pnpm-lock.yaml ./
RUN pnpm fetch

FROM base AS development
COPY --exclude=/apps/ ./ ./
COPY ./apps/${APP_NAME} ./apps/${APP_NAME}
RUN pnpm install -r --offline
CMD pnpm run prisma:generate && pnpm run start:dev $APP_NAME


FROM development AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN pnpm run prisma:generate
RUN pnpm run build ${APP_NAME}
RUN pnpm prune --prod
ENV MAIN_FILE ./dist/apps/${APP_NAME}/main
CMD node $MAIN_FILE