FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

WORKDIR /usr/src/app

COPY pnpm-*.yaml package.json ./
COPY prisma prisma
RUN pnpm fetch

FROM base AS development 
COPY tsconfig*.json nest-cli.json ./
COPY libs libs

ARG APP_NAME
ENV APP_NAME=${APP_NAME}
COPY  apps/${APP_NAME} ./apps/${APP_NAME}
RUN pnpm install --filter ${APP_NAME} --offline
RUN pnpm run prisma:generate

RUN pnpm run build ${APP_NAME}
CMD pnpm run prisma:generate && pnpm run start:dev $APP_NAME


FROM development AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN pnpm prune --prod
RUN pnpm store prune
ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV MAIN_FILE ./dist/apps/${APP_NAME}/main
CMD node ${MAIN_FILE}