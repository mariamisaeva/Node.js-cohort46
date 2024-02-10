
In this exercise, you will build a secure authentication and authorisation system using Node.js and Express.js with four main endpoints: register, login, getProfile, and logout. The system will utilise JWT (JSON Web Tokens) for managing user sessions.

1. Register Endpoint:

    * Implement a POST endpoint /register that allows users to register with a username and password.
    * Validate the request body to ensure it includes a username and password.
    * Hash the user's password using bcrypt before storing it in memory.
    * Return a success message along with the user's ID and username upon successful registration.
