import React from 'react'

const Mint = ({ onMint, totalMinted, principal, mbctBalance, owned, onCheck }) => {
  const [fullCollection, setFullCollection] = React.useState(false)
  
  const onSubmit = (e) => {
    e.preventDefault()
    onMint()
  }

  const onChange = (e) => {
    setFullCollection(e.currentTarget.checked)
    onCheck(e.currentTarget.checked)
  }

   return (
    <form className='add-form' onSubmit={onSubmit}>
        <div className='form-control'>
            <label>Principal: {principal}</label>
            <br></br>
            <label>Your ICNerds Minted: {owned}/3</label>
            <label>MBCT Balance: {mbctBalance}</label>
            <br></br>
            <label>Total ICNerds Minted: {totalMinted}/11</label>
            <label>Mint Price: 1000 MBCT</label>
            <br></br>
            <label>You can hold up to 3 ICNerds per wallet</label>
            <br></br>
        </div>
        {(owned < 3 && totalMinted < 11 && mbctBalance > 1000) ? (
          <input type='submit' value='MINT' className='btn btn-block' /> 
        ) : ('')}
        <div className='form-control form-control-check'>
            <label>Full Collection</label>
            <input
                type='checkbox'
                value={fullCollection}
                onChange={onChange}
            />
        </div>
    </form>
  )
}

export default Mint