#!/bin/bash

(pushd ~/hypernets_tools && python -m hypernets.yocto.relay -s on -n 5; popd)
sleep 60s
ffmpeg -y -i rtsp://installer:xxxxxxx@10.42.0.51:554 -vframes 1 ~/firebase/webcam_site.jpg
node ~/firebase/uploadFile.js ~/firebase/webcam_site.jpg

