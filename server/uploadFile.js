#!/usr/bin/env node

const process = require('process');
const path = require('path');

// import { initializeApp } from 'firebase-admin/app';
const { initializeApp, cert } = require("firebase-admin/app");
const { getStorage } = require('firebase-admin/storage');

const {Storage} = require('@google-cloud/storage');

const serviceAccount = require("/home/iafe1/firebase/hypernets-firebase-firebase-adminsdk-30lcj-94c6f1d47d.json");

// console.log(cert);

const bucketName = 'hypernets-firebase.appspot.com';
const filePath = process.argv[2]; //'/home/iafe1/firebase/upload_me.txt';
const destFileName = path.basename(filePath); //'photo.jpg';

initializeApp({
	credential: cert(serviceAccount),
	storageBucket: bucketName
});

const bucket = getStorage().bucket();

// console.log(bucket);


const storage = new Storage();

async function uploadFile() {
  [ffile] = await /*storage.bucket(bucketName)*/bucket.upload(filePath, {
	destination: destFileName,
	public: true
  });

    var metadata = {
        metadata: {
            'mediaLink': ffile.metadata.mediaLink
        }
    }

    try {
        const setFileMetadataResponse = await ffile.setMetadata(metadata);
        console.log('Success');
        console.log(setFileMetadataResponse[0]);
//        return null;
    } catch (error) {
        console.log(error);
  //      return null;
    }

  console.log(`${filePath} uploaded to ${bucketName}`);
  console.log(ffile.metadata.mediaLink);
//  console.log(JSON.stringify(ffile));
}

uploadFile().catch(console.error);

