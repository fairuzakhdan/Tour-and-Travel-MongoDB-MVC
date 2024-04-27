const ErrorHandler = require('./ErrorHandler')
const fetch = require("node-fetch");

const baseUrl = 'https://geocode.search.hereapi.com/v1'
const apiKey = 'Q_Om-AUb2w3N8Du5RAgkNnm_BL_W2UK9q8gjPGt1nDU'

const geocode = async (address) => {
    const url = `${baseUrl}/geocode?q=${address}&limit=1&apiKey=${apiKey}`
    try{
        const response = await fetch(url)
        const data = await response.json()
        return data.items[0]
    }catch(err){
        throw new ErrorHandler(err.message,500)
    }
}

const geometry = async (address) => {
    try{
        const { position } = await geocode(address)
        return {
            type: 'Point',
            coordinates: [position.lng,position.lat]
        }
    }catch(err) {
        throw new ErrorHandler(err.message,500)
    }
}

module.exports =  { geocode,geometry }