#!/bin/sh
echo 'starting nginx...'

# replace static values with environment-variables
if [ -n "$SSP_BACKEND_URL" ]; then
    sed -i "s#http://localhost:8000#$SSP_BACKEND_URL#g" /usr/share/nginx/html/main.*.js
fi
if [ -n "$WZU_BACKEND_URL" ]; then
    sed -i "s#http://localhost:8001#$WZU_BACKEND_URL#g" /usr/share/nginx/html/main.*.js
fi
if [ -n "$SSO_REALM_NAME" ]; then
    sed -i "s#SBB_Public#$SSO_REALM_NAME#g" /usr/share/nginx/html/main.*.js
fi
if [ -n "$SSO_REALM_URL" ]; then
    sed -i "s#https://sso-dev.sbb.ch/auth#$SSO_REALM_URL#g" /usr/share/nginx/html/main.*.js
fi
if [ -n "$SSO_CLIENT_ID" ]; then
    sed -i "s#ea8e101c#$SSO_CLIENT_ID#g" /usr/share/nginx/html/main.*.js
fi
if [ -n "$SSP_FRONTEND_VERSION" ]; then
    sed -i "s#SSP_FRONTEND_VERSION#$SSP_FRONTEND_VERSION#g" /usr/share/nginx/html/main.*.js
fi
if [ -n "$SSP_FRONTEND_GIT_COMMIT" ]; then
    sed -i "s#SSP_FRONTEND_GIT_COMMIT#$SSP_FRONTEND_GIT_COMMIT#g" /usr/share/nginx/html/main.*.js
fi

# start webserver
exec nginx
