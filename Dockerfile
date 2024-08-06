FROM node:20-alpine AS base
RUN corepack enable pnpm 
RUN corepack install -g pnpm@latest-9
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG APP_NAME
ENV APP_NAME ${APP_NAME}

WORKDIR /app

FROM base AS build
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY . ./

RUN pnpm install -r --offline
RUN pnpm run build ${APP_NAME}

FROM base AS prod
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist/apps/${APP_NAME} ./src

ENV MAIN_FILE "src/main"

# CMD pnpm run prisma:generate; node ${MAIN_FILE}