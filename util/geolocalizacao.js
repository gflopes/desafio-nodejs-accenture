const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBkkN9u_ANzi4EjbXZdUWhENZinNogMXlo',
    Promise: Promise
})

async function get(req) {
    return new Promise(resolve => {
        let geolocalizacao

        // console.log("req: " + JSON.stringify(req.cep))

        googleMapsClient.geocode({
                address: JSON.stringify(req.cep)
            })
            .asPromise()
            .then((response) => {
                // console.log("location: " + JSON.stringify(response.json.results[0].geometry.location))
                // console.log("location_type: " + response.json.results[0].geometry.location_type)

                const location_type = response.json.results[0].geometry.location_type
                const latitude = JSON.stringify(response.json.results[0].geometry.location.lat)
                const longitude = JSON.stringify(response.json.results[0].geometry.location.lng)

                geolocalizacao = {
                    type: location_type,
                    coordinates: [
                        latitude,
                        longitude
                    ]
                }
                // console.log("geolocalizacao: " + JSON.stringify(geolocalizacao))

                resolve(JSON.stringify(geolocalizacao))
            })
            .catch((err) => {
                console.log(err)
                resolve(err)
            })
    })
}

module.exports = {
    get
}