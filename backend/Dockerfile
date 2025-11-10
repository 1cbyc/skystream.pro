FROM php:8.2-fpm
WORKDIR /var/www
RUN apt-get update && apt-get install -y libzip-dev zip unzip git curl
RUN docker-php-ext-install pdo pdo_mysql
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY . /var/www
RUN composer install --no-dev --optimize-autoloader
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
