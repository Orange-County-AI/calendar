FROM debian:bookworm-slim

# Install essential packages and Node.js
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        curl \
        wget \
        ca-certificates \
        git \
        build-essential \
        python3 \
        python3-pip \
        unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Install Cloudflare Wrangler CLI
RUN npm install -g wrangler

# Create non-root user
RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# Switch to non-root user
USER node
WORKDIR /workspaces

# Install Bun for the node user
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/home/node/.bun/bin:$PATH"

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]