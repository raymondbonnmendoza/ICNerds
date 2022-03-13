import { ICNerds } from "../../declarations/ICNerds"
import * as React from "react"
import { render } from "react-dom"
import Header from "./components/Header"
import NFTList from "./components/NFTList"
import Mint from "./components/Mint"
import { getAccountIdentifier } from "./utils/utils"
import { Principal } from '@dfinity/principal';

const App = () => {
  const destAccount = '23bd19a0bdc61e82caa140e4e8be6740185bf330b7f9d6cb6a7142d7d05e20cf'
  const mbctCanister = 'yeeiw-3qaaa-aaaah-qcvmq-cai'
  const whitelist = [
    mbctCanister,
  ]

  const mbctInterfaceFactory = ({ IDL }) => {
    const BlockHeight = IDL.Nat64;
    const AccountIdentifier = IDL.Text;
    const Memo = IDL.Nat64;
    const SubAccount = IDL.Vec(IDL.Nat8);
    const TimeStamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
    const ICPTs = IDL.Record ({
      e8s : IDL.Nat64, });
    const SendArgs = IDL.Record({
        'to' : AccountIdentifier,
        'fee' : ICPTs,
        'memo' : Memo,
        'from_subaccount' : IDL.Opt(SubAccount),
        'created_at_time' : IDL.Opt(TimeStamp),
        'amount' : ICPTs,
      });
    const AccountBalanceArgs = IDL.Record ({
      account: AccountIdentifier, });
    return IDL.Service({
      'account_balance_dfx' : IDL.Func([AccountBalanceArgs], [ICPTs], ['query']),
      'send_dfx' : IDL.Func([SendArgs], [BlockHeight]),
    });
  };

  const [nftList, setList] = React.useState([]);
  const [ledgerSize, setLedgerSize] = React.useState(0);
  const [connected, setConnected] = React.useState(false);
  const [principal, setPrincipal] = React.useState(null);
  const [mbctBalance, setMBCTBalance] = React.useState(0);
  const [owned, setOwned] = React.useState(0);

  async function nftOwned(p) {
    const size = await ICNerds.balanceOf(p);
    setOwned(Number(size));
  }

  async function totalSupply() {
    const supply = await ICNerds.totalSupply();
    setLedgerSize(Number(supply));
  }

  async function ownerTokenMetadata(p) {
    const tempList = await ICNerds.ownerTokenMetadata(p);
    setList(tempList.ok)
  }

  async function allTokenMetadata() {
    const tempList = await ICNerds.allTokenMetadata();
    setList(tempList.ok)
  }

  async function mintNFT() {
    const arr = []
    const principalId = Principal.fromText(principal)
    receivePayment()
    const newId = await ICNerds.mint(principalId, ledgerSize, []);
    if (newId != null) {
      nftOwned(principalId)
      totalSupply()
      const newNFT = {
        minted_at: newId,
        minted_by: principalId, 
        operator: arr, 
        owner: principalId, 
        properties: arr, 
        token_identifier: newId, 
        transferred_at: arr, 
        transferred_by: arr}
      setList([...nftList, newNFT])
    }
  }

  async function receivePayment() {
    const mbctActor = await window.ic.plug.createActor({
      canisterId: mbctCanister,
      interfaceFactory: mbctInterfaceFactory,
    });

    const f = 0.0001 * Math.pow(10, 8)
    const a = 999.9999 * Math.pow(10, 8)

    const bch = await mbctActor.send_dfx({
      to: destAccount, 
      fee: { e8s: f }, 
      memo: BigInt(0), 
      from_subaccount: [], 
      created_at_time: [], 
      amount: { e8s: a },
    });
    const principalId = Principal.fromText(principal)
    let account = getAccountIdentifier(principalId);
    const val = await mbctActor.account_balance_dfx({account});
    let val_icp = Number(val.e8s) / Math.pow(10, 8);
    setMBCTBalance(val_icp) 
  }

  async function login() {
    const hasAllowed = await window.ic.plug.requestConnect({
      whitelist,
    });
  
    if (hasAllowed) {
      setConnected(true)
      totalSupply()
      
      const principalId = await window.ic.plug.agent.getPrincipal();
      setPrincipal(principalId.toString())
    
      const mbctActor = await window.ic.plug.createActor({
        canisterId: mbctCanister,
        interfaceFactory: mbctInterfaceFactory,
      });

      let account = getAccountIdentifier(principalId);
      const val = await mbctActor.account_balance_dfx({account});
      let val_icp = Number(val.e8s) / Math.pow(10, 8);
      setMBCTBalance(val_icp) 
      nftOwned(principalId)
      ownerTokenMetadata(principalId)

    } else {
      setConnected(false)
    }
  }

  async function logout() {
    setPrincipal(null)
    setConnected(false)
  }

  const displayFull = (c) => {
    const principalId = Principal.fromText(principal)
    c ? allTokenMetadata() : ownerTokenMetadata(principalId)
  }

  return (
    <div className="container">
      <Header connected={connected} onConnect={connected ? logout : login} />
      {connected && <Mint onMint={mintNFT} totalMinted={Number(ledgerSize)} 
        principal={principal} mbctBalance={mbctBalance} owned={owned} 
        onCheck={displayFull} />}
      {connected ? (
        <NFTList nftList={nftList} principal={principal}/>
      ) : (
        'Please connect your Plug Wallet'
      )}  
    </div>
  )
}

render(<App />, document.getElementById("root"))
