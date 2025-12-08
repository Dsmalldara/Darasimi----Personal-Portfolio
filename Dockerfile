FROM node:20-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build client bundle and CSS with server bundling
RUN BUILD_SERVER=true pnpm run build

# --- Stage 2: Production ---
FROM node:20-alpine AS production

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy built assets
COPY --from=build /app/dist ./dist

# Copy blog content
COPY --from=build /app/content ./content

# Copy static assets
COPY --from=build /app/public ./public
COPY --from=build /app/resume.pdf ./resume.pdf

# Copy config files
COPY --from=build /app/tailwind.config.js ./tailwind.config.js

EXPOSE 3000

ENV NODE_ENV=production

CMD ["pnpm", "start"]
