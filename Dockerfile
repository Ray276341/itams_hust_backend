FROM node:16

WORKDIR /app

# Copy only necessary files for install first to enable layer caching
COPY package*.json ./

# Use legacy-peer-deps to avoid version conflict with @nestjs-modules/mailer
RUN npm install --legacy-peer-deps

# Now copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Run the app
CMD ["node", "dist/main"]
