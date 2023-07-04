# React Voting App

This is a simple React voting application that interacts with a distributed smart contract on the Sepolia chain using Thirdweb.

## Prerequisites

Before running the application, make sure you have the following prerequisites installed:

- Node.js
- npm (Node Package Manager)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/react-voting-app.git
   ```

2. Install the dependencies:

   ```bash
   cd react-voting-app
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the application.

## Configuration

The application requires you to have the necessary environment variables or configuration files to connect to the Sepolia chain using the ThirdwebProvider component from the `@thirdweb-dev/react` package. Make sure you have set the required environment variables or configuration files to connect to the desired chain.

## Usage

- The application loads the smart contract at the specified address using the useContract hook.
- The contract owner, remaining deadline, and vote results are displayed using the useContractRead hook.
- The startVoting, finalizeVoting, and castVote functions are used to interact with the smart contract using the useContractWrite hook.
- The duration and vote value can be adjusted using input fields, and the respective functions are called to perform contract transactions.

## Contributing

Contributions are welcome! If you find any issues or have improvement suggestions, you can create a new issue or submit a pull request.

## License

This project is licensed under the MIT License.