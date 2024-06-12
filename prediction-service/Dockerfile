# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Stage 2: Create the final image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app ./

# Expose the port the app runs on
EXPOSE 4001

# Command to run the app
CMD ["node", "index.js"]

