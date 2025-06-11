FROM node:lts-slim

# 必要パッケージのインストール（日本語ロケール含む）
RUN apt update && apt install -y \
    curl locales && \
    echo "ja_JP.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=ja_JP.UTF-8 && \
    rm -rf /var/lib/apt/lists/*

# ロケール設定
ENV LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP:ja \
    LC_ALL=ja_JP.UTF-8

# タイムゾーン設定（日本時間）
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    echo "Asia/Tokyo" > /etc/timezone

# 作業ディレクトリを設定（COPYとの整合性もとれるように）
WORKDIR /workspaces/react_ibr_portal

# ソースコードをコンテナにコピー（CIや移行時用）
COPY . .

# パッケージをインストール
RUN npm install

# ポート指定（Viteのデフォルト）
EXPOSE 5173
