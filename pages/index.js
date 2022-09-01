import React, { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect'
import axios from 'axios';
import { StacksMainnet } from '@stacks/network';
import { callReadOnlyFunction, ClarityType, cvToValue, uintCV } from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';
import MonkeyItem from '../components/monkeyItem';
import UnstakeModal from '../components/modal';

export const BMContractDetails = {
  contractAddress: "SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S",
  contractName: "bm-stake-v1"
}

export const MKContractDetails = {
  contractAddress: "SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S",
  contractName: "bm-stake-v1"
}

const images = [
  '/assets/monkeys/3.png',
  '/assets/monkeys/1.png',
  '/assets/monkeys/2.png',
  '/assets/monkeys/13.png',
  '/assets/monkeys/5.png',
  '/assets/monkeys/6.png',
  '/assets/monkeys/7.png',
  '/assets/monkeys/8.png',
  '/assets/monkeys/9.png',
  '/assets/monkeys/11.png',
  '/assets/monkeys/10.png',
  '/assets/monkeys/12.png',
  '/assets/monkeys/4.png',
  '/assets/monkeys/14.png',
  '/assets/monkeys/15.png',
]

const traitData = [
  {img: "/assets/traits/Crown.png", percent: 100},
  {img: "/assets/traits/Banana-Skin.png", percent: 50},
  {img: "/assets/traits/Banana-mouth.png", percent: 30},
  {img: "/assets/traits/Labcoat.png", percent: 25},
  {img: "/assets/traits/Leopard.png", percent: 16},
  {img: "/assets/traits/Money.png", percent: 15},
  {img: "/assets/traits/Party-Hat.png", percent: 14},
  {img: "/assets/traits/Laser-Eyes-Green.png", percent: 14},
  {img: "/assets/traits/Laser-Eyes-Red.png", percent: 14},
  {img: "/assets/traits/Gold-Teeth.png", percent: 14},
  {img: "/assets/traits/Diamond-Teeth.png", percent: 14},
  {img: "/assets/traits/Space-Suit.png", percent: 14},
  {img: "/assets/traits/Rainbow.png", percent: 14},
  {img: "/assets/traits/Space.png", percent: 14},
  {img: "/assets/traits/Gold.png", percent: 14},
  {img: "/assets/traits/Rainbow-monkey.png", percent: 14},
  {img: "/assets/traits/Magician-Hat.png", percent: 12},
  {img: "/assets/traits/Galaxy.png", percent: 12},
  {img: "/assets/traits/Viking-Helmet.png", percent: 10},
  {img: "/assets/traits/Pirate-Hat.png", percent: 10},
  {img: "/assets/traits/Sailor-Hat.png", percent: 10},
  {img: "/assets/traits/Army-Helmet.png", percent: 10},
  {img: "/assets/traits/Army-Vest.png", percent: 10},
  {img: "/assets/traits/Cyborg.png", percent: 10},
  {img: "/assets/traits/Bitcoin-Eyes.png", percent: 7},
  {img: "/assets/traits/Bitcoin-Tshirt.png", percent: 6},
  {img: "/assets/traits/Bitcoin-Cap.png", percent: 5},
  {img: "/assets/traits/Bloodshot.png", percent: 5},
  {img: "/assets/traits/Blind.png", percent: 5},
]

const options = (mainnet) => ({
  contractAddress: BMContractDetails.contractAddress,
  contractName: BMContractDetails.contractName,
  functionName: 'harvest',
  functionArgs: [],
  network: mainnet,
  appDetails: {
    name: 'Bitcoin Monkeys',
    icon: '',
  },
  onFinish: data => {
    console.log("broadcast")
  },
  postConditions: []
})

const MKTCOptions = (mainnet) => ({
  contractAddress: MKContractDetails.contractAddress,
  contractName: MKContractDetails.contractName,
  functionName: 'harvest',
  functionArgs: [],
  network: mainnet,
  appDetails: {
    name: 'Bitcoin Monkeys',
    icon: '',
  },
  onFinish: data => {
    console.log("broadcast")
  },
  postConditions: []
})

const unstakeBMOptoions = (mainnet, id) => ({
  contractAddress: BMContractDetails.contractAddress,
  contractName: BMContractDetails.contractName,
  functionName: 'unstake',
  functionArgs: [uintCV(id)],
  network: mainnet,
  appDetails: {
    name: 'Bitcoin Monkeys',
    icon: '',
  },
  onFinish: data => {
    console.log("broadcast")
  },
  postConditions: []
})


const appConfig = new AppConfig(['publish_data']);
const userSession = new UserSession({ appConfig });
const stacksNet = 'mainnet';

const Home = () => {
  const [auth, setAuth] = useState({
    login: false,
    wallet_id: "",
  })

  const [stakedAmount, setStakedAmount] = useState(0);
  const [lifetimeEarned, setLifetimeEarned] = useState(0);
  const [bananasHeld, setBananasHeld] = useState(0);
  const [BMCurrentPool, setBMCurrentPool] = useState(0);
  const [MKCurrentPool, setMKCurrentPool] = useState(0);
  const [earningAmount, setEarningAmount] = useState(0);

  const [stakedIds, setStakedIds] = useState([]);
  const [unstakedIds, setUnstakedIds] = useState([]);
  const [mainnet, setMainnet] = useState(new StacksMainnet());
  const [showUnstakeWarning, setShowUnstakeWarning] = useState(0);

  useEffect(() => {
    (async () => {
      if (userSession.isSignInPending()) {
        await userSession.handlePendingSignIn();
        const userData = userSession.loadUserData();

        setAuth({
          login: true,
          wallet_id: userData.profile.stxAddress[stacksNet]
        })
      } else if (userSession.isUserSignedIn()) {
        const userData = userSession.loadUserData();

        setAuth({
          login: true,
          wallet_id: userData.profile.stxAddress[stacksNet],
        })
      }
    })()
  }, [])

  const walletId = auth.wallet_id;

  const authenticated = () => {
    showConnect({
      appDetails: {
        name: 'Bitcoin Monkeys',
        icon: "https://cdn.discordapp.com/attachments/798985555546341376/884824197866618880/melbrot_12.png"
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setAuth({
          login: true,
          wallet_id: userData.profile.stxAddress[stacksNet]
        })
      },
      userSession: userSession,
    })
  }

  const disconnect = () => {
    setAuth({
      login: false,
      wallet_id: ""
    })
    userSession.signUserOut();
  }

  useEffect(() => {
    publicApiCalls();
    if(auth.login) {
      privateApiCalls();
    }
  }, [auth.login])

  const publicApiCalls = async () => {
    // Supposed to load staked total
    try {
      const options = {
        contractAddress: BMContractDetails.contractAddress,
        contractName: BMContractDetails.contractName,
        functionName: "get-number-staked",
        functionArgs: [],
        network: mainnet,
        senderAddress: BMContractDetails.contractAddress,
      };
  
      const result = await callReadOnlyFunction(options);
      setStakedAmount(parseInt(result.value))
    } catch (e) {
      console.error(e); 
    }
  }

  const privateApiCalls = async () => {
    const { data: walletContents } = await axios.get(`https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${walletId}/balances`)
    setBananasHeld(walletContents.fungible_tokens['SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-bananas::BANANA']?.balance || 0);

    try {
      const options = {
        contractAddress: BMContractDetails.contractAddress,
        contractName: BMContractDetails.contractName,
        functionName: "get-staked-ids",
        functionArgs: [principalCV(`${walletId}`)],
        network: mainnet,
        senderAddress: auth.wallet_id,
      };
  
      const result = await callReadOnlyFunction(options);
      
      if (result.type === ClarityType.List) {
        setStakedIds(result.list.map(i => parseInt(cvToValue(i))))
      } else if (result.type === ClarityType.ResponseErr) {
        throw new Error(`kv-store contract error: ${result.value.data}`);
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const { data: { nfts: unstaked } } = await axios.get(`https://api.gamma.io/nft-data-service/api/v1/nfts?owner=${walletId}&contractId=SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys`)
      setUnstakedIds(unstaked.map(u => u.tokenId));
    } catch (e) {
      console.error(e);
    }

    try {
      const options = {
        contractAddress: "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C",
        contractName: "btc-monkeys-staking",
        functionName: "check-staker",
        functionArgs: [principalCV(`${walletId}`)],
        network: mainnet,
        senderAddress: walletId,
      };
  
      const result = await callReadOnlyFunction(options);
      const { data } = result.value.value;
      const lifetime = parseInt(data['lifetime-points'].value);

      const options2 = {
        contractAddress: BMContractDetails.contractAddress,
        contractName: BMContractDetails.contractName,
        functionName: "get-lifetime-harvested",
        functionArgs: [principalCV(`${walletId}`)],
        network: mainnet,
        senderAddress: walletId,
      };
  
      const result2 = await callReadOnlyFunction(options2);
      setLifetimeEarned(parseInt(result2.value) + lifetime);
    } catch (e) {
      console.error(e);
    }

    try {
      const options = {
        contractAddress: BMContractDetails.contractAddress,
        contractName: BMContractDetails.contractName,
        functionName: "get-user-balance",
        functionArgs: [principalCV(`${walletId}`)],
        network: mainnet,
        senderAddress: walletId,
      };
  
      const result = await callReadOnlyFunction(options);
      
      if (result.type === ClarityType.UInt) {
        setBMCurrentPool(parseInt(result.value))
      } else if (result.type === ClarityType.ResponseErr) {
        throw new Error(`kv-store contract error: ${result.value.data}`);
      }
    } catch (e) {
      console.error(e);
    }
  
    try {
      const options = {
        contractAddress: MKContractDetails.contractAddress,
        contractName: MKContractDetails.contractName,
        functionName: "get-user-balance",
        functionArgs: [principalCV(`${walletId}`)],
        network: mainnet,
        senderAddress: walletId,
      };
  
      const result = await callReadOnlyFunction(options);
      
      if (result.type === ClarityType.UInt) {
        setMKCurrentPool(parseInt(result.value))
      } else if (result.type === ClarityType.ResponseErr) {
        throw new Error(`kv-store contract error: ${result.value.data}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const triggerUnstake = (id) => {
    setShowUnstakeWarning(id)
  }

  return (
    <div id="home">
      <div className="content">
        <div id="top-section">
          <div style={{
            maxWidth: "1145px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            padding: "30px 24px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between"
            }}>
              <div id="description-left">
                <img style={{
                  width: "230px"
                }} src='/assets/logo.png'/>
                <h3 id="banana-desc">BANANA sits at the core of the Bitcoin Monkey ecosystem. As the ecosystem grows, more utility will be added – increasing the utility of BANANA. However, there will only be a supply of 1,000,000 BANANA. Each monkey earns 1 BANANA per day.</h3>
                <div style={{
                  display: "flex"
                }}> 
                  <p id="stake-cta">Stake to earn BANANA tokens. <a id="question" href="#bottom-section">What is Staking?</a></p>
                </div>
                <div id='icon-row'>
                  <a target="_blank" href='https://discord.gg/CbsScbyCxs'><img src='/assets/discord.svg'/></a>
                  <a target="_blank" href='https://twitter.com/btcmonkeys'><img src='/assets/twitter.svg'/></a>
                  <a target="_blank" href='https://instagram.com/BTCMonkeys'><img src='/assets/instagram.svg'/></a>
                  <a target="_blank" href='https://bitcoinmonkeys.io/'><img src='/assets/website.svg'/></a>
                </div>
                <a id="buy-sell-link" href="https://gamma.io/collections/bitcoin-monkeys" target="_blank">Buy and Sell Bitcoin Monkeys on Gamma</a>
              </div>
              <div id="description-right">
                <ul style={{
                  listStyle: "none",
                  display: "flex",
                  flexWrap: "wrap",
                  padding: 0,
                  marginTop: 0
                }}>
                  {/** images **/}
                  {images.map(i => (
                    <li style={{width: "20%"}}>
                      <img style={{
                        maxWidth: "100%",
                        height: "auto",
                        display: "block"
                      }} src={i}/>
                    </li>
                  ))}
                </ul>
                <p style={{
                  fontSize: "12px"
                }}>*BANANA is a utility token used in the Bitcoin Monkeys ecosystem. It is NOT an investment and has NO economic value.</p>
                {auth.login && <div style={{
                  display: "flex",
                  alignItems: "center"
                }}>
                  <h3 style={{
                    margin: "0px",
                    marginRight: "16px"
                  }}>{walletId.slice(0, 4)}...{walletId.slice(walletId.length-4)}</h3><button onClick={() => disconnect()}>Disconnect</button>
                </div>}
              </div>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "48px"
            }}>
              <h2 className='stake-progress-text'>{~~(stakedAmount/25)}% Bitcoin Monkeys Staked</h2>
              <h2 className='stake-progress-text'>{stakedAmount}/2500</h2>
            </div>
            <div id="stake-progress">
              <div style={{flex: stakedAmount}}></div>
              <div style={{flex: 2500 - stakedAmount}}></div>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "24px",
            }}>
              <h2 className='stake-progress-text'>0% Monkey Kids Staked</h2>
              <h2 className='stake-progress-text'>0/2500</h2>
            </div>
            <div id="stake-progress">
              <div style={{flex: stakedAmount}}></div>
              <div style={{flex: 2500 - stakedAmount}}></div>
            </div>
            {auth.login && <div id="personal-stats-row">
              <div className='personal-stats-card'>
                <h3>Lifetime $BANANAS earned</h3>
                <div style={{display: "flex", alignItems: "center"}}>
                  <p>{~~(lifetimeEarned / 1000)/1000}</p>
                  <img src='/assets/banana.png'/>
                </div>
              </div>
              <div className='personal-stats-card'>
                <h3>$BANANAS held in wallet</h3>
                <div style={{display: "flex", alignItems: "center"}}>
                  <p>{~~(bananasHeld / 1000)/1000}</p>
                  <img src='/assets/banana.png'/>
                </div>
              </div>
              <div className='personal-stats-card'>
                <h3>Unclaimed Bananas</h3>
                <div style={{display: "flex", alignItems: "center"}}>
                  <p>{~~(BMCurrentPool / 1000)/1000}</p>
                  <img src='/assets/banana.png'/>
                  <button className='cta' onClick={() => openContractCall(options(mainnet))}>Harvest (BM)</button>
                </div>
                {/* <div style={{display: "flex", alignItems: "center", marginTop: "6px"}}>
                  <p>{~~(MKCurrentPool / 1000)/1000}</p>
                  <img src='/assets/banana.png'/>
                  <button className='cta' onClick={() => openContractCall(options(mainnet))}>Harvest (MKTC)</button>
                </div> */}
                <h4 style={{marginTop: "12px"}}>Earning {~~(earningAmount/1000)/10} $BANANA/Day</h4>
              </div>
            </div>}
            {auth.login && <div id="wallet-data-row">
              {unstakedIds.length > 0 ? (
                <div className='wallet-data-card'>
                  <h3>Monkeys you can stake</h3>
                  <div className='monkey-list'>
                    {unstakedIds.map(id => (
                      <MonkeyItem network={mainnet} staked={false} monkey={id}/>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='wallet-data-card'>
                  <h3>No Monkeys to stake</h3>
                  <a target="_blank" href='https://gamma.io/collections/bitcoin-monkeys'>
                    <button>Buy on Gamma</button>
                  </a>
                </div>
              )}
              <div className='wallet-data-card'>
                <h3>{stakedIds.length} Monkeys staked</h3>
                <div className='monkey-list'>
                  {unstakedIds.map(id => (
                    <MonkeyItem triggerUnstake={() => triggerUnstake(id)} network={mainnet} staked={true} monkey={id}/>
                  ))}
                </div>
              </div>
            </div>}
            {!auth.login && <div id="disconnected-wallet-card">
              <button className='pink' onClick={() => authenticated()}>Connect to Stake</button>
              <a href="https://gamma.io/collections/bitcoin-monkeys" target="_blank">
                <button>Buy on Gamma</button>
              </a>
            </div>}
          </div>
        </div>
        <div id="bgr-section">
          <h2>BANANA Generation Rate (BGR)</h2>
          <div id="columns">
            <div className="traitColumn">
              <h3>Bitcoin Monkeys</h3>
              <div id="traitGrid">
                {traitData.map(t => (
                  <div className='trait-item'>
                    <img className='trait-img' src={t.img}/>
                    <p>+{t.percent}%</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="traitColumn kids">
              <h3>Monkey Kids</h3>
              <div id="kidsTraitGrid">
                <p>COMING SOON</p>
              </div>
            </div>
          </div>
        </div>
        <div id="description">
          <div id="text-column">
            <h2 id="title">What is Bitcoin Monkey Staking?</h2>
            <p>To earn BANANA, Monkeys (both Bitcoin Monkeys and Monkey Kids Treehouse Club) will need to be Staked. Both collections will earn BANANA at a certain Banana Generation Rate (BGR), however Bitcoin Monkeys will have a far superior Banana Generation Rate than MKTC. BGR will be based on the total of the following:</p>
            <p><b>Baseline BGR (BM):</b> 1 BANANA gained every 24 hours, assuming 144 blocks per day (all Monkeys have the baseline BGR rate)</p>
            <p><b>Baseline BGR (MKTC):</b> 1 BANANA gained every 96 hours, assuming 144 blocks per day (all Monkey Kids have the baseline BGR rate)</p>
            <p><b>Bonus BGR:</b> A bonus percentage on top of the baseline BGR will be applicable to certain Bitcoin Monkey and Monkey Kids Treehouse Club traits. With BANANA as our backbone utility token for the ecosystem, there are still plenty of treasures in The Jungle to uncover within the Bitcoin Monkeys brand! And so, the legend of the Monkeys continues…</p>
            <h3 id="subtitle">How much does Staking cost?</h3>
            <p>Staking and Unstaking will be non custodial for both collections and will be FREE!</p>
            <h3 id="subtitle">Harvesting and Claiming $BANANA</h3>
            <p>Harvesting is the process of claiming and “minting” your $BANANA. Until $BANANA is harvested, it is NOT actually owned by you. You must Harvest your $BANANA to be able to claim them in your wallet. The Unclaimed $BANANA counter at the top of the page, shows you how much $BANANA you have the ability to Harvest.</p>
            <p>This Harvest process will now cost STX each time you need to harvest - this is different for both collections as per below.</p>
            <p><b>Bitcoin Monkeys:</b></p>
            <ul>
              <li>2 STX will be used to fund the continuous building, development and maintenance Bitcoin Monkey ecosystem.</li>
              <li>2 STX will be used to help fund the BANANA ecosystem, Monkey Store and other rewards.</li>
              <li>1 STX will be used to fund the endeavors of the community Jungle Club proposals.</li>
            </ul>
            <p><b>Monkey Kids Treehouse Club:</b></p>
            <ul>
              <li>1 STX will be used to fund the continuous building, development and maintenance Bitcoin Monkey ecosystem.</li>
              <li>1 STX will be used to help fund the BANANA ecosystem, Monkey Store and other rewards.</li>
              <li>0 STX will be used to fund the endeavors of the community Jungle Club proposals.</li>
            </ul>
            <p>Do note that if you transfer/sell a Bitcoin Monkey or MKTC that is staked, it will lose ALL the $BANANA it has accumulated. If you Unstake a Bitcoin Monkey or MKTC without Harvesting first, you will lose all the $BANANA that Monkey has accumulated. Hence it is very important to ensure you Harvest before you transfer/sell.</p>
          </div>
        </div>
      </div>
      <UnstakeModal show={!!showUnstakeWarning} onCancel={() => {
        setShowUnstakeWarning(undefined)
      }} onConfirm={() => {
        openContractCall(unstakeBMOptoions(mainnet, showUnstakeWarning))
        setShowUnstakeWarning(undefined)
      }}/>
    </div>
  )
}

export default Home;