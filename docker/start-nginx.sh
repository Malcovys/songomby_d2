#!/bin/sh
set -eu

API_PROXY_URL=${API_PROXY_URL:-http://api:3000}
sed "s|__API_PROXY_URL__|${API_PROXY_URL}|g" \
  /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"
