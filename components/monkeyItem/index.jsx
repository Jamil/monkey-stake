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

const MonkeyItem = ({monkeyData, triggerUnstake, staked, network}) => {
  const { token_metadata, nft_token_attributes, token_id } = monkeyData;

  const triggerAction = () => {
    if(staked) {
      triggerUnstake()
    } else {
      openContractCall(stakeOptions(network, token_id))
    }
  }

  const image = `https://images.gamma.io/ipfs/${token_metadata.image_url.toString().slice(7)}`;
  const bgr = nft_token_attributes.filter(item => item.trait_type == "BGR (%)")[0].value || 0
  
  return (
    <div style={{
      borderRadius: "6px",
      backgroundColor: "#242046",
      overflow: "hidden",
      width: "150px",
      marginBottom: "16px"
    }}>
      <img height="150" width="150" src={image}/>
      <div style={{display: "flex", flexDirection: "column", alignItems: "stretch"}}>
        <p style={{textAlign: "center", fontWeight: 500, lineHeight: 1.0, margin: "2px"}}>{token_metadata.name}</p>
        <p style={{marginBottom: 0, textAlign: "center", padding: "0px 6px"}}>BGR: {~~(bgr*100)}%</p>
        {staked && <button onClick={triggerAction} style={{margin: "6px"}}>Unstake</button>}
        {!staked && <button onClick={triggerAction} className="inverted" style={{margin: "6px"}}>Stake</button>}
      </div>
    </div>
  )
}

export default MonkeyItem;