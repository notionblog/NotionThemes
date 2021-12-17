#!/bin/sh

# Copy neccesary files
mkdir ext
cp -r ./assets ./icons ./js ./background.js ./options.html ./popup.html ./manifest.json ./ext

cd ext 
# Generate Firefox .xpi
7z a -r build/firefox.xpi *

# Generate Chrome .crx
7z a -r build/chrome.zip *

# delete uneccesary files
mv build ../
rm -rf ../ext