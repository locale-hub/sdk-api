
################
#    Tests     #
################
FROM node:14-bullseye-slim as Tester

WORKDIR /app
ADD ./configs/ ./configs/
ADD ./controllers/ ./controllers/
ADD ./data/ ./data/
ADD ./tests/ ./tests/
ADD ./logic/ ./logic/
ADD ./types/ ./types/
ADD ./*.ts ./
ADD ./.eslintrc.* ./
ADD ./package*.* ./
ADD ./tsconfig.json ./

# Install dev dependencies
RUN npm install
# Audit dependencies for vulnerabilities
RUN npm audit
# Validate code format
RUN npm run eslint
# Run unit tests
# RUN npm test

##################
#    Builder     #
##################
FROM node:14-bullseye-slim as Builder

WORKDIR /app
COPY --from=Tester /app ./

# Build the app
RUN npm run build

# Install production packages
RUN rm -rf node_modules/ && npm install --production


####################
# Production image #
####################
FROM node:14-bullseye-slim as Runner

WORKDIR /app
COPY --from=Builder /app ./

EXPOSE 3002
CMD ["npm", "start"]
