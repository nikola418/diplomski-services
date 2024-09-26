FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm && corepack install -g pnpm@latest-9

WORKDIR /usr/src/app

# COPY pnpm-*.yaml package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY prisma ./prisma
RUN pnpm fetch

FROM base AS development
COPY libs ./libs
COPY  tsconfig*.json nest-cli.json ./
ARG APP_NAME
ENV APP_NAME=${APP_NAME}
COPY  apps/${APP_NAME} ./apps/${APP_NAME}
RUN pnpm install -r --prefer-offline
RUN pnpm run prisma:generate


RUN pnpm run build ${APP_NAME}
CMD pnpm run prisma:generate && pnpm run start:dev $APP_NAME


FROM base AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN pnpm install --offline --prod 
RUN pnpx prisma generate
COPY --from=development /usr/src/app/dist ./dist
ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV MAIN_FILE ./dist/apps/${APP_NAME}/main
CMD node ${MAIN_FILE}