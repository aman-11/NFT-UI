import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import coverImage from "../public/cover.png";
import contenImage from "../public/content.svg";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { NFTContarctAddress, abi } from "../constants/variable";
import ProgressBar from "@badrap/bar-of-progress";

export default function Home() {
  const web3ModalRef = useRef();
  const [tokenIdsMinted, setTokenIdsMinted] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const state = [
    "beforeStarted",
    "preSaleStarted",
    "resume",
    "paused",
    "preSaleEnded",
  ];

  const progress = new ProgressBar({
    size: 3,
    color: "#FE595E",
    className: "z-50",
    delay: 1500,
  });

  const checkWhitelisted = async () => {
    try {
      const provider = await getProvisersAndSigners();
      const cryptoDevsContract = new ethers.Contract(
        NFTContarctAddress,
        abi,
        provider
      );

      const isPresaleStarted = await cryptoDevsContract.NFTstate();
      // console.log("inside check presale starrted", isPresaleStarted); //it returms with 0,1,2
      if (state[isPresaleStarted] === "preSaleStarted") {
        setPresaleStarted(true);
        console.log("presale started");
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const getTotalTokensMinted = async () => {
    try {
      const provider = await getProvisersAndSigners();
      const cryptoDevsContract = new ethers.Contract(
        NFTContarctAddress,
        abi,
        provider
      );

      const totalTokenMinted = await cryptoDevsContract.tokenIds(); //returns bignumberr
      // console.log("totalTokenMinted", totalTokenMinted.toString());
      setTokenIdsMinted(totalTokenMinted.toString());

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const getProvisersAndSigners = async (needSigner = false) => {
    try {
      const instance = await web3ModalRef.current.connect();
      const web3Provider = new ethers.providers.Web3Provider(instance);
      setWalletConnected(true);

      //check for the network since we only allow rinkeby
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 4) {
        // console.log(chainId);
        alert("Please connect to Rinkeby Network");
        throw new Error("Please connect to Rinkeby Network");
      }

      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }

      //else return Provider
      return web3Provider;
    } catch (error) {
      console.error("wallet connection failed", error);
    }
  };

  const presaleMint = async () => {
    if (isOwner) {
      alert("Owner cant mint from contract address.");
      return;
    }

    try {
      progress.start();
      const signer = await getProvisersAndSigners(true);
      const cryptoDevsContract = new ethers.Contract(
        NFTContarctAddress,
        abi,
        signer
      );

      const txn = await cryptoDevsContract.presaleMint({
        value: ethers.utils.parseEther("0.02"),
        gasLimit: 500000, //0.0005 gwei
      });
      await txn.wait();

      setPresaleStarted(true);

      //get the total updated tpken minted from contract
      getTotalTokensMinted();
      progress.finish();
    } catch (error) {
      console.error(error);
      progress.finish();
    }
  };

  const publicMint = async () => {
    if (isOwner) {
      alert("Owner cant mint from contract address.");
      rerturn;
    }

    try {
      const signer = await getProvisersAndSigners(true);
      const cryptoDevsContract = new ethers.Contract(
        NFTContarctAddress,
        abi,
        signer
      );

      const txn = await cryptoDevsContract.mint({
        value: ethers.utils.parseEther("0.04"),
      });
      await txn.wait();

      setPresaleStarted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getOwner = async () => {
    try {
      const signer = await getProvisersAndSigners(true);
      const cryptoDevsContract = new ethers.Contract(
        NFTContarctAddress,
        abi,
        signer
      );

      const owner = await cryptoDevsContract.owner();
      const signerAddress = await signer.getAddress();

      if (owner.toLowerCase() === signerAddress.toLowerCase()) {
        setIsOwner(true);
        console.log("admin");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //get the presale ended detail
  const isPresaleEnded = async () => {
    try {
      const provider = await getProvisersAndSigners();
      const cryptoDevsContract = new ethers.Contract(
        NFTContarctAddress,
        abi,
        provider
      );

      //return timestamp in secs
      const presaleEndTime = await cryptoDevsContract.preSaleEnded();
      const currentTimeInSeconds = Date.now() / 1000; //Date.now() milliseconds --> we need sec

      const hasEnded = presaleEndTime.lt(Math.floor(currentTimeInSeconds));
      if (hasEnded) {
        setPresaleEnded(true);
      } else {
        setPresaleEnded(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // only Owner of contarct
  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProvisersAndSigners();
      const cryptoDevsContract = new ethers.Contract(
        NFTContarctAddress,
        abi,
        provider
      );

      const isPresaleStarted = await cryptoDevsContract.NFTstate();
      // console.log("inside check presale starrted", isPresaleStarted); //it returms with 0,1,2
      if (state[isPresaleStarted] === "preSaleStarted") {
        setPresaleStarted(true);
        console.log("presale started");
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  //only owner
  const startPresale = async () => {
    try {
      progress.start();
      const signer = await getProvisersAndSigners(true);
      const cryptoDevsContract = new ethers.Contract(
        NFTContarctAddress,
        abi,
        signer
      );

      const txn = await cryptoDevsContract.startPresale();
      await txn.wait();

      setPresaleStarted(true);
      progress.finish();
    } catch (error) {
      console.error(error);
      progress.finish();
    }
  };

  const ConnectWallet = async () => {
    try {
      await getProvisersAndSigners();
    } catch (error) {
      console.error(error);
    }
  };

  const onPagLoadActions = async () => {
    await ConnectWallet();
    await getOwner();
    await getTotalTokensMinted();
    const presaleStarted = await checkIfPresaleStarted();
    // console.log("presale started", presaleStarted);
    if (presaleStarted) {
      await isPresaleEnded();
    }

    setInterval(async () => {
      await getTotalTokensMinted();
    }, 5000);

    setInterval(async () => {
      const presaleStarted = await checkIfPresaleStarted();

      if (presaleStarted) await isPresaleEnded();
    }, 5000);
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby", // optional
        providerOptions: {}, // required
        disableInjectedProvider: false,
      });
      onPagLoadActions();
    }
  }, []);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button className="rounded-full h-16 bg-rose-500 text-white px-5 py-3 text-base font-bold hover:scale-105 transition duration-150 ease-out hover:text-white hover:bg-rose-500">
          Connect Wallet
        </button>
      );
    }

    if (isOwner && !presaleStarted) {
      return (
        <button
          onClick={startPresale}
          className="rounded-full h-16 bg-rose-500 text-white px-5 py-3 text-base font-bold hover:scale-105 transition duration-150 ease-out hover:text-white hover:bg-rose-500"
        >
          Start Presale
        </button>
      );
    }

    if (!presaleStarted) {
      console.log("presale");
      return (
        <button
          disabled
          className="rounded-md h-16 first:h-16 bg-rose-500 text-white px-5 py-3 text-base font-bold ease-out disabled:bg-gray-400"
        >
          Pre sale has not yet started. Please come back later!
        </button>
      );
    }

    if (presaleStarted && !presaleEnded) {
      //allow whitelist user to mint
      return (
        <button
          onClick={presaleMint}
          className="rounded-full h-16 bg-rose-500 text-white px-5 py-3 text-base font-bold hover:scale-105 transition duration-150 ease-out hover:text-white hover:bg-rose-500"
        >
          Mint NFT (0.2 ETH)
        </button>
      );
    }

    if (presaleEnded) {
      //allow other userr to  mint
      return (
        <button
          onClick={publicMint}
          className="rounded-full h-16 bg-rose-500 text-white px-5 py-3 text-base font-bold hover:scale-105 transition duration-150 ease-out hover:text-white hover:bg-rose-500"
        >
          Mint NFT (0.4 ETH)
        </button>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta property="og:title" content="Whitelist" key="title" />
      </Head>

      <div className="min-h-[90vh] grid grid-cols-10">
        <div className="col-span-4 flex flex-col justify-center items-center bg-gradient-to-br from-cyan-800 to-rose-500">
          <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-purple-500 p-2">
            <Image
              className="rounded-xl"
              src={coverImage}
              width={300}
              height={300}
              alt="Dev"
            />
          </div>
          <div className="mt-2 flex flex-col items-center space-y-1 justify-center">
            <h1 className="font-bold text-white text-3xl">CRYPTO Apes</h1>
            <p className="text-white text-sm font-base">
              A collection of useless Apes who want to some timepass.
            </p>
          </div>
        </div>

        {/* right side */}
        <div className="flex flex-1 flex-col col-span-6">
          <div className="flex flex-col p-12">
            <header className="flex items-center justify-between">
              <h1 className="text-xl font-extralight">
                The{" "}
                <span className="font-extrabold underline decoration-pink-600/50 ">
                  CRYPTO DEVS
                </span>{" "}
                NFT Market Place
              </h1>

              <button className="rounded-full bg-rose-500  px-5 py-3 text-white text-base font-bold hover:scale-105 transition duration-150 ease-out hover:text-white hover:bg-rose-300">
                {walletConnected ? "Logout" : "Connect Wallet"}
              </button>
            </header>

            <hr className="mt-2 border " />
            <div className="flex flex-col  min-h-[70vh] justify-between">
              <div className="flex flex-col items-center justify-center flex-1 ">
                <Image
                  className="rounded-xl"
                  src={contenImage}
                  width={500}
                  height={200}
                  alt="Dev"
                />
                <p className="text-3xl p-2 font-extrabold text-gray-600 ">
                  {" "}
                  Its an NFT collection for developers in Crypto | NFT Drop.
                </p>
                <p className="text-lg mt-2 font-medium text-green-600">
                  {" "}
                  {tokenIdsMinted}/20 have been minted
                </p>
              </div>
              {renderButton()}
            </div>
          </div>
        </div>
      </div>

      <footer className="flex justify-center mt-10 text-gray-500">
        Made with &#10084; by Aayush
      </footer>
    </div>
  );
}
