FROM node:12

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ENV NODE_ENV=${NODE_ENV}

ENV WEBAPP_BUILD_ENV=${WEBAPP_BUILD_ENV}

ENV WEBAPP_COMPRESSION=${WEBAPP_COMPRESSION}

ENV PORT=${PORT}

WORKDIR /app

COPY . /app

EXPOSE ${PORT}

RUN npm ci

RUN ls

CMD [ "npm", "start" ]
