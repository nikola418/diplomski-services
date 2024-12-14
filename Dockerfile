ARG NODE_VERSION="20"
ARG ALPINE_VERSION="3.19"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
ARG APP_NAME
ENV APP_NAME=${APP_NAME}
WORKDIR /usr/src/app

FROM base AS deps 
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY  . .
RUN pnpm install --filter ${APP_NAME} --offline --frozen-lockfile
RUN pnpm run prisma:generate

FROM base AS development
COPY --from=deps /usr/src/app ./
CMD pnpm run start:dev ${APP_NAME}

FROM deps AS build
RUN pnpm run build ${APP_NAME}
# RUN yes | pnpm prune --prod

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}  AS production
ARG NODE_ENV=production
ARG APP_NAME
ENV NODE_ENV=${NODE_ENV}
ENV APP_NAME=${APP_NAME}
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
ENV MAIN_FILE ./dist/apps/${APP_NAME}/main
CMD node ${MAIN_FILE}