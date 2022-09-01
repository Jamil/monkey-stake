import { useEffect, useState } from "react";
import axios from "axios";
import { openContractCall } from '@stacks/connect'
import { BMContractDetails } from "../../pages";
import { uintCV } from "@stacks/transactions";

// const unstakeOptions = (mainnet, id) => ({
//   contractAddress: BMContractDetails.contractAddress,
//   contractName: BMContractDetails.contractName,
//   functionName: 'unstake',
//   functionArgs: [uintCV(id)],
//   network: mainnet,
//   appDetails: {
//     name: 'Bitcoin Monkeys',
//     icon: '',
//   },
//   onFinish: data => {
//     console.log("broadcast")
//   },
//   postConditions: []
// })

const stakeOptions = (mainnet, id, wallet) => ({
  contractAddress: BMContractDetails.contractAddress,
  contractName: BMContractDetails.contractName,
  functionName: 'stake',
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

const MonkeyItem = ({triggerUnstake, monkey, staked, network}) => {
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const res = await axios.get(`https://gamma.io/api/v1/collections/SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C.bitcoin-monkeys/${monkey}`);
      setData(res.data.data)
    })()
  }, [monkey])

  const triggerAction = () => {
    if(staked) {
      triggerUnstake()
      //openContractCall(unstakeOptions(network, monkey))
    } else {
      openContractCall(stakeOptions(network, monkey))
    }
  }

  const image = `https://images.gamma.io/ipfs/${data?.token_metadata?.image_url?.toString()?.slice(7)}`;
  const bgr = data?.nft_token_attributes?.filter(item => item.trait_type == "BGR (%)")?.[0]?.value || 0
  
  return data ? (
    <div style={{
      borderRadius: "6px",
      backgroundColor: "#242046",
      overflow: "hidden",
      width: "150px",
      marginBottom: "16px"
    }}>
      <img height="150" width="150" src={image}/>
      <div style={{display: "flex", flexDirection: "column", alignItems: "stretch"}}>
        <p style={{textAlign: "center", fontWeight: 500, lineHeight: 1.0, margin: "2px"}}>{data?.token_metadata?.name}</p>
        <p style={{marginBottom: 0, textAlign: "center", padding: "0px 6px"}}>BGR: {bgr*100}%</p>
        {staked && <button onClick={triggerAction} style={{margin: "6px"}}>Unstake</button>}
        {!staked && <button onClick={triggerAction} className="inverted" style={{margin: "6px"}}>Stake</button>}
      </div>
    </div>
  ) : (<></>)
}

export default MonkeyItem;