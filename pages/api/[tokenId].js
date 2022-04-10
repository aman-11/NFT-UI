//need to  be done is making a tokenURI
// which concat the TokenID and BAseURI
// BaseURI = "http://localhost:3000/api/"
//token id = 1
//tokenURI = http://localhost:3000/api

const nftData = [
  {
    name: "#0",
    description: "A PAPAFAM Ape",
    Shirt: "black",
    Fur: "gold",
    Hat: "sailor",
    Eyes: "laser",
  },
  {
    name: "#1",
    description: "A PAPAFAM Ape",
    Shirt: "caveman",
    Fur: "brown",
    Hat: "beanie",
    Eyes: "sleepy",
  },
  {
    name: "#2",
    description: "A PAPAFAM Ape",
    Shirt: "caveman",
    Fur: "gray",
    Hat: "none",
    Eyes: "blindfold",
  },
  {
    name: "#3",
    description: "A PAPAFAM Ape",
    Shirt: "white suit",
    Fur: "cream",
    Hat: "halo",
    Eyes: "blue visor",
  },
  {
    name: "#4",
    description: "A PAPAFAM Ape",
    Shirt: "none",
    Fur: "gray",
    Hat: "cowboy",
    Eyes: "blindfold",
  },
  {
    name: "#5",
    description: "A PAPAFAM Ape",
    Shirt: "black",
    Fur: "brown",
    Hat: "bunny ears",
    Eyes: "zombie",
  },
  {
    name: "#6",
    description: "A PAPAFAM Ape",
    Shirt: "red",
    Fur: "red",
    Hat: "devil",
    Eyes: "closed",
  },
  {
    name: "#7",
    description: "A PAPAFAM Ape",
    Shirt: "white suit",
    Fur: "light brown",
    Hat: "crown",
    Eyes: "high",
  },
  {
    name: "#8",
    description: "A PAPAFAM Ape",
    Shirt: "black suit",
    Fur: "dark gray",
    Hat: "none",
    Eyes: "sleepy",
  },
  {
    name: "#9",
    description: "A PAPAFAM Ape",
    Shirt: "biker",
    Fur: "rainbow",
    Hat: "halo",
    Eyes: "sleepy",
  },
  {
    name: "#10",
    description: "A PAPAFAM Ape",
    Shirt: "caveman",
    Fur: "leopard",
    Hat: "crown",
    Eyes: "sad",
  },
  {
    name: "#11",
    description: "A PAPAFAM Ape",
    Shirt: "american",
    Fur: "brown",
    Hat: "american",
    Eyes: "american visor",
  },
  {
    name: "#12",
    description: "A PAPAFAM Ape",
    Shirt: "none",
    Fur: "dark gray",
    Hat: "none",
    Eyes: "chill",
  },
  {
    name: "#13",
    description: "A PAPAFAM Ape",
    Shirt: "black",
    Fur: "cyborg",
    Hat: "mohawk",
    Eyes: "high",
  },
  {
    name: "#14",
    description: "A PAPAFAM Ape",
    Shirt: "bling biker",
    Fur: "cyborg",
    Hat: "japan",
    Eyes: "high",
  },
  {
    name: "#15",
    description: "A PAPAFAM Ape",
    Shirt: "pink fur",
    Fur: "blue",
    Hat: "beanie",
    Eyes: "closed",
  },
  {
    name: "#16",
    description: "A PAPAFAM Ape",
    Shirt: "biker",
    Fur: "brown",
    Hat: "none",
    Eyes: "black visor",
  },
  {
    name: "#17",
    description: "A PAPAFAM Ape",
    Shirt: "waistcoat",
    Fur: "cream",
    Hat: "pink",
    Eyes: "laser",
  },
  {
    name: "#18",
    description: "A PAPAFAM Ape",
    Shirt: "black",
    Fur: "brown",
    Hat: "none",
    Eyes: "laser",
  },
  {
    name: "#19",
    description: "A PAPAFAM Ape",
    Shirt: "roman",
    Fur: "black cyborg",
    Hat: "none",
    Eyes: "cross",
  },
  {
    name: "#20",
    description: "A PAPAFAM Ape",
    Shirt: "waistcoat",
    Fur: "red",
    Hat: "red ponytail",
    Eyes: "chill",
  },
];

export default function handler(req, res) {
  const tokenId = req.query.tokenId;

  const name = `Useless Nfts #${tokenId}`;
  const description = "NFT collection for web3 devs";

  const nftObj = nftData[tokenId];
  // console.log(nftObj);

  const sampleAttr = Object.entries(nftObj).map((obj) => {
    // console.log(obj);
    if (
      obj[0] == "Shirt" ||
      obj[0] == "Fur" ||
      obj[0] == "Hat" ||
      obj[0] == "Eyes"
    ) {
      const attr = {
        trait_type: obj[0],
        value: obj[1],
      };
      return attr;
    }
  });

  const attributes = sampleAttr.filter((obj) => {
    if (obj) return true;
  });

  const image = `ipfs://QmecgHz9dM171cR4JxSaw2B3uzWtQvLYjhBzNZJ3N1EX2c/${
    Number(tokenId) - 1
  }.png`;

  return res.status(200).json({
    name,
    description,
    attributes,
    image,
  });
}
