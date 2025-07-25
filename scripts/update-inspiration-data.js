// Script to update inspiration data with local images and static metadata
const fs = require('fs');
const path = require('path');

// Updated collections data with local images and static metadata
const updatedCollections = `export interface InspirationNft {
  tokenId: string;
  name: string;
  image: string;
  description?: string;
  rarity?: string;
  lastSale?: string;
  // Static metadata (always available)
  staticMetadata: {
    description: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

export interface InspirationCollection {
  name: string;
  description: string;
  contractAddress: string;
  // Static data (always available)
  totalSupply: string;
  chain: 'ethereum' | 'polygon' | 'base';
  // Dynamic data (fetched when wallet connected)
  floorPrice?: string;
  nfts: InspirationNft[];
}

export const inspirationCollections: InspirationCollection[] = [
  {
    name: "Bored Ape Yacht Club",
    description: "A collection of 10,000 unique Bored Ape NFTs - unique digital collectibles living on the Ethereum blockchain.",
    contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "1",
        name: "Bored Ape #1",
        image: "/inspiration-nfts/bayc/1.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "Bored Ape #1 is one of the original and most iconic apes in the BAYC collection.",
          attributes: [
            { trait_type: "Background", value: "Purple" },
            { trait_type: "Fur", value: "Brown" },
            { trait_type: "Eyes", value: "Sleepy" },
            { trait_type: "Mouth", value: "Grin" }
          ]
        }
      },
      {
        tokenId: "2087",
        name: "Bored Ape #2087",
        image: "/inspiration-nfts/bayc/2087.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A rare Bored Ape with unique traits and high desirability.",
          attributes: [
            { trait_type: "Background", value: "Blue" },
            { trait_type: "Fur", value: "Golden Brown" },
            { trait_type: "Eyes", value: "Bored" },
            { trait_type: "Hat", value: "Party Hat" }
          ]
        }
      },
      {
        tokenId: "8817",
        name: "Bored Ape #8817",
        image: "/inspiration-nfts/bayc/8817.svg",
        rarity: "Ultra Rare",
        staticMetadata: {
          description: "One of the most valuable BAYC apes with extremely rare traits.",
          attributes: [
            { trait_type: "Background", value: "Gold" },
            { trait_type: "Fur", value: "Solid Gold" },
            { trait_type: "Eyes", value: "Laser Eyes" },
            { trait_type: "Mouth", value: "Gold Grill" }
          ]
        }
      },
      {
        tokenId: "232",
        name: "Bored Ape #232",
        image: "/inspiration-nfts/bayc/232.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A well-known ape in the BAYC community with distinctive features.",
          attributes: [
            { trait_type: "Background", value: "Orange" },
            { trait_type: "Fur", value: "Dark Brown" },
            { trait_type: "Eyes", value: "Crazy" }
          ]
        }
      },
      {
        tokenId: "5809",
        name: "Bored Ape #5809",
        image: "/inspiration-nfts/bayc/5809.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A classic Bored Ape representing the essence of the collection.",
          attributes: [
            { trait_type: "Background", value: "Gray" },
            { trait_type: "Fur", value: "Brown" },
            { trait_type: "Eyes", value: "Bored" }
          ]
        }
      }
    ]
  },
  {
    name: "Pudgy Penguins",
    description: "A collection of 8,888 cute and cuddly penguins sliding around on the Ethereum blockchain.",
    contractAddress: "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8",
    totalSupply: "8,888",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "6873",
        name: "Pudgy Penguin #6873",
        image: "/inspiration-nfts/pudgy-penguins/6873.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "A legendary Pudgy Penguin with rare traits.",
          attributes: [
            { trait_type: "Background", value: "Ice Blue" },
            { trait_type: "Body", value: "Normal" },
            { trait_type: "Face", value: "Winking" }
          ]
        }
      },
      {
        tokenId: "1",
        name: "Pudgy Penguin #1",
        image: "/inspiration-nfts/pudgy-penguins/1.svg",
        rarity: "Ultra Rare",
        staticMetadata: {
          description: "The first Pudgy Penguin, a cornerstone of the collection.",
          attributes: [
            { trait_type: "Background", value: "Blue" },
            { trait_type: "Body", value: "Normal" },
            { trait_type: "Face", value: "Normal" }
          ]
        }
      },
      {
        tokenId: "8888",
        name: "Pudgy Penguin #8888",
        image: "/inspiration-nfts/pudgy-penguins/8888.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "The last Pudgy Penguin, highly sought after for its significance.",
          attributes: [
            { trait_type: "Background", value: "Rainbow" },
            { trait_type: "Body", value: "Gold" },
            { trait_type: "Face", value: "Cool" }
          ]
        }
      },
      {
        tokenId: "1234",
        name: "Pudgy Penguin #1234",
        image: "/inspiration-nfts/pudgy-penguins/1234.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A memorable number in the Pudgy Penguins collection.",
          attributes: [
            { trait_type: "Background", value: "Pink" },
            { trait_type: "Body", value: "Normal" }
          ]
        }
      },
      {
        tokenId: "5555",
        name: "Pudgy Penguin #5555",
        image: "/inspiration-nfts/pudgy-penguins/5555.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A classic Pudgy Penguin with endearing characteristics.",
          attributes: [
            { trait_type: "Background", value: "White" },
            { trait_type: "Body", value: "Normal" }
          ]
        }
      }
    ]
  },
  {
    name: "Doodles",
    description: "A collection of 10,000 unique Doodles NFTs with hundreds of exciting visual traits designed by Burnt Toast.",
    contractAddress: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "6914",
        name: "Doodle #6914",
        image: "/inspiration-nfts/doodles/6914.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "A legendary Doodle with incredibly rare traits.",
          attributes: [
            { trait_type: "Background", value: "Gradient" },
            { trait_type: "Body", value: "Rainbow" },
            { trait_type: "Head", value: "Alien" }
          ]
        }
      },
      {
        tokenId: "1",
        name: "Doodle #1",
        image: "/inspiration-nfts/doodles/1.svg",
        rarity: "Ultra Rare",
        staticMetadata: {
          description: "The genesis Doodle, representing the beginning of the collection.",
          attributes: [
            { trait_type: "Background", value: "Pink" },
            { trait_type: "Body", value: "Peach" },
            { trait_type: "Hair", value: "Brown Messy" }
          ]
        }
      },
      {
        tokenId: "5000",
        name: "Doodle #5000",
        image: "/inspiration-nfts/doodles/5000.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A milestone Doodle marking the halfway point of the collection.",
          attributes: [
            { trait_type: "Background", value: "Blue" },
            { trait_type: "Body", value: "Yellow" }
          ]
        }
      },
      {
        tokenId: "2468",
        name: "Doodle #2468",
        image: "/inspiration-nfts/doodles/2468.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A charming Doodle with classic features.",
          attributes: [
            { trait_type: "Background", value: "Green" },
            { trait_type: "Body", value: "Blue" }
          ]
        }
      },
      {
        tokenId: "7777",
        name: "Doodle #7777",
        image: "/inspiration-nfts/doodles/7777.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A lucky number Doodle with appealing traits.",
          attributes: [
            { trait_type: "Background", value: "Purple" },
            { trait_type: "Body", value: "Orange" }
          ]
        }
      }
    ]
  },
  {
    name: "CryptoPunks",
    description: "10,000 unique collectible characters with proof of ownership stored on the Ethereum blockchain.",
    contractAddress: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "7523",
        name: "CryptoPunk #7523",
        image: "/inspiration-nfts/cryptopunks/7523.svg",
        rarity: "Alien",
        staticMetadata: {
          description: "One of only 9 Alien CryptoPunks, extremely rare and valuable.",
          attributes: [
            { trait_type: "Type", value: "Alien" },
            { trait_type: "Accessory", value: "Earring" },
            { trait_type: "Hair", value: "Knitted Cap" }
          ]
        }
      },
      {
        tokenId: "5822",
        name: "CryptoPunk #5822",
        image: "/inspiration-nfts/cryptopunks/5822.svg",
        rarity: "Alien",
        staticMetadata: {
          description: "Another extremely rare Alien CryptoPunk.",
          attributes: [
            { trait_type: "Type", value: "Alien" },
            { trait_type: "Accessory", value: "Bandana" }
          ]
        }
      },
      {
        tokenId: "1",
        name: "CryptoPunk #1",
        image: "/inspiration-nfts/cryptopunks/1.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "The first CryptoPunk, a historic piece of NFT history.",
          attributes: [
            { trait_type: "Type", value: "Male" },
            { trait_type: "Accessory", value: "Smile" }
          ]
        }
      },
      {
        tokenId: "8348",
        name: "CryptoPunk #8348",
        image: "/inspiration-nfts/cryptopunks/8348.svg",
        rarity: "Zombie",
        staticMetadata: {
          description: "One of only 88 Zombie CryptoPunks.",
          attributes: [
            { trait_type: "Type", value: "Zombie" },
            { trait_type: "Hair", value: "Crazy Hair" }
          ]
        }
      },
      {
        tokenId: "4156",
        name: "CryptoPunk #4156",
        image: "/inspiration-nfts/cryptopunks/4156.svg",
        rarity: "Ape",
        staticMetadata: {
          description: "One of only 24 Ape CryptoPunks.",
          attributes: [
            { trait_type: "Type", value: "Ape" },
            { trait_type: "Accessory", value: "Bandana" }
          ]
        }
      }
    ]
  },
  {
    name: "LilPudgys",
    description: "A collection of 22,222 randomly generated NFTs minted on Ethereum. The first 8888 Lil Pudgys were reserved for Pudgy Penguin holders.",
    contractAddress: "0x524cab2ec69124574082676e6f654a18df49a048",
    totalSupply: "22,222",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "1",
        name: "Lil Pudgy #1",
        image: "/inspiration-nfts/lilpudgys/1.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "The genesis Lil Pudgy with exceptional rarity.",
          attributes: [
            { trait_type: "Background", value: "Rainbow" },
            { trait_type: "Body", value: "Pink" },
            { trait_type: "Face", value: "Winking" }
          ]
        }
      },
      {
        tokenId: "2500",
        name: "Lil Pudgy #2500",
        image: "/inspiration-nfts/lilpudgys/2500.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A rare Lil Pudgy with unique traits.",
          attributes: [
            { trait_type: "Background", value: "Blue" },
            { trait_type: "Body", value: "Purple" },
            { trait_type: "Hat", value: "Beanie" }
          ]
        }
      },
      {
        tokenId: "5000",
        name: "Lil Pudgy #5000",
        image: "/inspiration-nfts/lilpudgys/5000.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A milestone Lil Pudgy in the collection.",
          attributes: [
            { trait_type: "Background", value: "Green" },
            { trait_type: "Body", value: "Normal" }
          ]
        }
      },
      {
        tokenId: "7500",
        name: "Lil Pudgy #7500",
        image: "/inspiration-nfts/lilpudgys/7500.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A classic Lil Pudgy with standard features.",
          attributes: [
            { trait_type: "Background", value: "Yellow" },
            { trait_type: "Body", value: "Blue" }
          ]
        }
      },
      {
        tokenId: "10000",
        name: "Lil Pudgy #10000",
        image: "/inspiration-nfts/lilpudgys/10000.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A milestone Lil Pudgy marking 10,000.",
          attributes: [
            { trait_type: "Background", value: "Gold" },
            { trait_type: "Body", value: "Golden" }
          ]
        }
      }
    ]
  },
  {
    name: "Opepen Edition",
    description: "A collection of 16,000 ERC-721 NFTs with dynamic reveals and community-driven metadata changes by Jack Butcher.",
    contractAddress: "0x6339e5e072086621540d0362c4e3cea0d643e114",
    totalSupply: "16,000",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "1",
        name: "Opepen #1",
        image: "/inspiration-nfts/opepen-edition/1.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "The genesis Opepen with unique geometric traits.",
          attributes: [
            { trait_type: "Set", value: "Genesis" },
            { trait_type: "Edition Size", value: "1 of 1" },
            { trait_type: "Shape", value: "Circle" }
          ]
        }
      },
      {
        tokenId: "100",
        name: "Opepen #100",
        image: "/inspiration-nfts/opepen-edition/100.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "An early Opepen with distinct geometric patterns.",
          attributes: [
            { trait_type: "Set", value: "Early" },
            { trait_type: "Edition Size", value: "1 of 80" },
            { trait_type: "Shape", value: "Triangle" }
          ]
        }
      },
      {
        tokenId: "500",
        name: "Opepen #500",
        image: "/inspiration-nfts/opepen-edition/500.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A community Opepen with evolving metadata.",
          attributes: [
            { trait_type: "Set", value: "Community" },
            { trait_type: "Edition Size", value: "1 of 200" },
            { trait_type: "Shape", value: "Square" }
          ]
        }
      },
      {
        tokenId: "1000",
        name: "Opepen #1000",
        image: "/inspiration-nfts/opepen-edition/1000.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A milestone Opepen in the collection.",
          attributes: [
            { trait_type: "Set", value: "Milestone" },
            { trait_type: "Edition Size", value: "1 of 160" },
            { trait_type: "Shape", value: "Diamond" }
          ]
        }
      },
      {
        tokenId: "1500",
        name: "Opepen #1500",
        image: "/inspiration-nfts/opepen-edition/1500.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A mid-collection Opepen with dynamic traits.",
          attributes: [
            { trait_type: "Set", value: "Dynamic" },
            { trait_type: "Edition Size", value: "1 of 40" },
            { trait_type: "Shape", value: "Pentagon" }
          ]
        }
      }
    ]
  },
  {
    name: "Cool Cats",
    description: "A collection of 9,999 randomly generated and stylistically curated NFTs that exist on the Ethereum Blockchain.",
    contractAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
    totalSupply: "9,999",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "1",
        name: "Cool Cat #1",
        image: "/inspiration-nfts/cool-cats/1.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "The genesis Cool Cat with legendary traits.",
          attributes: [
            { trait_type: "Body", value: "Blue Cat" },
            { trait_type: "Hat", value: "Crown" },
            { trait_type: "Face", value: "Cool" }
          ]
        }
      },
      {
        tokenId: "1000",
        name: "Cool Cat #1000",
        image: "/inspiration-nfts/cool-cats/1000.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A milestone Cool Cat with rare features.",
          attributes: [
            { trait_type: "Body", value: "Orange Cat" },
            { trait_type: "Shirt", value: "Hoodie" },
            { trait_type: "Face", value: "Sunglasses" }
          ]
        }
      },
      {
        tokenId: "2000",
        name: "Cool Cat #2000",
        image: "/inspiration-nfts/cool-cats/2000.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A classic Cool Cat with standard traits.",
          attributes: [
            { trait_type: "Body", value: "Gray Cat" },
            { trait_type: "Shirt", value: "T-Shirt" },
            { trait_type: "Face", value: "Normal" }
          ]
        }
      },
      {
        tokenId: "5000",
        name: "Cool Cat #5000",
        image: "/inspiration-nfts/cool-cats/5000.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A mid-collection Cool Cat.",
          attributes: [
            { trait_type: "Body", value: "Purple Cat" },
            { trait_type: "Shirt", value: "Tank Top" }
          ]
        }
      },
      {
        tokenId: "9000",
        name: "Cool Cat #9000",
        image: "/inspiration-nfts/cool-cats/9000.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A late-collection Cool Cat with unique style.",
          attributes: [
            { trait_type: "Body", value: "Rainbow Cat" },
            { trait_type: "Shirt", value: "Jersey" },
            { trait_type: "Face", value: "Winking" }
          ]
        }
      }
    ]
  },
  {
    name: "Azuki",
    description: "A collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.",
    contractAddress: "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "40",
        name: "Azuki #40",
        image: "/inspiration-nfts/azuki/40.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "A legendary Azuki with extremely rare traits.",
          attributes: [
            { trait_type: "Type", value: "Human" },
            { trait_type: "Hair", value: "Pink Blonde" },
            { trait_type: "Clothing", value: "Red Kimono" }
          ]
        }
      },
      {
        tokenId: "1",
        name: "Azuki #1",
        image: "/inspiration-nfts/azuki/1.svg",
        rarity: "Ultra Rare",
        staticMetadata: {
          description: "The first Azuki, marking the beginning of The Garden.",
          attributes: [
            { trait_type: "Type", value: "Human" },
            { trait_type: "Hair", value: "Black" }
          ]
        }
      },
      {
        tokenId: "3000",
        name: "Azuki #3000",
        image: "/inspiration-nfts/azuki/3000.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A well-positioned Azuki in the collection.",
          attributes: [
            { trait_type: "Type", value: "Human" },
            { trait_type: "Eyes", value: "Tired" }
          ]
        }
      },
      {
        tokenId: "5678",
        name: "Azuki #5678",
        image: "/inspiration-nfts/azuki/5678.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A classic Azuki representing the collection's essence.",
          attributes: [
            { trait_type: "Type", value: "Human" },
            { trait_type: "Hair", value: "Brown" }
          ]
        }
      },
      {
        tokenId: "8888",
        name: "Azuki #8888",
        image: "/inspiration-nfts/azuki/8888.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A lucky number Azuki with appealing traits.",
          attributes: [
            { trait_type: "Type", value: "Human" },
            { trait_type: "Clothing", value: "Hoodie" }
          ]
        }
      }
    ]
  },
  {
    name: "CloneX",
    description: "Next-gen Avatars, by RTFKT and Takashi Murakami. A collection of 20,000 unique digital characters.",
    contractAddress: "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B",
    totalSupply: "20,000",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "1",
        name: "CloneX #1",
        image: "/inspiration-nfts/clonex/1.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "The genesis CloneX, a collaboration masterpiece.",
          attributes: [
            { trait_type: "DNA", value: "Human" },
            { trait_type: "Eye Color", value: "Blue" },
            { trait_type: "Hair", value: "Murakami Drip" }
          ]
        }
      },
      {
        tokenId: "3739",
        name: "CloneX #3739",
        image: "/inspiration-nfts/clonex/3739.svg",
        rarity: "Murakami",
        staticMetadata: {
          description: "A special Murakami variant CloneX.",
          attributes: [
            { trait_type: "DNA", value: "Human" },
            { trait_type: "Clothing", value: "Murakami Jacket" }
          ]
        }
      },
      {
        tokenId: "10000",
        name: "CloneX #10000",
        image: "/inspiration-nfts/clonex/10000.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A milestone CloneX marking a significant number.",
          attributes: [
            { trait_type: "DNA", value: "Robot" },
            { trait_type: "Eye Color", value: "Red" }
          ]
        }
      },
      {
        tokenId: "15555",
        name: "CloneX #15555",
        image: "/inspiration-nfts/clonex/15555.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A classic CloneX with standard features.",
          attributes: [
            { trait_type: "DNA", value: "Human" },
            { trait_type: "Clothing", value: "Hoodie" }
          ]
        }
      },
      {
        tokenId: "19999",
        name: "CloneX #19999",
        image: "/inspiration-nfts/clonex/19999.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "Near the end of the CloneX collection.",
          attributes: [
            { trait_type: "DNA", value: "Alien" },
            { trait_type: "Eye Color", value: "Green" }
          ]
        }
      }
    ]
  },
  {
    name: "Art Blocks Curated",
    description: "Generative art pieces created by top-tier artists on the Art Blocks platform.",
    contractAddress: "0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270",
    totalSupply: "Variable",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "13000",
        name: "Chromie Squiggle #13000",
        image: "/inspiration-nfts/art-blocks/13000.svg",
        rarity: "Perfect Spectrum",
        staticMetadata: {
          description: "A perfect spectrum Chromie Squiggle, highly valued.",
          attributes: [
            { trait_type: "Type", value: "Chromie Squiggle" },
            { trait_type: "Spectrum", value: "Perfect" }
          ]
        }
      },
      {
        tokenId: "78000",
        name: "Fidenza #78000",
        image: "/inspiration-nfts/art-blocks/78000.svg",
        rarity: "Ultra Dense",
        staticMetadata: {
          description: "An ultra dense Fidenza with complex patterns.",
          attributes: [
            { trait_type: "Type", value: "Fidenza" },
            { trait_type: "Density", value: "Ultra" }
          ]
        }
      },
      {
        tokenId: "125000",
        name: "Ringers #125000",
        image: "/inspiration-nfts/art-blocks/125000.svg",
        rarity: "Perfect",
        staticMetadata: {
          description: "A perfect Ringers with exceptional composition.",
          attributes: [
            { trait_type: "Type", value: "Ringers" },
            { trait_type: "Rarity", value: "Perfect" }
          ]
        }
      },
      {
        tokenId: "56000",
        name: "Archetype #56000",
        image: "/inspiration-nfts/art-blocks/56000.svg",
        rarity: "Golden",
        staticMetadata: {
          description: "A golden Archetype with beautiful geometry.",
          attributes: [
            { trait_type: "Type", value: "Archetype" },
            { trait_type: "Color", value: "Golden" }
          ]
        }
      },
      {
        tokenId: "189000",
        name: "Memories of Qilin #189000",
        image: "/inspiration-nfts/art-blocks/189000.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "A legendary piece from the Memories of Qilin series.",
          attributes: [
            { trait_type: "Type", value: "Memories of Qilin" },
            { trait_type: "Rarity", value: "Legendary" }
          ]
        }
      }
    ]
  },
  {
    name: "Otherdeeds for Otherside",
    description: "Land NFTs for Yuga Labs' upcoming Otherside metaverse game.",
    contractAddress: "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258",
    totalSupply: "100,000",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "1",
        name: "Otherdeed #1",
        image: "/inspiration-nfts/otherdeeds/1.svg",
        rarity: "Legendary Koda",
        staticMetadata: {
          description: "The first Otherdeed with a legendary Koda.",
          attributes: [
            { trait_type: "Environment", value: "Swamp" },
            { trait_type: "Koda", value: "Mega" }
          ]
        }
      },
      {
        tokenId: "100000",
        name: "Otherdeed #100000",
        image: "/inspiration-nfts/otherdeeds/100000.svg",
        rarity: "Epic",
        staticMetadata: {
          description: "The final Otherdeed in the collection.",
          attributes: [
            { trait_type: "Environment", value: "Volcanic" },
            { trait_type: "Resources", value: "Legendary" }
          ]
        }
      },
      {
        tokenId: "42069",
        name: "Otherdeed #42069",
        image: "/inspiration-nfts/otherdeeds/42069.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A memorable numbered Otherdeed.",
          attributes: [
            { trait_type: "Environment", value: "Desert" },
            { trait_type: "Resources", value: "Rare" }
          ]
        }
      },
      {
        tokenId: "50000",
        name: "Otherdeed #50000",
        image: "/inspiration-nfts/otherdeeds/50000.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A mid-collection Otherdeed.",
          attributes: [
            { trait_type: "Environment", value: "Forest" },
            { trait_type: "Resources", value: "Common" }
          ]
        }
      },
      {
        tokenId: "77777",
        name: "Otherdeed #77777",
        image: "/inspiration-nfts/otherdeeds/77777.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A lucky sevens Otherdeed.",
          attributes: [
            { trait_type: "Environment", value: "Plains" },
            { trait_type: "Resources", value: "Uncommon" }
          ]
        }
      }
    ]
  },
  {
    name: "World of Women",
    description: "World of Women is a collection of 10,000 NFTs that gives you full commercial usage rights.",
    contractAddress: "0xe785E82358879F061BC3dcAC6f0444462D4b5330",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
      {
        tokenId: "1",
        name: "World of Women #1",
        image: "/inspiration-nfts/world-of-women/1.svg",
        rarity: "Legendary",
        staticMetadata: {
          description: "The genesis World of Women NFT.",
          attributes: [
            { trait_type: "Background", value: "Purple" },
            { trait_type: "Hair", value: "Long Pink" },
            { trait_type: "Earring", value: "Golden" }
          ]
        }
      },
      {
        tokenId: "7777",
        name: "World of Women #7777",
        image: "/inspiration-nfts/world-of-women/7777.svg",
        rarity: "Ultra Rare",
        staticMetadata: {
          description: "A lucky sevens World of Women.",
          attributes: [
            { trait_type: "Background", value: "Rainbow" },
            { trait_type: "Hair", value: "Multicolor" }
          ]
        }
      },
      {
        tokenId: "5000",
        name: "World of Women #5000",
        image: "/inspiration-nfts/world-of-women/5000.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A milestone World of Women.",
          attributes: [
            { trait_type: "Background", value: "Blue" },
            { trait_type: "Hair", value: "Black Bob" }
          ]
        }
      },
      {
        tokenId: "2468",
        name: "World of Women #2468",
        image: "/inspiration-nfts/world-of-women/2468.svg",
        rarity: "Common",
        staticMetadata: {
          description: "A classic World of Women with elegant features.",
          attributes: [
            { trait_type: "Background", value: "Pink" },
            { trait_type: "Hair", value: "Brown Curly" }
          ]
        }
      },
      {
        tokenId: "9876",
        name: "World of Women #9876",
        image: "/inspiration-nfts/world-of-women/9876.svg",
        rarity: "Rare",
        staticMetadata: {
          description: "A late collection World of Women.",
          attributes: [
            { trait_type: "Background", value: "Green" },
            { trait_type: "Hair", value: "Blonde Straight" }
          ]
        }
      }
    ]
  }
];

// Helper function to get all NFTs for use in examples
export const getAllInspirationNfts = (): InspirationNft[] => {
  return inspirationCollections.flatMap(collection => 
    collection.nfts.map(nft => ({
      ...nft,
      // Add collection context
      description: nft.staticMetadata.description,
    }))
  );
};

// Helper function to get NFTs by collection
export const getNftsByCollection = (contractAddress: string): InspirationNft[] => {
  const collection = inspirationCollections.find(
    c => c.contractAddress.toLowerCase() === contractAddress.toLowerCase()
  );
  return collection?.nfts || [];
};

// Helper function to get collection info
export const getCollectionInfo = (contractAddress: string): InspirationCollection | undefined => {
  return inspirationCollections.find(
    c => c.contractAddress.toLowerCase() === contractAddress.toLowerCase()
  );
};`;

// Write the updated file
const filePath = path.join(__dirname, '..', 'src', 'data', 'inspirationNfts.ts');
fs.writeFileSync(filePath, updatedCollections);

console.log('Updated inspirationNfts.ts with local images and static metadata!');