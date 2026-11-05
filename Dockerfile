# Use a lightweight Node.js 20 image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first so Docker can cache dependency installation
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy the application source code
COPY . .

# Express listens on port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
