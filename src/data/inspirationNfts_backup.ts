export interface InspirationNft {
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
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "1",
      name: "Bored Ape Yacht Club #1",
      image: "/inspiration-nfts/bayc/1.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Bored Ape Yacht Club collection.",
        attributes: [
          { trait_type: "Mouth", value: "Grin" },
          { trait_type: "Clothes", value: "Vietnam Jacket" },
          { trait_type: "Background", value: "Orange" },
          { trait_type: "Eyes", value: "Blue Beams" },
          { trait_type: "Fur", value: "Robot" }
        ]
      }
    },
    {
      tokenId: "2087",
      name: "#2087",
      image: "/inspiration-nfts/bayc/2087.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Bored Ape Yacht Club collection.",
        attributes: [
          { trait_type: "Mouth", value: "Bored Cigarette" },
          { trait_type: "Background", value: "Purple" },
          { trait_type: "Fur", value: "Trippy" },
          { trait_type: "Eyes", value: "Angry" }
        ]
      }
    },
    {
      tokenId: "8817",
      name: "#8817",
      image: "/inspiration-nfts/bayc/8817.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Bored Ape Yacht Club collection.",
        attributes: [
          { trait_type: "Hat", value: "Spinner Hat" },
          { trait_type: "Background", value: "Orange" },
          { trait_type: "Eyes", value: "Sleepy" },
          { trait_type: "Clothes", value: "Wool Turtleneck" },
          { trait_type: "Mouth", value: "Bored Party Horn" },
          { trait_type: "Earring", value: "Silver Hoop" },
          { trait_type: "Fur", value: "Solid Gold" }
        ]
      }
    },
    {
      tokenId: "232",
      name: "#232",
      image: "/inspiration-nfts/bayc/232.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Bored Ape Yacht Club collection.",
        attributes: [
          { trait_type: "Eyes", value: "Sleepy" },
          { trait_type: "Hat", value: "Seaman\\'s Hat" },
          { trait_type: "Fur", value: "Solid Gold" },
          { trait_type: "Background", value: "Army Green" },
          { trait_type: "Mouth", value: "Bored" },
          { trait_type: "Clothes", value: "Smoking Jacket" }
        ]
      }
    },
    {
      tokenId: "5809",
      name: "#5809",
      image: "/inspiration-nfts/bayc/5809.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Bored Ape Yacht Club collection.",
        attributes: [
          { trait_type: "Earring", value: "Gold Hoop" },
          { trait_type: "Background", value: "Blue" },
          { trait_type: "Fur", value: "Solid Gold" },
          { trait_type: "Mouth", value: "Bored" },
          { trait_type: "Eyes", value: "Holographic" }
        ]
      }
    }
    ]
  },
  {
    name: "Pudgy Penguins",
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "6873",
      name: "Pudgy Penguin #6873",
      image: "/inspiration-nfts/pudgy-penguins/6873.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A collection 8888 Cute Chubby Pudgy Penquins sliding around on the freezing ETH blockchain.",
        attributes: [
          { trait_type: "Background", value: "Green" },
          { trait_type: "Skin", value: "Black" },
          { trait_type: "Body", value: "Mirrored" },
          { trait_type: "Face", value: "Mirrored" },
          { trait_type: "Head", value: "None" }
        ]
      }
    },
    {
      tokenId: "3950",
      name: "Pudgy Penguin #3950",
      image: "/inspiration-nfts/pudgy-penguins/3950.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A collection 8888 Cute Chubby Pudgy Penquins sliding around on the freezing ETH blockchain.",
        attributes: [
          { trait_type: "Background", value: "On The Beach" },
          { trait_type: "Skin", value: "Navy Blue" },
          { trait_type: "Body", value: "Pineapple Suit" },
          { trait_type: "Face", value: "Normal" },
          { trait_type: "Head", value: "Pineapple Suit" }
        ]
      }
    },
    {
      tokenId: "6570",
      name: "Pudgy Penguin #6570",
      image: "/inspiration-nfts/pudgy-penguins/6570.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A collection 8888 Cute Chubby Pudgy Penquins sliding around on the freezing ETH blockchain.",
        attributes: [
          { trait_type: "Background", value: "Blue" },
          { trait_type: "Skin", value: "Ice" },
          { trait_type: "Body", value: "Lei Blue" },
          { trait_type: "Face", value: "Handlebar Bear" },
          { trait_type: "Head", value: "Rice Hat" }
        ]
      }
    },
    {
      tokenId: "5678",
      name: "Pudgy Penguin #5678",
      image: "/inspiration-nfts/pudgy-penguins/5678.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A collection 8888 Cute Chubby Pudgy Penquins sliding around on the freezing ETH blockchain.",
        attributes: [
          { trait_type: "Background", value: "Trick Or Treating" },
          { trait_type: "Skin", value: "Navy Blue" },
          { trait_type: "Body", value: "Pillow Case" },
          { trait_type: "Face", value: "Pillow Case" },
          { trait_type: "Head", value: "Normal" }
        ]
      }
    },
    {
      tokenId: "484",
      name: "Pudgy Penguin #484",
      image: "/inspiration-nfts/pudgy-penguins/484.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A collection 8888 Cute Chubby Pudgy Penquins sliding around on the freezing ETH blockchain.",
        attributes: [
          { trait_type: "Background", value: "Tangerine" },
          { trait_type: "Skin", value: "Gold" },
          { trait_type: "Body", value: "Kimono Gold" },
          { trait_type: "Face", value: "Winking" },
          { trait_type: "Head", value: "Backwards Hat Red" }
        ]
      }
    }
    ]
  },
  {
    name: "Doodles",
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "6914",
      name: "Doodle #6914",
      image: "/inspiration-nfts/doodles/6914.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
        attributes: [
          { trait_type: "face", value: "gold ape" },
          { trait_type: "hair", value: "crown" },
          { trait_type: "body", value: "gold ape" },
          { trait_type: "background", value: "gold" },
          { trait_type: "head", value: "gold ape" }
        ]
      }
    },
    {
      tokenId: "316",
      name: "Doodle #316",
      image: "/inspiration-nfts/doodles/316.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
        attributes: [
          { trait_type: "face", value: "rainbow puke" },
          { trait_type: "hair", value: "bed head" },
          { trait_type: "body", value: "navy sweater" },
          { trait_type: "background", value: "pink" },
          { trait_type: "head", value: "med" }
        ]
      }
    },
    {
      tokenId: "1099",
      name: "Doodle #1099",
      image: "/inspiration-nfts/doodles/1099.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
        attributes: [
          { trait_type: "face", value: "holographic cat" },
          { trait_type: "hair", value: "holographic cat" },
          { trait_type: "body", value: "holographic cat" },
          { trait_type: "background", value: "holographic" },
          { trait_type: "head", value: "holographic cat" }
        ]
      }
    },
    {
      tokenId: "9243",
      name: "Doodle #9243",
      image: "/inspiration-nfts/doodles/9243.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
        attributes: [
          { trait_type: "face", value: "pirate skelly" },
          { trait_type: "hair", value: "shaved" },
          { trait_type: "body", value: "brittle bones skelly" },
          { trait_type: "background", value: "starry blue" },
          { trait_type: "head", value: "brittle bones skelly" }
        ]
      }
    },
    {
      tokenId: "2238",
      name: "Doodle #2238",
      image: "/inspiration-nfts/doodles/2238.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury. Burnt Toast is the working alias for Scott Martin, a Canadian–based illustrator, designer, animator and muralist.",
        attributes: [
          { trait_type: "face", value: "alien" },
          { trait_type: "hair", value: "grey alien" },
          { trait_type: "body", value: "alien" },
          { trait_type: "background", value: "grey space" },
          { trait_type: "head", value: "grey alien" }
        ]
      }
    }
    ]
  },
  {
    name: "LilPudgys",
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0x524cab2ec69124574082676e6f654a18df49a048",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "16343",
      name: "Lil Pudgy #16343",
      image: "/inspiration-nfts/lilpudgys/16343.png",
      rarity: "Rare",
      staticMetadata: {
        description: "Lil Pudgys are a collection of 22,222 randomly generated NFTs minted on Ethereum.",
        attributes: [
          { trait_type: "Legendary", value: "Taco" }
        ]
      }
    },
    {
      tokenId: "21396",
      name: "Lil Pudgy #21396",
      image: "/inspiration-nfts/lilpudgys/21396.png",
      rarity: "Rare",
      staticMetadata: {
        description: "Lil Pudgys are a collection of 22,222 randomly generated NFTs minted on Ethereum.",
        attributes: [
          { trait_type: "Legendary", value: "Jetpack" }
        ]
      }
    },
    {
      tokenId: "5447",
      name: "Lil Pudgy #5447",
      image: "/inspiration-nfts/lilpudgys/5447.png",
      rarity: "Rare",
      staticMetadata: {
        description: "Lil Pudgys are a collection of 22,222 randomly generated NFTs minted on Ethereum.",
        attributes: [
          { trait_type: "Legendary", value: "Avocado" }
        ]
      }
    },
    {
      tokenId: "10369",
      name: "Lil Pudgy #10369",
      image: "/inspiration-nfts/lilpudgys/10369.png",
      rarity: "Rare",
      staticMetadata: {
        description: "Lil Pudgys are a collection of 22,222 randomly generated NFTs minted on Ethereum.",
        attributes: [
          { trait_type: "Pudgy Knight", value: "Red" }
        ]
      }
    },
    {
      tokenId: "19779",
      name: "Lil Pudgy #19779",
      image: "/inspiration-nfts/lilpudgys/19779.png",
      rarity: "Rare",
      staticMetadata: {
        description: "Lil Pudgys are a collection of 22,222 randomly generated NFTs minted on Ethereum.",
        attributes: [
          { trait_type: "Background", value: "Beige" },
          { trait_type: "Skin", value: "Ice" },
          { trait_type: "Body", value: "Scarf Green" },
          { trait_type: "Face", value: "Normal" },
          { trait_type: "Left Flipper", value: "None" },
          { trait_type: "Head", value: "Ice Crown" },
          { trait_type: "Right Flipper", value: "None" }
        ]
      }
    }
    ]
  },
  {
    name: "Opepen Edition",
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0x6339e5e072086621540d0362c4e3cea0d643e114",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "14468",
      name: "8x8, Set 001, Ed. 4",
      image: "/inspiration-nfts/opepen-edition/14468.png",
      rarity: "Rare",
      staticMetadata: {
        description: "This artwork may or may not be handmade.",
        attributes: [
          { trait_type: "Artist", value: "Jack Butcher" },
          { trait_type: "Release", value: "1" },
          { trait_type: "Set", value: "8x8" },
          { trait_type: "Opepen", value: "XII" },
          { trait_type: "Edition Size", value: "Four" },
          { trait_type: "Revealed", value: "Yes" },
          { trait_type: "Number", value: "14468" }
        ]
      }
    },
    {
      tokenId: "8625",
      name: "8x8, Set 001, Ed. 5",
      image: "/inspiration-nfts/opepen-edition/8625.png",
      rarity: "Rare",
      staticMetadata: {
        description: "This artwork may or may not be handmade.",
        attributes: [
          { trait_type: "Artist", value: "Jack Butcher" },
          { trait_type: "Release", value: "1" },
          { trait_type: "Set", value: "8x8" },
          { trait_type: "Opepen", value: "IX" },
          { trait_type: "Edition Size", value: "Five" },
          { trait_type: "Revealed", value: "Yes" },
          { trait_type: "Number", value: "8625" }
        ]
      }
    },
    {
      tokenId: "151",
      name: "8x8, Set 001, Ed. 1",
      image: "/inspiration-nfts/opepen-edition/151.png",
      rarity: "Rare",
      staticMetadata: {
        description: "This artwork may or may not be handmade.",
        attributes: [
          { trait_type: "Artist", value: "Jack Butcher" },
          { trait_type: "Release", value: "1" },
          { trait_type: "Set", value: "8x8" },
          { trait_type: "Opepen", value: "XVI" },
          { trait_type: "Edition Size", value: "One" },
          { trait_type: "Revealed", value: "Yes" },
          { trait_type: "Number", value: "151" }
        ]
      }
    },
    {
      tokenId: "12292",
      name: "8x8, Set 001, Ed. 10",
      image: "/inspiration-nfts/opepen-edition/12292.png",
      rarity: "Rare",
      staticMetadata: {
        description: "This artwork may or may not be handmade.",
        attributes: [
          { trait_type: "Artist", value: "Jack Butcher" },
          { trait_type: "Release", value: "1" },
          { trait_type: "Set", value: "8x8" },
          { trait_type: "Opepen", value: "V" },
          { trait_type: "Edition Size", value: "Ten" },
          { trait_type: "Revealed", value: "Yes" },
          { trait_type: "Number", value: "12292" }
        ]
      }
    },
    {
      tokenId: "3634",
      name: "8x8, Set 001, Ed. 40",
      image: "/inspiration-nfts/opepen-edition/3634.png",
      rarity: "Rare",
      staticMetadata: {
        description: "This artwork may or may not be handmade.",
        attributes: [
          { trait_type: "Artist", value: "Jack Butcher" },
          { trait_type: "Release", value: "1" },
          { trait_type: "Set", value: "8x8" },
          { trait_type: "Opepen", value: "I" },
          { trait_type: "Edition Size", value: "Forty" },
          { trait_type: "Revealed", value: "Yes" },
          { trait_type: "Number", value: "3634" }
        ]
      }
    }
    ]
  },
  {
    name: "Cool Cats",
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "500",
      name: "Cool Cat #500",
      image: "/inspiration-nfts/cool-cats/500.png",
      rarity: "Rare",
      staticMetadata: {
        description: "WOW!!!! You just found one of the 9 hidden cats. These are insanely rare. Clon and Xtremetom created them without telling the rest of the team. Please drop by our discord to let us know you found it. [https://discord.com/invite/X6A4AXrKaR](https://discord.com/invite/X6A4AXrKaR).",
        attributes: [
          { trait_type: "body", value: "blue cat skin" },
          { trait_type: "hats", value: "upsidedown" },
          { trait_type: "shirt", value: "upsidedown" },
          { trait_type: "face", value: "upsidedown" },
          { trait_type: "tier", value: "exotic_2" }
        ]
      }
    },
    {
      tokenId: "6972",
      name: "Cool Cat #6972",
      image: "/inspiration-nfts/cool-cats/6972.png",
      rarity: "Rare",
      staticMetadata: {
        description: "WOW!!!! You just found one of the 9 hidden cats. These are insanely rare. Clon and Xtremetom created them without telling the rest of the team. Please drop by our discord to let us know you found it. [https://discord.com/invite/X6A4AXrKaR](https://discord.com/invite/X6A4AXrKaR).",
        attributes: [
          { trait_type: "body", value: "blue cat skin" },
          { trait_type: "hats", value: "celestial" },
          { trait_type: "shirt", value: "celestial" },
          { trait_type: "face", value: "celestial" },
          { trait_type: "tier", value: "exotic_2" }
        ]
      }
    },
    {
      tokenId: "1490",
      name: "Cool Cat #1490",
      image: "/inspiration-nfts/cool-cats/1490.png",
      rarity: "Rare",
      staticMetadata: {
        description: "WOW!!!! You just found one of the 9 hidden cats. These are insanely rare. Clon and Xtremetom created them without telling the rest of the team. Please drop by our discord to let us know you found it. [https://discord.com/invite/X6A4AXrKaR](https://discord.com/invite/X6A4AXrKaR).",
        attributes: [
          { trait_type: "body", value: "blue cat skin" },
          { trait_type: "hats", value: "special zombie" },
          { trait_type: "shirt", value: "special zombie" },
          { trait_type: "face", value: "special zombie" },
          { trait_type: "tier", value: "exotic_2" }
        ]
      }
    },
    {
      tokenId: "4695",
      name: "Cool Cat #4695",
      image: "/inspiration-nfts/cool-cats/4695.png",
      rarity: "Rare",
      staticMetadata: {
        description: "WOW!!!! You just found one of the 9 hidden cats. These are insanely rare. Clon and Xtremetom created them without telling the rest of the team. Please drop by our discord to let us know you found it. [https://discord.com/invite/X6A4AXrKaR](https://discord.com/invite/X6A4AXrKaR).",
        attributes: [
          { trait_type: "body", value: "blue cat skin" },
          { trait_type: "hats", value: "lucky" },
          { trait_type: "shirt", value: "lucky" },
          { trait_type: "face", value: "lucky" },
          { trait_type: "tier", value: "exotic_2" }
        ]
      }
    },
    {
      tokenId: "2288",
      name: "Cool Cat #2288",
      image: "/inspiration-nfts/cool-cats/2288.png",
      rarity: "Rare",
      staticMetadata: {
        description: "WOW!!!! You just found one of the 9 hidden cats. These are insanely rare. Clon and Xtremetom created them without telling the rest of the team. Please drop by our discord to let us know you found it. [https://discord.com/invite/X6A4AXrKaR](https://discord.com/invite/X6A4AXrKaR).",
        attributes: [
          { trait_type: "body", value: "blue cat skin" },
          { trait_type: "hats", value: "skeleton" },
          { trait_type: "shirt", value: "skeleton" },
          { trait_type: "face", value: "skeleton" },
          { trait_type: "tier", value: "exotic_2" }
        ]
      }
    }
    ]
  },
  {
    name: "Azuki",
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "40",
      name: "Azuki #40",
      image: "/inspiration-nfts/azuki/40.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Azuki collection.",
        attributes: [
          { trait_type: "Type", value: "Human" },
          { trait_type: "Hair", value: "Brown Long" },
          { trait_type: "Special", value: "Fireflies" },
          { trait_type: "Clothing", value: "Straw Poncho" },
          { trait_type: "Eyes", value: "Tired" },
          { trait_type: "Mouth", value: "Long Stubble" },
          { trait_type: "Offhand", value: "Lantern" },
          { trait_type: "Background", value: "Cool Gray" }
        ]
      }
    },
    {
      tokenId: "7301",
      name: "Azuki #7301",
      image: "/inspiration-nfts/azuki/7301.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Azuki collection.",
        attributes: [
          { trait_type: "Type", value: "Spirit" },
          { trait_type: "Hair", value: "Spirit Ponytail" },
          { trait_type: "Special", value: "Fireflies" },
          { trait_type: "Clothing", value: "Black Ninja Top" },
          { trait_type: "Eyes", value: "Striking" },
          { trait_type: "Mouth", value: "Lipstick" },
          { trait_type: "Offhand", value: "Golden Boombox" },
          { trait_type: "Background", value: "Red" }
        ]
      }
    },
    {
      tokenId: "9605",
      name: "Azuki #9605",
      image: "/inspiration-nfts/azuki/9605.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Azuki collection.",
        attributes: [
          { trait_type: "Background", value: "Cool Gray" },
          { trait_type: "Offhand", value: "Golden Shuriken" },
          { trait_type: "Mouth", value: "Pout" },
          { trait_type: "Type", value: "Spirit" },
          { trait_type: "Hair", value: "Spirit Fluffy" },
          { trait_type: "Eyes", value: "Chill" },
          { trait_type: "Special", value: "Fireflies" },
          { trait_type: "Ear", value: "Small Hoop" }
        ]
      }
    },
    {
      tokenId: "2174",
      name: "Azuki #2174",
      image: "/inspiration-nfts/azuki/2174.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Azuki collection.",
        attributes: [
          { trait_type: "Type", value: "Spirit" },
          { trait_type: "Hair", value: "Water" },
          { trait_type: "Special", value: "Water" },
          { trait_type: "Eyes", value: "Striking" },
          { trait_type: "Mouth", value: "Closed" },
          { trait_type: "Offhand", value: "Water Orb" },
          { trait_type: "Background", value: "Dark Blue" }
        ]
      }
    },
    {
      tokenId: "4666",
      name: "Azuki #4666",
      image: "/inspiration-nfts/azuki/4666.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Azuki collection.",
        attributes: [
          { trait_type: "Type", value: "Spirit" },
          { trait_type: "Hair", value: "Spirit Ponytail" },
          { trait_type: "Special", value: "Fireflies" },
          { trait_type: "Neck", value: "Golden Headphones" },
          { trait_type: "Clothing", value: "White Qipao with Fur" },
          { trait_type: "Eyes", value: "Striking" },
          { trait_type: "Mouth", value: "Grin" },
          { trait_type: "Offhand", value: "Golden Umbrella" }
        ]
      }
    }
    ]
  },
  {
    name: "CloneX",
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "18276",
      name: "CloneX #9996",
      image: "/inspiration-nfts/clonex/18276.png",
      rarity: "Rare",
      staticMetadata: {
        description: "🧬 CLONE X 🧬 - 20,000 next-gen Avatars, by RTFKT and Takashi Murakami 🌸",
        attributes: [
          { trait_type: "DNA", value: "Robot" },
          { trait_type: "Hair", value: "GRN DRDZ" },
          { trait_type: "Clothing", value: "JS Tee" },
          { trait_type: "Mouth", value: "WZRD" },
          { trait_type: "Type", value: "MK1" }
        ]
      }
    },
    {
      tokenId: "16775",
      name: "CloneX #10003",
      image: "/inspiration-nfts/clonex/16775.png",
      rarity: "Rare",
      staticMetadata: {
        description: "🧬 CLONE X 🧬 - 20,000 next-gen Avatars, by RTFKT and Takashi Murakami 🌸",
        attributes: [
          { trait_type: "DNA", value: "Robot" },
          { trait_type: "Hair", value: "BLU Long" },
          { trait_type: "Jewelry", value: "CYN Two Piece" },
          { trait_type: "Clothing", value: "GM MONO HOODIE" },
          { trait_type: "Eyewear", value: "ZK VR" }
        ]
      }
    },
    {
      tokenId: "1",
      name: "CloneX #1",
      image: "/inspiration-nfts/clonex/1.png",
      rarity: "Rare",
      staticMetadata: {
        description: "🧬 CLONE X 🧬 - 20,000 next-gen Avatars, by RTFKT and Takashi Murakami 🌸 (Murakami Edition)",
        attributes: [
          { trait_type: "DNA", value: "Human" },
          { trait_type: "Eye Color", value: "BLU-PURP" },
          { trait_type: "Eye Color", value: "BLU" },
          { trait_type: "Clothing", value: "JELLYFISH BLW UP JCKT" },
          { trait_type: "Jewelry", value: "GLD Iced Cuban" },
          { trait_type: "Type", value: "ARTIST EDITION" },
          { trait_type: "Type", value: "SPLIT" },
          { trait_type: "Type", value: "MURAKAMI DRIP" }
        ]
      }
    },
    {
      tokenId: "17036",
      name: "CloneX #19950",
      image: "/inspiration-nfts/clonex/17036.png",
      rarity: "Rare",
      staticMetadata: {
        description: "🧬 CLONE X 🧬 - 20,000 next-gen Avatars, by RTFKT and Takashi Murakami 🌸",
        attributes: [
          { trait_type: "DNA", value: "Human" },
          { trait_type: "Eye Color", value: "BRWN" },
          { trait_type: "Hair", value: "BLCK Curtains" },
          { trait_type: "Jewelry", value: "S-HIRE G-Link" },
          { trait_type: "Clothing", value: "WHT BKR JCKT" }
        ]
      }
    },
    {
      tokenId: "3",
      name: "CloneX #3",
      image: "/inspiration-nfts/clonex/3.png",
      rarity: "Rare",
      staticMetadata: {
        description: "🧬 CLONE X 🧬 - 20,000 next-gen Avatars, by RTFKT and Takashi Murakami 🌸 (Murakami Edition)",
        attributes: [
          { trait_type: "DNA", value: "Murakami" },
          { trait_type: "Eye Color", value: "RNBW" },
          { trait_type: "Clothing", value: "RTFKT x TM RNBW FLOWER PFA" },
          { trait_type: "Hair", value: "PURP KO2 Tiara" },
          { trait_type: "Mouth", value: "Tan Tan Bo" },
          { trait_type: "Back", value: "GRN UNDRWRLD WINGZ" },
          { trait_type: "Type", value: "ARTIST EDITION" },
          { trait_type: "Type", value: "MURAKAMI DRIP" }
        ]
      }
    }
    ]
  },
  {
    name: "Otherdeeds for Otherside",
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "1890",
      name: "Otherdeeds for Otherside #1890",
      image: "/inspiration-nfts/otherdeeds/1890.jpg",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Otherdeeds for Otherside collection.",
        attributes: [
          { trait_type: "Category", value: "Mineral" },
          { trait_type: "Sediment Tier", value: "2" },
          { trait_type: "Southern Resource", value: "Luster" },
          { trait_type: "Southern Resource Tier", value: "2" },
          { trait_type: "Environment Tier", value: "4" },
          { trait_type: "Western Resource", value: "Whisper" },
          { trait_type: "Western Resource Tier", value: "3" },
          { trait_type: "Northern Resource Tier", value: "2" }
        ]
      }
    },
    {
      tokenId: "54421",
      name: "Otherdeeds for Otherside #54421",
      image: "/inspiration-nfts/otherdeeds/54421.jpg",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Otherdeeds for Otherside collection.",
        attributes: [
          { trait_type: "Category", value: "Mineral" },
          { trait_type: "Northern Resource Tier", value: "1" },
          { trait_type: "Environment Tier", value: "2" },
          { trait_type: "Sediment", value: "Infinite Expanse" },
          { trait_type: "Sediment Tier", value: "1" },
          { trait_type: "Eastern Resource", value: "Brimstone" },
          { trait_type: "Environment", value: "Crystal" },
          { trait_type: "Eastern Resource Tier", value: "2" }
        ]
      }
    },
    {
      tokenId: "55171",
      name: "Otherdeeds for Otherside #55171",
      image: "/inspiration-nfts/otherdeeds/55171.jpg",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Otherdeeds for Otherside collection.",
        attributes: [
          { trait_type: "Western Resource Tier", value: "2" },
          { trait_type: "Sediment", value: "Infinite Expanse" },
          { trait_type: "Sediment Tier", value: "1" },
          { trait_type: "Environment Tier", value: "5" },
          { trait_type: "Eastern Resource Tier", value: "1" },
          { trait_type: "Category", value: "Volcanic" },
          { trait_type: "Environment", value: "Molten" },
          { trait_type: "Eastern Resource", value: "Petrified" }
        ]
      }
    },
    {
      tokenId: "134",
      name: "Otherdeeds for Otherside #134",
      image: "/inspiration-nfts/otherdeeds/134.jpg",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Otherdeeds for Otherside collection.",
        attributes: [
          { trait_type: "Environment Tier", value: "1" },
          { trait_type: "Sediment Tier", value: "1" },
          { trait_type: "Eastern Resource Tier", value: "1" },
          { trait_type: "Western Resource Tier", value: "3" },
          { trait_type: "Category", value: "Growth" },
          { trait_type: "Eastern Resource", value: "Luster" },
          { trait_type: "Sediment", value: "Biogenic Swamp" },
          { trait_type: "Western Resource", value: "Moldium" }
        ]
      }
    },
    {
      tokenId: "60401",
      name: "Otherdeeds for Otherside #60401",
      image: "/inspiration-nfts/otherdeeds/60401.jpg",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the Otherdeeds for Otherside collection.",
        attributes: [
          { trait_type: "Western Resource Tier", value: "2" },
          { trait_type: "Northern Resource Tier", value: "1" },
          { trait_type: "Sediment", value: "Infinite Expanse" },
          { trait_type: "Sediment Tier", value: "1" },
          { trait_type: "Southern Resource Tier", value: "1" },
          { trait_type: "Environment Tier", value: "5" },
          { trait_type: "Eastern Resource Tier", value: "1" },
          { trait_type: "Category", value: "Chaos" }
        ]
      }
    }
    ]
  },
  {
    name: "World of Women",
    description: "A premier NFT collection on Ethereum.",
    contractAddress: "0xe785E82358879F061BC3dcAC6f0444462D4b5330",
    totalSupply: "10,000",
    chain: "ethereum",
    nfts: [
    {
      tokenId: "1460",
      name: "WoW #1460",
      image: "/inspiration-nfts/world-of-women/1460.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the World of Women collection.",
        attributes: [
          { trait_type: "Background", value: "Dark Emerald" },
          { trait_type: "Skin Tone", value: "Night Goddess" },
          { trait_type: "Eyes", value: "Green To The Right" },
          { trait_type: "Hairstyle", value: "Double Buns" },
          { trait_type: "Face Accessories", value: "Resting Butterfly" },
          { trait_type: "Necklace", value: "WoW Coin" },
          { trait_type: "Clothes", value: "Polka Dot Top" },
          { trait_type: "Earrings", value: "Triple Rings" }
        ]
      }
    },
    {
      tokenId: "6025",
      name: "WoW #6025",
      image: "/inspiration-nfts/world-of-women/6025.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the World of Women collection.",
        attributes: [
          { trait_type: "Background", value: "Orange Yellow" },
          { trait_type: "Skin Tone", value: "Night Goddess" },
          { trait_type: "Eyes", value: "Blue To The Left" },
          { trait_type: "Facial Features", value: "Nose Piercing" },
          { trait_type: "Hairstyle", value: "Long Dark" },
          { trait_type: "Necklace", value: "WoW Coin" },
          { trait_type: "Clothes", value: "Naiade" },
          { trait_type: "Earrings", value: "Classic Hoops" }
        ]
      }
    },
    {
      tokenId: "5672",
      name: "WoW #5672",
      image: "/inspiration-nfts/world-of-women/5672.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the World of Women collection.",
        attributes: [
          { trait_type: "Background", value: "Red Turquoise" },
          { trait_type: "Skin Tone", value: "Night Goddess" },
          { trait_type: "Eyes", value: "Blue Eye Roll" },
          { trait_type: "Facial Features", value: "Sunset" },
          { trait_type: "Hairstyle", value: "Bob" },
          { trait_type: "Clothes", value: "Tuxedo" },
          { trait_type: "Earrings", value: "Triple Rings" },
          { trait_type: "Mouth", value: "Surprised" }
        ]
      }
    },
    {
      tokenId: "977",
      name: "WoW #977",
      image: "/inspiration-nfts/world-of-women/977.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the World of Women collection.",
        attributes: [
          { trait_type: "Background", value: "Orange Yellow" },
          { trait_type: "Skin Tone", value: "Night Goddess" },
          { trait_type: "Eyes", value: "Green To The Left" },
          { trait_type: "Facial Features", value: "Feline Eyes" },
          { trait_type: "Hairstyle", value: "Rose Hair" },
          { trait_type: "Face Accessories", value: "Hypnotic Glasses" },
          { trait_type: "Clothes", value: "Witch Dress" },
          { trait_type: "Earrings", value: "Pearls" }
        ]
      }
    },
    {
      tokenId: "2701",
      name: "WoW #2701",
      image: "/inspiration-nfts/world-of-women/2701.png",
      rarity: "Rare",
      staticMetadata: {
        description: "A unique NFT from the World of Women collection.",
        attributes: [
          { trait_type: "Background", value: "Dark Emerald" },
          { trait_type: "Skin Tone", value: "Night Goddess" },
          { trait_type: "Eyes", value: "Black To The Right" },
          { trait_type: "Facial Features", value: "Freckles" },
          { trait_type: "Hairstyle", value: "Lioness" },
          { trait_type: "Face Accessories", value: "Resting Butterfly" },
          { trait_type: "Necklace", value: "Back To The 90s" },
          { trait_type: "Clothes", value: "Painter\\'s Overall" }
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
};