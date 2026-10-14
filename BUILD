#!/usr/bin/env bash

GEM_DIR=$PWD
PROJECT_DIR=$PWD

# ARE WE THE GEM PROJECT, OR ARE WE THE DEPENDENCY?
if [ -d "$PWD/node_modules/GEM" ]; then
	GEM_DIR=$PWD/node_modules/GEM
fi

echo "[STARTING] Build program and watch daemon..."
echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
bun \
	run \
	--no-telemetry \
	$GEM_DIR/src/build/daemon.js \
	$PROJECT_DIR \
	$GEM_DIR
