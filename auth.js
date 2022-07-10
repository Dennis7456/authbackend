const jwt = require('jsonwebtoken');

module.exports = async (request, response, next) => {
    try {
        //get auth token from auth header
        const token = request.headers.authorization.split(' ')[1];

        //check if the token matches the supposed origin
        const decodedToken = await jwt.verify(
            token,
            'RANDOM-TOKEN'
            );
        //retrieve user details of the logged in user
        const user = await decodedToken;

        //pass the user to the endpoint
        request.user = user;

        //pass down functionality to the endpoint
        next();

    } catch (error) {
        response.status(401).json({
            error: new Error('Invalid request'),
        });
    }
}