#!/usr/bin/env bash

GEM_DIR=${1:-$PWD}
PROJECT_DIR=${2:-$PWD}

echo "[STARTING] Build program and watch daemon..."
echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
bun \
	run \
	--no-telemetry \
	$GEM_DIR/src/build/daemon.js \
	$PROJECT_DIR \
	$GEM_DIR
