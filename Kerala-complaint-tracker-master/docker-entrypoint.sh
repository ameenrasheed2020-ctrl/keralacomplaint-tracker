#!/bin/sh
set -e

# Write runtime env vars into a JS config file served to the SPA
cat > /usr/share/nginx/html/env-config.js <<EOF
window.__VENGARA_API_KEY = "${VITE_GEMINI_API_KEY:-}";
EOF

# Run the default nginx entrypoint which does envsubst on templates
exec /docker-entrypoint.sh "$@"
