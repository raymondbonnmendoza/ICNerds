import React from 'react'

const NFT = ({ nft, principal }) => {
    
  return (
    <div className='nft'>
        <img src={(Number(nft.token_identifier) + 1).toString() + ".png"} />
        <p>#{Number(nft.token_identifier) + 1}</p>
        <p>Owner: {(nft.owner.toString() == principal) ? "You" : nft.owner.toString()}</p>
    </div>
  )
}
//       <h3>{nft.art}</h3>

export default NFT