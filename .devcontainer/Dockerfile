FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# aws-cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install

# cdk-cli
RUN npm install -g aws-cdk