# FROM harbor.tools.company.com/public-cache/library/node:16-alpine
FROM harbor.tools.company.com/public-cache/library/node:lts-alpine

ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
ENV NO_UPDATE_CHECK=true
ENV NODE_ENV=development

WORKDIR /app
COPY package.json .
#COPY .npmrc ./

# Create .npmrc for NPM configuration
RUN echo "registry=https://repo.tools.company.com/repository/npm-group/" > .npmrc \
    && echo "always-auth=true" >> .npmrc \
    && echo "//repo.tools.company.com/repository/npm-group/:_auth=\${NPM_TOKEN}" >> .npmrc \
    && echo "@gmnsrv:registry=https://repo.tools.company.com/repository/company-npm/" >> .npmrc \
    && echo "//repo.tools.company.com/repository/company-npm/:_auth=\${NPM_TOKEN}" >> .npmrc \
    && cat .npmrc

RUN npm install --legacy-peer-deps
RUN rm -f .npmrc

COPY . .

CMD ["npm", "run", "dev"]