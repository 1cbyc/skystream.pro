# Use the official Node.js 18 Alpine image as a base.
# Alpine Linux is a lightweight distribution, resulting in a smaller image size.
FROM node:18-alpine

# Set the working directory inside the container.
# All subsequent commands will be run from this directory.
WORKDIR /app

# Create a dedicated, non-root user and group to run the application.
# Running as a non-root user is a security best practice.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package.json and package-lock.json to the working directory.
# By copying these first, we can leverage Docker's layer caching.
# The `npm install` step will only be re-run if these files change.
COPY package*.json ./

# Install project dependencies.
# Using --ci is recommended for continuous integration environments for faster,
# more reliable builds, but `install` is fine for development.
RUN npm install

# Change the ownership of the files to the non-root user.
# This ensures that the application runs with the correct permissions.
RUN chown -R appuser:appgroup /app

# Switch to the non-root user.
USER appuser

# Copy the rest of the application source code into the container.
# The volume mount in docker-compose.yml will override this during development,
# but it's good practice to include it for building the image independently.
COPY . .

# Expose port 3000, which is the default port for the Next.js development server.
EXPOSE 3000

# The command that will be executed when the container starts.
# This runs the Next.js development server.
# The host `0.0.0.0` is necessary to make the server accessible from outside the container.
CMD ["npm", "run", "dev"]
