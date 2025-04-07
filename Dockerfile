# 1. Use the official Node.js image as base
FROM node:18-alpine AS deps

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# 4. Copy the rest of the app
COPY . .

# 5. Build the Next.js app
ENV NEXT_DISABLE_ESLINT=true
RUN npm run build

# 6. Use a minimal image for serving
FROM node:18-alpine AS runner

# Optional: Add dumb-init for signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production

# 7. Install only production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/public ./public
COPY --from=deps /app/next.config.js ./next.config.js

# 8. Start the app
EXPOSE 3000
CMD ["dumb-init", "npm", "start"]
