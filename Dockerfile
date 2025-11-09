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

ARG PORT
ARG SOAP_WSDL_URL
ARG SOAP_USERNAME
ARG SOAP_PASSWORD

ENV PORT=$PORT
ENV SOAP_WSDL_URL=$SOAP_WSDL_URL
ENV SOAP_USERNAME=$SOAP_USERNAME
ENV SOAP_PASSWORD=$SOAP_PASSWORD

EXPOSE $PORT

CMD ["node", "dist/main.js"]
