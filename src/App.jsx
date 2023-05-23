import React from 'react';
import useSWR from 'swr';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import Spinner from './components/Spinner/Spinner';

function App() {
	const [userPosition, setUserPosition] = React.useState({
		latitude: null,
		longitude: null,
	});

	// Status:
	// idle | loading | success | geolocationFetchingError | dataFetchingError
	const [status, setStatus] = React.useState('idle');
	console.log('status: ', status);

	/* Dynamic ENDPOINT */
	const ENDPOINT = `https://api.open-meteo.com/v1/forecast?latitude=${userPosition.latitude}&longitude=${userPosition.longitude}&hourly=temperature_2m&current_weather=true`;
	/* const ENDPOINT = "https://api.open-meteo.com/v1/forecast?latitude=41.37&longitude=2.13&hourly=temperature_2m&current_weather=true"; */

	React.useEffect(() => {
		const successCallback = (position) => {
			const nextUserPosition = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};

			setUserPosition(nextUserPosition);
		};

		const errorCallback = (error) => {
			console.warn(error);
			setStatus('geolocationFetchingError');
		};

		navigator.geolocation.getCurrentPosition(
			successCallback,
			errorCallback,
			{
				timeout: 20000,
			}
		);
	}, []);

	async function fetcher(endpoint) {
		const response = await fetch(endpoint);

		/* console.log("fetch response: ", response); */

		if (!response.ok) {
			setStatus('dataFetchingError');
			throw response;
		}

		const json = await response.json();

		/* console.log("json response: ", json);
    console.log("json: ", json); */

		setStatus('success');

		return json;
	}

	/* const { data, error } = useSWR(ENDPOINT, fetcher); */

	const { data } = useSWR(
		userPosition.latitude ? ENDPOINT : null,
		fetcher
	);

	/* console.log("userPosition.latitude: ", userPosition.latitude);
  console.log("data:", data, "error :", error); */

	return (
		<>
			<p>Current temperature:</p>
			{status === 'idle' && (
				<>
					<br />
					<Spinner />
				</>
			)}
			{status === 'success' &&
				typeof data?.current_weather?.temperature === 'number' && (
					<span className='temperature'>
						{data.current_weather.temperature}°C
					</span>
				)}
			{status === 'geolocationFetchingError' && (
				<ErrorMessage>
					Sorry, the geolocation data could not be retrieved.
					<br /> Please, enable the geolocation and reload the page.
				</ErrorMessage>
			)}
			{status === 'dataFetchingError' && (
				<ErrorMessage>
					Sorry, weather data could not be fetched
				</ErrorMessage>
			)}
		</>
	);
}

export default App;
