#!/bin/sh -e

export FIREBASE_CONFIG="$(cat .firebase)"

docker run --rm -it -v "${PWD}:/app" -w "/app" -p "3000:3000" --env FIREBASE_CONFIG --entrypoint "/bin/bash" node:lts
