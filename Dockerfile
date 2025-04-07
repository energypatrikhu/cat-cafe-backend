FROM node:lts-alpine

# Set up environment variables
ENV DATABASE_URL="mysql://root:cat-cafe-psw@cat-cafe-db/cat-cafe-db"

# Create working directories
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy backend files and install dependencies
COPY package*.json .
COPY dist dist
COPY prisma/schema.prisma prisma/schema.prisma
COPY srv srv
RUN npm ci --no-audit

COPY docker-entrypoint.sh .
RUN chmod -f +x ./*.sh

# Expose the application port
EXPOSE 3000

ENTRYPOINT [ "/app/docker-entrypoint.sh" ]

# Set the entrypoint
CMD [ "npm", "run", "start:prod" ]