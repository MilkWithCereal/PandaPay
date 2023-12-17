const isPandaInstalled = window.panda.isReady;

const initProvider = () => {
  if ('panda' in window) {
    const provider = window.panda;

    if (provider?.isReady) {
      return provider;
    }
  }

  window.open('https://chromewebstore.google.com/detail/panda-wallet/mlbnicldlpdimbjdcncnklfempedeipj', '_blank');
};

var Iwantthisaddress = "";
var receiver = [];
var argumentset = "";

class pandawallet {
  getInfo() {
    return {
      id: 'Pandawallet',
      name: 'PandaPay',
      color1: '#2E2E2E', // pure red
      color2: '#89ABE3', // pure green
      color3: '#89ABE3', // pure blue

      menuIconURI: "https://i.ibb.co/g9gYKc6/DALL-E-2023-12-16-23-38-12-Design-a-sleek-minimalistic-logo-for-Panda-Pay-suitable-for-a-web-extensi.png",

      blocks: [
        {
          opcode: 'pandaconnect',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Connect to Panda'
        },
        {
          opcode: 'pandadisconnect',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Disconnect from Panda'
        },
        {
          opcode: 'pandahas',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Has Panda Wallet?',
          arguments: {
            STRING: {
              defaultValue: 'Value'
            }
          }
        },
        {
          opcode: 'pandahas2',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Is Panda Wallet Connected?'
        },
        {
          opcode: 'getaddresses',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Get Panda Wallet Address [addressthing]',
          arguments: {
            addressthing: {
              type: Scratch.ArgumentType.STRING,
              menu: 'addressthing'
            }
          }
        },
        {
          opcode: 'sendamoney',
          blockType: Scratch.BlockType.COMMAND,
          text: 'send [muns] BSV to [target]',
          arguments: {
            muns: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0'
            },
            target: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'address'
            }
          }
        },
        {
          opcode: 'sendamoremoney',
          blockType: Scratch.BlockType.COMMAND,
          text: 'send to multiple addresses: main: [muns1], [target1] royalty: [muns2], [target2], Extra: [muns3], [target3]',
          arguments: {
            muns1: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0'
            },
            target1: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Main Address'
            },
            muns2: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0'
            },
            target2: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Royalty Address'
            },
            muns3: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: '0'
            },
            target3: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Extra Address'
            }
          }
        },
      ],
      menus: {
        addressthing: {
          acceptReporters: true,
          items: ['all', 'bsv', 'ordinals', 'identity']
        }
      }
    };
  }

  pandahas() {
    return isPandaInstalled;
  }

  pandahas2() {
    const wallet = initProvider();
    return wallet.isConnected();
  }

  pandaconnect() {
    const wallet = initProvider();
    wallet.connect();
  }

  getaddresses(args) {
    Iwantthisaddress = args.addressthing.toLowerCase();
    return getaddressesasync(Iwantthisaddress);
  }

  pandadisconnect() {
    const wallet = initProvider();
    wallet.disconnect();
  }

  sendamoney(args) {
    let one = args.muns;
    let two = args.target;
    sendamoney_outside(one, two);
  }

  sendamoremoney(args) {
    let one = args.muns1;
    let two = args.target1;
    let three = args.muns2;
    let four = args.target2;
    let five = args.muns3;
    let six = args.target3;
    sendamoney_outside_multi(one, two, three, four, five, six);
  }
}

async function getaddressesasync(Iwantthisaddress) {
  const wallet = initProvider();
  try {
    const { bsvAddress, ordAddress, identityAddress } = await wallet.getAddresses();
    console.log(bsvAddress);
    console.log(ordAddress);
    console.log(identityAddress);

    let transfer = new Array(bsvAddress, ordAddress, identityAddress);
    receiver = JSON.stringify(transfer);

    // Use === for comparison
    if (Iwantthisaddress === "bsv") {
      return bsvAddress;
    }
    if (Iwantthisaddress === "ordinals") {
      return ordAddress;
    }
    if (Iwantthisaddress === "identity") {
      return identityAddress;
    }
    if (Iwantthisaddress === "all") {
      return receiver;
    }
    // ...
  } catch (err) {
    console.log(err);
    return null; // Return a default value or handle the error appropriately
  }
}

async function sendamoney_outside(one, two) {
  const wallet = initProvider();
  const paymentParams = [
    {
      satoshis: parseFloat(one),
      address: two,
    },
  ];

  try {
    const exchangeRate = await getexchangerate(one); // Replace "bsv" with the appropriate argument
    console.log("Exchange Rate:", exchangeRate);
    const { txid, rawtx } = await wallet.sendBsv(paymentParams);
    console.log(txid);
    // f2fc518036d96c956c30b995b4b0a70d6008b4b7ef666f7c913b2a79ab57d679
  } catch (err) {
    console.log(err);
  }
}

async function sendamoney_outside_multi(one, two, three, four, five, six) {
  const wallet = initProvider();
  const paymentParams = [
    {
      satoshis: parseFloat(one),
      address: two,
    },
    {
      satoshis: parseFloat(three),
      address: four,
    },
    {
      satoshis: parseFloat(five),
      address: six,
    },
  ];

  try {
    const exchangeRate1 = await getexchangerate(one); // Replace "bsv" with the appropriate argument
    console.log("Exchange Rate 1:", exchangeRate1);
    const exchangeRate2 = await getexchangerate(three); // Replace "bsv" with the appropriate argument
    console.log("Exchange Rate 2:", exchangeRate2);
    const exchangeRate3 = await getexchangerate(five); // Replace "bsv" with the appropriate argument
    console.log("Exchange Rate 3:", exchangeRate3);
    const { txid, rawtx } = await wallet.sendBsv(paymentParams);
    console.log(txid);
    // f2fc518036d96c956c30b995b4b0a70d6008b4b7ef666f7c913b2a79ab57d679
  } catch (err) {
    console.log(err);
  }
}

async function getexchangerate(exch) {
  const wallet = initProvider(); // see "Detecting the Provider"
  try {
    console.log("Attempting to get exchange rate for:", exch);
    const rate = await wallet.getExchangeRate(exch);
    console.log("Exchange rate:", rate);
    return rate;
  } catch (err) {
    console.error("Error getting exchange rate:", err);
    return null;
  }
}

Scratch.extensions.register(new pandawallet());
