FROM node:20-alpine AS base

RUN corepack enable pnpm 
RUN corepack install -g pnpm@latest-9

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG APP_NAME
ENV APP_NAME ${APP_NAME}

WORKDIR /app

COPY pnpm-lock.yaml ./
RUN pnpm fetch

FROM base AS dev
COPY . ./

RUN pnpm install -r --offline

FROM dev AS build
RUN pnpm run prisma:generate
RUN pnpm run build ${APP_NAME}

FROM base AS prod
ENV NODE_ENV production
COPY ./package*.json ./package*.json 
RUN pnpm install -r --offline --prod
COPY --from=build /app/dist/apps/${APP_NAME} ./src

ENV MAIN_FILE "src/main"
CMD node ${MAIN_FILE}