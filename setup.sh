#!/bin/sh

if hash yarn 2>/dev/null; then
  yarn
else
  npm install
fi

# symlink hooks
HOOK_DIR=$(git rev-parse --show-toplevel)/.git/hooks
ln -s -f ../../scripts/pre-commit $HOOK_DIR/pre-commit
