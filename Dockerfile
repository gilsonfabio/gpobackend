ARG TZ="America/Sao_Paulo"
ARG VERSION="1.0.0"

FROM node:16 AS runner

ARG TZ
ARG VERSION

LABEL description="Gestor de Competições Esportivas"
LABEL maintainer="Diego Ferreira Chaves <diego.chaves@aparecida.go.gov.br>, Gilson Fabio Silva Modanez <gilson.modanez@aparecida.go.gov.br>"
LABEL version=$VERSION

ENV NODE_ENV production
ENV TZ ${TZ}
ENV DATABASE_URL ""
ENV DATABASE_NAME ""
ENV DATABASE_USER ""
ENV DATABASE_PASSWORD ""
ENV REACT_APP_API_URL "/esp"
ENV REACT_APP_ROUTE_BASENAME "esp"
ENV PORT 3333
ENV EMAIL_HOST ""
ENV EMAIL_PORT ""
ENV EMAIL_USER ""
ENV EMAIL_PASS ""

WORKDIR /app
COPY . .
RUN yarn

EXPOSE ${PORT}

CMD yarn knex migrate:latest --env production && yarn run start
