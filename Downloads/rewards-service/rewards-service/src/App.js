import sampleData from './data';
import './App.css';
import React, { useState, useEffect, Fragment } from 'react';


function App() {
  const [customerRewardData, setCustomerRewardData] = useState({});
  const [rewardsPoints, setRewardsPoints] = useState({});
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    setCustomerRewardData({ ...sampleData });
    setCustomers([...Object.keys(sampleData)]);
  }, []);


  const customerSelect = (v) => {
    setSelectedCustomer(v);
    let customerData = customerRewardData[v];

    let monthTransactions = {
      1: {
        amounts: [],
        points: 0,
      },
      2: {
        amounts: [],
        points: 0,
      },
      3: {
        amounts: [],
        points: 0,
      },
    };


    for (let i = 0; i < customerData.length; i++) {
      let month = new Date(customerData[i]['date']);
      if (month.getMonth() + 1 == 1 || month.getMonth() + 1 == 2 || month.getMonth() + 1 == 3) {
        monthTransactions[month.getMonth() + 1]['amounts'].push(customerData[i]['amount']);
      }
    }

    for (let key in monthTransactions) {
      let total_monthly_points = 0;
      for (let i = 0; i < monthTransactions[key]['amounts'].length; i++) {
        let p = monthTransactions[key]['amounts'][i];

        total_monthly_points += computeRewardPoints(p);
      }
      console.log(total_monthly_points);
      monthTransactions[key]['points'] = total_monthly_points;
    }
    console.log(monthTransactions);
    setRewardsPoints({ ...monthTransactions });
    setCustomerTransactions([...customerData]);
  };

  return (
    <div style={{
      marginTop: "10px",
      marginBottom: "40px",
      fontSize: "25px",
    }}>
      <h1 style={{ textAlign: "center" }}>Retail Rewards</h1>
      <div className="select-style">
        <select onChange={e => customerSelect(e.target.value)} value={selectedCustomer} >
          <option value="" disabled>Select Customer</option>
          {customers.map((item, index) => {
            return (
              <option key={index} value={item}> {item} </option>
            );
          })}
        </select>
      </div>
      {Object.keys(rewardsPoints).length > 0 &&
        <Fragment>
          <h4>Customer Transactions Overview</h4>
          {customerTransactions.length > 0 ?
            <table className="customers" align='center'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {customerTransactions.map((item, index) => {
                  return <tr key={index}>
                    <td>{item["date"]}</td>
                    <td>{item["amount"]}</td>
                    <td>{computeRewardPoints(item["amount"])}</td>
                  </tr>
                })}
              </tbody>
            </table>
            : <div>No transactions were found</div>}
        </Fragment>
      }
    </ div >
  );
}

export default App;

function computeRewardPoints(amount) {
  let rewardsPoints = 0;
  if (amount >=50 && amount < 100) {
    rewardsPoints = 1 * (amount - 50);
  }
  else if (amount >= 100) {
    rewardsPoints = 1 * (amount - 50) + 1 * (amount - 100);
  }
  return rewardsPoints;
}