#!/usr/bin/env bash

function PUBLISH::gem-cleanup {
	local DIR=$1
	
	for node in $(echo $1/*); do
		if [ -d $node ]; then
			PUBLISH::gem-cleanup $node
		elif [[ $node == *.gem.d.ts ]] && [ ! -f ${node/.d.ts/.js} ]; then
			echo "[DELETE :: SOURCE D.N.E] $node"
			rm $node
		fi
	done
}

# node_modules/typescript/bin/tsc -p tsconfig.json
echo "[STARTING] Build program and watch daemon..."
echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo "[DELETE] $PWD/@types/"
rm -rf $PWD/@types/
echo "[CRAWLING] $PWD/src"
PUBLISH::gem-cleanup $PWD/src

echo "[DONE] Cleanup"
echo "[READY]"
echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
bun \
	run \
	--no-telemetry \
	--preload \
	$PWD/src/misc/dom.js \
	$PWD/src/build/daemon.js \
	$PWD
