FROM node:20-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
 
# ---
FROM base AS prepare
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
RUN yarn global add turbo@^2.6.1

COPY . .
# Add lockfile and package.json's of isolated subworkspace
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN rm -rf out && turbo prune user --docker
 
# ---
FROM base AS builder
RUN corepack enable pnpm
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN pnpm install
# Build the project
COPY --from=prepare /app/out/full/ .
 
# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
 
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN
 
RUN pnpm turbo build
 
# ---
FROM base AS runner
# Don't run production as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/user/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/user/.next/static ./apps/user/.next/static
 
EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/user/server.js"]
