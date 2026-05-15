FROM php:8.3-apache

# Install system dependencies
RUN apt-get update && \
    apt-get install -y zip && \
    apt-get install -y mariadb-client && \
    apt-get install -y npm && \
    apt-get install -y dos2unix && \
    apt-get autoclean

# Install PHP extensions
RUN docker-php-ext-install \
    bcmath \
    ctype \
    pdo \
    pdo_mysql \
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
