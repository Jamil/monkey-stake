import React from 'react';

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

const lessImages = images.slice(0, 12)

const Home = () => {
  

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
              </div>
              <div id="description-right">
                <ul style={{
                  listStyle: "none",
                  display: "flex",
                  flexWrap: "wrap",
                  padding: 0
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
                <div style={{
                  display: "flex",
                  alignItems: "center"
                }}>
                  <h3 style={{
                    margin: "0px",
                    marginRight: "16px"
                  }}>SPK7...F3CF</h3><button>Disconnect</button>
                </div>
              </div>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "16px"
            }}>
              <h2 className='stake-progress-text'>90% Bitcoin Monkeys Staked</h2>
              <h2 className='stake-progress-text'>2260/2500</h2>
            </div>
            <div id="stake-progress">
              <div style={{flex: 2260}}></div>
              <div style={{flex: 2500 - 2260}}></div>
            </div>
            <div>
              <div>
                <h3>Lifetime $BANANAS earned</h3>
                <div>
                  <p>672.136</p>
                  <img/>
                </div>
              </div>
              <div>
                <h3>$BANANAS held in wallet</h3>
                <div>
                  <p>449.175</p>
                  <img/>
                </div>
              </div>
              <div>
                <h3>Current Harvest Pool</h3>
                <div>
                  <p>57.136</p>
                  <img/>
                  <button className='cta'>Harvest</button>
                </div>
                <h4>Earning 6.7 $BANANA/Day</h4>
              </div>
            </div>
            <div>
              <div>
                <p>No Monkeys to stake</p>
                <button>Buy on Byzantion</button>
              </div>
              <div>
                <p>3 Monkeys staked</p>
              </div>
            </div>
          </div>
        </div>
        <div id="bottom-section">
          <div style={{
            flex: 1,
            paddingRight: "24px"
          }}>
            <h2>What is Bitcoin Monkey Staking?</h2>
            <p>To earn BANANA, Monkeys will need to be Staked. Each of the 2500 Monkey's will earn BANANA at a certain Banana Generation Rate (BGR). This will be based on the total of the following:</p>
            <p><b>Baseline BGR:</b> 2 BANANA gained every 24 hours, assuming 144 blocks per day (all Monkeys have the baseline BGR rate)</p>
            <p><b>Bonus BGR:</b> A bonus percentage on top of the baseline BGR will be applicable to certain Monkey traits. With BANANA as our backbone utility token for the ecosystem, there are still plenty of treasures in The Jungle to uncover with Bitcoin Monkeys! And so, the legend of the Monkeys continues...</p>
            <h3>How much does Staking cost?</h3>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;