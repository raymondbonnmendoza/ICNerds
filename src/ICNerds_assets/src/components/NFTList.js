import React from 'react'
import NFT from './NFT'

const NFTList = ({ nftList, principal }) => {
    return (
    <>
        {nftList.map(nft => (
            <NFT key={Number(nft.token_identifier)} nft={nft} principal={principal}/>
        ))}
    </>
  )
}

// {nftList.filter(n => n.id < ledgerSize).map(nft => (

export default NFTList
