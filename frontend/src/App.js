import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './styles.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [manager, setManager] = useState('');
  const [winner, setWinner] = useState('');

  // ABI and Contract Address
  const ABI = [ /* Paste your contract's ABI here */ ];
  const contractAddress = "0xYourContractAddressHere"; // Replace with deployed address

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      const lotteryContract = new web3.eth.Contract(ABI, contractAddress);
      setContract(lotteryContract);

      const mgr = await lotteryContract.methods.manager().call();
      setManager(mgr);

      const playersList = await lotteryContract.methods.players().call();
      setPlayers(playersList);

      const contractBalance = await web3.eth.getBalance(lotteryContract.options.address);
      setBalance(web3.utils.fromWei(contractBalance, 'ether'));
    };

    loadBlockchainData();
  }, []);

  const participate = async () => {
    try {
      await contract.methods.participate().send({
        from: account,
        value: Web3.utils.toWei('1', 'ether'),
      });
      alert('Participation successful!');
    } catch (err) {
      console.error(err.message);
      alert('Transaction failed.');
    }
  };

  const pickWinner = async () => {
    try {
      await contract.methods.pickWinner().send({ from: account });
      const winnerAddress = await contract.methods.winner().call();
      setWinner(winnerAddress);
      alert(`Winner picked: ${winnerAddress}`);
    } catch (err) {
      console.error(err.message);
      alert('Error picking winner.');
    }
  };

  return (
    <div className="container">
      <h1>Lottery DApp</h1>
      <p><strong>Manager:</strong> {manager}</p>
      <p><strong>Current Balance:</strong> {balance} ETH</p>
      <p><strong>Players:</strong> {players.join(', ')}</p>
      <p><strong>Winner:</strong> {winner}</p>

      <button onClick={participate}>Participate (1 ETH)</button>
      {account === manager && <button onClick={pickWinner}>Pick Winner</button>}
    </div>
  );
};

export default App;