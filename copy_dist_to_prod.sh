#!/bin/bash
mkdir -p prod
cp -R dist/* prod/
cp nodemon.json prod/
cp package.json prod/
cp package-lock.json prod/
cp access.log prod/
cp access_d.log prod/
cp -R -p config prod/
cp -R migrations prod/
cp -R models prod/
cp -R seeders prod/
cp -R uploads prod/
