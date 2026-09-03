# ============================================================
# Stage 1: Install PHP dependencies with Composer
# ============================================================
FROM composer:2 AS composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader


# ============================================================
# Stage 2: Laravel + Apache
# ============================================================
FROM php:8.4-apache

WORKDIR /var/www/html

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache rewrite
RUN a2enmod rewrite

# Laravel public directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# Configure Apache to use Laravel's public directory
RUN sed -ri \
    -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf

# Copy Composer dependencies
COPY --from=composer /var/www/html/vendor ./vendor

# Copy Laravel application
COPY . .

# Create Laravel required directories
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# Permissions
RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache \
    && chmod -R 775 \
    storage \
    bootstrap/cache

# Expose Apache
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
