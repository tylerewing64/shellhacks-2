# YourRightPocket API

YourRightPocket is a web application designed to power a fintech platform that enables users to round up their purchases and donate the spare change to charity. The API provides endpoints for user authentication, transaction management, and integration with financial data providers.

## Purpose

The main goal of this project is to facilitate seamless charitable donations by automating the process of rounding up transactions and distributing the accumulated funds to selected charities. This backend service is intended to be deployed on [Railway](https://railway.app/) for easy scalability and management.

## Tech Stack

- **Node.js**: JavaScript runtime environment for building scalable server-side applications.
- **Express**: Fast, unopinionated web framework for Node.js, used to build the RESTful API.
- **MySQL**: Relational database for storing user data, transactions, and charity information.
- **bcryptjs**: Library for hashing and verifying user passwords securely.
- **jsonwebtoken**: For secure authentication using JWT tokens.
- **Plaid**: Integration with financial institutions to access user transaction data.
- **dotenv**: Loads environment variables from `.env` files for configuration.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.
- **Nodemon** (dev dependency): Automatically restarts the server during development.

## Deployment

- **Railway**: The project is configured for deployment on Railway, with a `Procfile` and `railway.json` for build and deployment settings.

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```
   npm install
   ```
3. **Set up environment variables**
   - Copy `api/env.example` to `.env` and fill in the required values.
4. **Run the server**
   ```
   npm start
   ```
5. **Development mode**
   ```
   npm run dev
   ```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[ISC](LICENSE)
