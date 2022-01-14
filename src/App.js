import * as React from 'react';
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import BatteryCharging80OutlinedIcon from '@mui/icons-material/BatteryCharging80Outlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';

// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage, ref, getMetadata, getBytes } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
	apiKey: 'AIzaSyD4NMROqePBImueKlFD4IVpHjpgCwuq0kY',
	authDomain: 'hypernets-firebase.firebaseapp.com',
	databaseURL: 'https://hypernets-firebase-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: 'hypernets-firebase',
	storageBucket: 'hypernets-firebase.appspot.com',
	messagingSenderId: '178133011553',
	appId: '1:178133011553:web:e7df6f9811ae6f1c0dee20',
	measurementId: 'G-D1MSWHXQVD',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage();

const picSiteRef = ref(storage, 'webcam_site.jpg');
const picSkyRef = ref(storage, 'webcam_sky.jpg');
const dataPowerRef = ref(storage, 'batstat.csv');

export default function App() {
	const [imgSiteInfo, setImgSiteInfo] = useState(null);
	const [imgSkyInfo, setImgSkyInfo] = useState(null);
	const [powerInfo, setPowerInfo] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);

	useEffect(() => {
		getMetadata(picSiteRef)
			.then((metadata) => {
				console.log(metadata);
				setImgSiteInfo({
					url: metadata.customMetadata.mediaLink,
					timeCreated: metadata.timeCreated,
				});
			})
			.catch((error) => {
				console.error(error);
			});

		getMetadata(picSkyRef)
			.then((metadata) => {
				console.log(metadata);
				setImgSkyInfo({
					url: metadata.customMetadata.mediaLink,
					timeCreated: metadata.timeCreated,
				});
			})
			.catch((error) => {
				console.error(error);
			});

		getBytes(dataPowerRef).then(bytes => {
			const lastLine = new TextDecoder("utf-8").decode(bytes).split('\n')[1].split(',');
			/* console.log('lastLine: ', lastLine);
			console.log('Solar Volts: ', lastLine[9]);
			console.log('Battery: ', lastLine[21], '%'); */
			setPowerInfo({
				'solar': lastLine[9],
				'battery': lastLine[21]
			});
		});
		
			
	}, []);

	const sxs = [
		{
			width: '100%',
			// maxHeight: { xs: 233, md: 167 },
			// maxWidth: { xs: 350, md: 250 },
		},
		{},
		{ display: 'none' },
	];

	const sxt = [
		{
			width: '100%',
			// maxHeight: { xs: 233, md: 167 },
			// maxWidth: { xs: 350, md: 250 },
		},
		{
			mb: 2
		},
		{ display: 'none' },
	];

	const siteTime = imgSiteInfo != null ? new Date(imgSiteInfo.timeCreated) : null;
	const skyTime = imgSkyInfo != null ? new Date(imgSkyInfo.timeCreated) : null;

	return (
		<Stack spacing={0} direction="column" justifyContent="center" alignItems="center" sx={{ 'p': 2 }}>
			{imgSiteInfo != null ? (
				<Box
				component="img"
				sx={sxs[selectedImage != 0 ? (selectedImage != null ? 2 : 0) : 1]}
				alt="webcam_site"
				src={imgSiteInfo.url}
				onClick={() => setSelectedImage((prev) => (prev == 0 ? null : 0))}
			/>
			) : null}

			{imgSiteInfo != null ? (
				<Typography sx={sxt[selectedImage === null ? 1 : 2]} alignSelf='flex-end' style={{ fontWeight: 400, fontSize: 14 }} >{siteTime.toLocaleTimeString()} {siteTime.toLocaleDateString()}</Typography>
			) : null}

			{imgSkyInfo != null ? (
				<Box
					component="img"
					sx={sxs[selectedImage != 1 ? (selectedImage != null ? 2 : 0) : 1]}
					alt="webcam_sky"
					src={imgSkyInfo.url}
					onClick={() => setSelectedImage((prev) => (prev == 1 ? null : 1))}
				/>
			) : null}
			
			{imgSkyInfo != null ? (
				<Typography sx={sxt[selectedImage === null ? 1 : 2]} alignSelf='flex-end' style={{ fontWeight: 400, fontSize: 14 }} >{skyTime.toLocaleTimeString()} {skyTime.toLocaleDateString()}</Typography>
			) : null}

			{powerInfo != null ? (
				<div>
				<WbSunnyOutlinedIcon style={{ verticalAlign: '-5px' }} /> <Typography sx={sxs[selectedImage === null ? 1 : 2]} style={{display: 'inline-block' }}>{powerInfo.solar}v</Typography><br/>
				<BatteryCharging80OutlinedIcon style={{ verticalAlign: '-5px' }} /> <Typography sx={sxs[selectedImage === null ? 1 : 2]} style={{display: 'inline-block'}} >{powerInfo.battery}%</Typography>
				</div>
			) : null}
		</Stack>
	);
}
