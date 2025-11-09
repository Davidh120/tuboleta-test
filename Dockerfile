FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY scripts/ ./scripts/

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build && pnpm run postbuild

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/public ./public

ENV PORT=3000
ENV NODE_ENV=production
ENV SOAP_WSDL_URL=""
ENV SOAP_USERNAME=""
ENV SOAP_PASSWORD=""

EXPOSE $PORT

CMD ["node", "dist/main.js"]
