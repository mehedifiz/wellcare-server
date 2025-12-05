#!/user/bin/env bash
# exit on error

set -o errexit

pnpm install
pnpm run build
