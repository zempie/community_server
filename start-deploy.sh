#!/bin/bash

git pull && npm run build;
pm2 restart community_server_live;

echo 'Deploy Done'
