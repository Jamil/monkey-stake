import React, { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import axios from 'axios';
import { StacksMainnet } from '@stacks/network';
import { callReadOnlyFunction, ClarityType, cvToString, cvToValue, listCV } from '@stacks/transactions';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV';

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
  const [currentPool, setCurrentPool] = useState(0);
  const [earningAmount, setEarningAmount] = useState(0);

  const [stakedIds, setStakedIds] = useState([]);

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
    const { data: balances } = await axios.get("https://stacks-node-api.mainnet.stacks.co/extended/v1/address/SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-staking/balances")

    setStakedAmount(balances.non_fungible_tokens['SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys::bitcoin-monkeys'].count)
  }

  const privateApiCalls = async () => {
    const { data: walletContents } = await axios.get(`https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${walletId}/balances`)

    setBananasHeld(walletContents.fungible_tokens['SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.btc-monkeys-bananas::BANANA']?.balance || 0);

    try {
      const options = {
        contractAddress: "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C",
        contractName: "btc-monkeys-staking",
        functionName: "get-staked-nfts",
        functionArgs: [principalCV(`${walletId}`)],
        network: new StacksMainnet(),
        senderAddress: "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C",
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
                <h3 id="banana-desc">BANANA sits at the core of the Bitcoin Monkey ecosystem. As the ecosystem grows, more utility will be added – increasing the utility of BANANA. However, there will only be a supply of 1,000,000 BANANA. Each monkey earns 2 BANANA per day.</h3>
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
              marginTop: "16px"
            }}>
              <h2 className='stake-progress-text'>{~~(stakedAmount/25)}% Bitcoin Monkeys Staked</h2>
              <h2 className='stake-progress-text'>{stakedAmount}/2500</h2>
            </div>
            <div id="stake-progress">
              <div style={{flex: stakedAmount}}></div>
              <div style={{flex: 2500 - stakedAmount}}></div>
            </div>
            {auth.login && <div id="personal-stats-row">
              <div className='personal-stats-card'>
                <h3>Lifetime $BANANAS earned</h3>
                <div style={{display: "flex", alignItems: "center"}}>
                  <p>{lifetimeEarned}</p>
                  <img src='/assets/banana.png'/>
                </div>
              </div>
              <div className='personal-stats-card'>
                <h3>$BANANAS held in wallet</h3>
                <div style={{display: "flex", alignItems: "center"}}>
                  <p>{~~(bananasHeld / 10000)/100}</p>
                  <img src='/assets/banana.png'/>
                </div>
              </div>
              <div className='personal-stats-card'>
                <h3>Current Harvest Pool</h3>
                <div style={{display: "flex", alignItems: "center"}}>
                  <p>{currentPool}</p>
                  <img src='/assets/banana.png'/>
                  <button className='cta'>Harvest</button>
                </div>
                <h4>Earning {earningAmount} $BANANA/Day</h4>
              </div>
            </div>}
            {auth.login && <div id="wallet-data-row">
              <div className='wallet-data-card'>
                <h3>No Monkeys to stake</h3>
                <a target="_blank" href='https://gamma.io/collections/bitcoin-monkeys'>
                  <button>Buy on Gamma</button>
                </a>
              </div>
              <div className='wallet-data-card'>
                <h3>{stakedIds.length} Monkeys staked</h3>
                {stakedIds.map(id => (
                  <p>Bitcoin Monkey #{id}</p>
                ))}
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
        <div id="bottom-section">
          <div style={{
            flex: 1,
            paddingRight: "24px"
          }}>
            <h2 id="title">What is Bitcoin Monkey Staking?</h2>
            <p>To earn BANANA, Monkeys will need to be Staked. Each of the 2500 Monkey's will earn BANANA at a certain Banana Generation Rate (BGR). This will be based on the total of the following:</p>
            <p><b>Baseline BGR:</b> 2 BANANA gained every 24 hours, assuming 144 blocks per day (all Monkeys have the baseline BGR rate)</p>
            <p><b>Bonus BGR:</b> A bonus percentage on top of the baseline BGR will be applicable to certain Monkey traits. With BANANA as our backbone utility token for the ecosystem, there are still plenty of treasures in The Jungle to uncover with Bitcoin Monkeys! And so, the legend of the Monkeys continues...</p>
            <h3 id="subtitle">How much does Staking cost?</h3>
            <p>Staking/unstaking will cost a small fee of <b>5 STX</b> per Monkey. This is for a number of reasons:</p>
            <ul>
              <li>2 STX will be used to fund the continuous building, development and maintenance of the Staking &amp; BANANA ecosystem.</li>
              <li>2 STX will be used to help fund the BANANA ecosystem, Monkey Store and other rewards.</li>
              <li>1 STX will be used to fund the endeavors of the community Jungle Club proposals.</li>
            </ul>
            <p>However there will be no fee for unstaking your Monkeys if they are staked until all 1 million BANANA's have been depleted! Hence, rewarding you for holding and staking your Monkeys!</p>
          </div>
          <div id='bgrList'>
            <h2>BANANA Generation Rate (BGR)</h2>
            <div id="traitGrid">
              {traitData.map(t => (
                <div className='trait-item'>
                  <img className='trait-img' src={t.img}/>
                  <p>+{t.percent}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;