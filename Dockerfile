FROM node:20-alpine AS base
ARG APP_NAME
ENV APP_NAME ${APP_NAME}
WORKDIR /app
RUN corepack enable pnpm && corepack install -g pnpm@latest-9
COPY pnpm-lock.yaml ./

FROM base AS fetch
RUN pnpm fetch

FROM fetch AS dev
COPY . ./
RUN pnpm install -r --offline


FROM dev AS prod-build
RUN pnpm run prisma:generate
RUN pnpm run build ${APP_NAME}

FROM fetch AS prod-deps
COPY package.json package.json
COPY prisma/schema.prisma prisma/schema.prisma
RUN pnpx prisma generate
RUN pnpm install -r --offline --prod

FROM base AS prod
ENV NODE_ENV production
COPY --from=prod-deps /app/node_modules /app/src/node_modules
COPY --from=prod-build /app/dist/apps/$APP_NAME /app/src
ENV MAIN_FILE src/main
CMD node $MAIN_FILE