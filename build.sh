#!/bin/sh

# Copy neccesary files
mkdir ext
cp -r  ./icons ./js ./background.js ./options.html ./popup.html ./manifest.json ./ext

mkdir build
cd ext 

# Generate Firefox .xpi
7z a -r ../build/firefox.xpi *

# Generate Chrome .crx
7z a -r ../build/chrome.zip *

cd ..
# delete uneccesary files
rm -rf ./ext