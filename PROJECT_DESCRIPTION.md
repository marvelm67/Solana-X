# Project Description

**Deployed Frontend URL:** [TODO: Link to your deployed frontend]

**Solana Program ID:** `AtuwkBugRrjXebN7fbYJNKD8JhrNQxk1KimRAMsVoF9Y`

## Project Overview

### Description

Solana Twitter is a decentralized social media platform built on the Solana blockchain. This dApp allows users to create, read, update, and delete tweets in a fully decentralized manner. All tweet data is stored on-chain, ensuring transparency, immutability, and censorship resistance. The application provides a Twitter-like experience where users can post short messages (up to 280 characters) with optional topics (up to 50 characters).

The frontend is built with Vue.js 3 and integrates with Solana wallets (Phantom, Solflare) for user authentication and transaction signing. The backend consists of an Anchor program that handles all tweet operations on the Solana blockchain.

### Key Features

- **Decentralized Tweet Creation**: Users can create tweets with content up to 280 characters and optional topics up to 50 characters
- **Tweet Management**: Full CRUD operations - Create, Read, Update, and Delete tweets
- **Wallet Integration**: Support for popular Solana wallets (Phantom, Solflare) with auto-connect functionality
- **Real-time Data**: Fetch and display tweets in real-time from the blockchain
- **User Profiles**: View tweets by specific authors/wallet addresses
- **Topic Filtering**: Browse tweets by specific topics or hashtags
- **Search Functionality**: Search through tweets and filter by various criteria
- **Responsive UI**: Modern, mobile-friendly interface built with Vue.js and Tailwind CSS
- **Pagination**: Efficient loading of tweets with pagination support

### How to Use the dApp

1. **Connect Wallet**

   - Visit the application URL
   - Click the wallet connection button in the sidebar
   - Select your preferred wallet (Phantom or Solflare)
   - Approve the connection request

2. **Create a Tweet**

   - Ensure your wallet is connected
   - In the tweet form at the top of the home page, enter your message (max 280 characters)
   - Optionally add a topic/hashtag (max 50 characters)
   - Click the "Tweet" button
   - Confirm the transaction in your wallet

3. **View Tweets**

   - Navigate to the Home page to see all tweets
   - Use the Topics page to browse tweets by specific topics
   - Visit the Users page to explore tweets by different authors
   - Use the search functionality to find specific content

4. **Manage Your Tweets**
   - Go to your Profile page to see your tweets
   - Click the edit button on any of your tweets to modify content
   - Use the delete button to remove tweets permanently

## Program Architecture

The Solana program is built using the Anchor framework and implements a simple but effective architecture for managing tweet data on-chain.

### PDA Usage

This implementation does **not** use Program Derived Addresses (PDAs). Instead, it uses a simpler approach where each tweet is stored in a separate account with a randomly generated keypair. This design choice was made for simplicity and to avoid the complexity of seed management for PDAs.

**Account Creation Strategy:**

- Each tweet creates a new account with a randomly generated keypair
- The tweet creator pays for the account creation and rent
- Accounts are closed when tweets are deleted, refunding the rent to the author

### Program Instructions

**Instructions Implemented:**

- **send_tweet**: Creates a new tweet account with specified topic and content

  - Validates topic length (≤ 50 characters)
  - Validates content length (≤ 280 characters)
  - Sets author, timestamp, topic, and content
  - Initializes the tweet account

- **update_tweet**: Modifies an existing tweet's topic and content

  - Ensures only the original author can update
  - Validates new topic and content lengths
  - Updates the tweet data in-place

- **delete_tweet**: Removes a tweet and closes the account
  - Ensures only the original author can delete
  - Closes the account and refunds rent to the author
  - Permanently removes the tweet from the blockchain

### Account Structure

```rust
#[account]
pub struct Tweet {
    pub author: Pubkey,        // 32 bytes - Public key of the tweet author
    pub timestamp: i64,        // 8 bytes - Unix timestamp when tweet was created
    pub topic: String,         // Variable - Topic/hashtag (max 50 chars * 4 bytes UTF-8)
    pub content: String,       // Variable - Tweet content (max 280 chars * 4 bytes UTF-8)
}

// Account size calculation:
// - Discriminator: 8 bytes
// - Author: 32 bytes
// - Timestamp: 8 bytes
// - Topic: 4 + (50 * 4) = 204 bytes
// - Content: 4 + (280 * 4) = 1124 bytes
// Total: 1376 bytes per tweet account
```

**Context Structures:**

```rust
#[derive(Accounts)]
pub struct SendTweet<'info> {
    #[account(init, payer = author, space = Tweet::LEN)]
    pub tweet: Account<'info, Tweet>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTweet<'info> {
    #[account(mut, has_one = author)]
    pub tweet: Account<'info, Tweet>,
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteTweet<'info> {
    #[account(mut, has_one = author, close = author)]
    pub tweet: Account<'info, Tweet>,
    pub author: Signer<'info>,
}
```

## Testing

### Test Coverage

The project includes comprehensive tests covering both happy path and edge case scenarios:

**Happy Path Tests:**

- **Send Tweet**: Successfully create a tweet with topic and content
- **Send Tweet Without Topic**: Create a tweet with only content (empty topic)
- **Multiple Authors**: Different users can create tweets independently
- **Fetch All Tweets**: Retrieve all tweets from the program
- **Filter by Author**: Fetch tweets from a specific author
- **Filter by Topic**: Fetch tweets with specific topics
- **Update Tweet**: Successfully modify an existing tweet
- **Delete Tweet**: Successfully remove a tweet and close the account

**Unhappy Path Tests:**

- **Topic Too Long**: Reject tweets with topics exceeding 50 characters
- **Content Too Long**: Reject tweets with content exceeding 280 characters
- **Unauthorized Update**: Prevent users from updating other users' tweets
- **Unauthorized Delete**: Prevent users from deleting other users' tweets

### Running Tests

```bash
# Install dependencies
npm install

# Build the program
anchor build

# Start local validator (in separate terminal)
solana-test-validator

# Deploy program to local network
anchor deploy

# Run all tests
anchor test

# Run tests without local validator (if already running)
anchor test --skip-local-validator
```

### Frontend Testing

```bash
# Navigate to frontend directory
cd app

# Install dependencies
npm install

# Run development server
npm run serve

# Build for production
npm run build

# Run for different networks
npm run serve:devnet  # For devnet
npm run serve:mainnet # For mainnet
```

### Additional Notes for Evaluators

**Architecture Decisions:**

- Used individual accounts instead of PDAs for simplicity and to demonstrate basic Anchor account management
- Implemented client-side pagination and filtering for better user experience
- Used Vue.js 3 Composition API for modern, maintainable frontend code
- Integrated with `solana-wallets-vue` for seamless wallet connectivity

**Key Features to Test:**

1. Wallet connection flow with Phantom/Solflare
2. Tweet creation, editing, and deletion
3. Real-time data fetching and display
4. Topic and author filtering
5. Character limit validation
6. Error handling for network issues

**Known Limitations:**

- No user profile management (uses wallet address as identity)
- No direct messaging or follower system
- No image/media attachment support
- Simple linear timeline (no algorithmic feed)

**Security Considerations:**

- All transactions require wallet signature
- Author verification for update/delete operations
- Input validation for content and topic lengths
- Rent-exempt account management
