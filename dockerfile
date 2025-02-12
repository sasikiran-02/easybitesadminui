FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application source code
COPY . .

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Expose the desired port (4201)
EXPOSE 4201

# Start the Angular development server on port 4201, listening on all interfaces
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4201"]
