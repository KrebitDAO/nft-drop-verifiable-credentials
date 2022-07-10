// pages/api/index.js

export default function handler(request, response) {
  response.status(200).json({
    name: 'Test Buddies',
    description:
      'An exclusive NFT collection of really unique hand-drawn buddies. Made by fuano.eth. Just art, no promises ❤️',
    image: 'ipfs://QmaaAa6wVzx5xtenF17qPzs9ERbwchf9zMTPZgjohsGCZ9',
    external_link: 'https://nft.krebit.id/test-buddies',
    seller_fee_basis_points: 1000,
    fee_recipient: '0xD9D96fb150136798861363d8Ad9Fe4033cfC32b3',
  });
}
