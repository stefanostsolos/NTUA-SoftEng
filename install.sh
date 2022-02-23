#!/usr/bin/env bash

cd backend
npm install
cd ../cli
npm install
npm install -g
cd ../frontend
npm install
npm run build
cd ../test-cli
npm install
cd ..
