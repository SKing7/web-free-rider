# 构建阶段
FROM node:18.19.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
WORKDIR /app

ENV NODE_ENV production

FROM node:18.19.0-alpine AS runner 
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 1989
ENV PORT 1989 
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
