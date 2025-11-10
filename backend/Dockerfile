# Use official PHP 8.2 FPM image as a base
# This provides a lean environment with PHP-FPM installed.
FROM php:8.2-fpm

# Set the working directory inside the container
WORKDIR /var/www/html

# Install system-level dependencies required by Laravel and common PHP extensions.
# - git, curl, zip, unzip are for managing packages and files.
# - lib*-dev packages are for compiling PHP extensions.
# - build-essential provides tools for compiling.
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install the PHP extensions most commonly used by Laravel.
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer (PHP dependency manager) globally.
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Create a dedicated, non-root user and group to run the application.
# Running as a non-root user is a security best practice.
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www

# Switch to the non-root user.
USER www

# Copy the composer files from the host to the container.
# By copying these first, Docker can cache the dependencies layer.
COPY --chown=www:www composer.json composer.lock ./

# Install Composer dependencies.
# --prefer-dist fetches zipped archives, which is faster.
# --no-progress reduces verbosity.
# This will install both require and require-dev packages.
RUN composer install --prefer-dist --no-progress

# Copy the rest of the application source code into the container.
COPY --chown=www:www . .

# Expose port 8000, which is the default port for the Laravel development server.
EXPOSE 8000

# The command that will be executed when the container starts.
# This runs the built-in Laravel development server.
# The host `0.0.0.0` is necessary to make the server accessible from outside the container.
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
