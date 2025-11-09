FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

# Environment variables will be provided at runtime by Render
ENV PORT=3000
ENV NODE_ENV=production

# These will be overridden by Render's environment variables
ENV SOAP_WSDL_URL=""
ENV SOAP_USERNAME=""
ENV SOAP_PASSWORD=""

EXPOSE $PORT

CMD ["node", "dist/main.js"]
