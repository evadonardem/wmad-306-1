FROM php:8.3-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    dos2unix \
    git \ 
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libonig-dev \
    libpng-dev \
    libwebp-dev \
    libxml2-dev \
    mariadb-client \
    npm \
    unzip \
    zip \
    && apt-get autoclean \
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions required by Laravel
RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    --with-webp

RUN docker-php-ext-install \
    bcmath \
    ctype \
    exif \
    gd \
    mbstring \
    pdo \
    pdo_mysql \
    pcntl \
    sockets

# Install Composer
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install NVM and Node.js LTS
ENV NVM_VERSION=master
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh | bash
RUN nvm install --lts | bash
RUN nvm use --lts | bash

# Set working directory
WORKDIR /var/www/html
