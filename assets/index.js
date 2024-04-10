// map object
const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

	// build leaflet map
	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 11,
		});
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map)
		// create and add geolocation marker
		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},

	// add business markers
}

// get coordinates via geolocation api
async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

// get foursquare businesses
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3+Y1yVP+04gQ0JCMiuNxRgxt778ojryjmQXyyi7UfGz4='
		}
	}
	let limit = 5
	let latitude = myMap.coordinates[0]
	let longitude = myMap.coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${latitude}%2C${longitude}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses}

    function processBusinesses(data) {
        let businesses = data.map((element) => {
            let location = {
                name: element.name,
                lat: element.geocodes.main.latitude,
                long: element.geocodes.main.longitude
            };
            return location
        })
        return businesses
    }






// process foursquare array

// process foursquare array


// event handlers
// window load
window.onload = async () => {
	const coords = await getCoords()
	console.log(coords)
	myMap.coordinates = coords
	myMap.buildMap()
}

// business submit button
// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addmarkers()
})