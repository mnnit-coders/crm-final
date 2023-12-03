import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/CampaignStats.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { ProgressBar, MarkerBar, DeltaBar, CategoryBar } from "@tremor/react";
import AdminLayout from '../Components/AdminLayout.jsx';

import { getCampaignStatistics } from '../Utils/Requests/reports.requests';
import { toast } from 'react-toastify';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE00'];

const DonutChart = ({ data }) => {

  const chartData = {
      labels: data.map(entry => entry.label),
      datasets: [
        {
          data: data.map(entry => entry.value),
          backgroundColor: data.map(entry => entry.color),
          hoverBackgroundColor: data.map(entry => entry.color),
        },
      ],
    };

  return (
    <PieChart width={270} height={200}>
      <Pie
        data={data}
        cx={150}
        cy={100}
        outerRadius={60}
        fill="#8884d8"
        dataKey="value"
        label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
            const RADIAN = Math.PI / 180;
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
            return (
              <text
                x={x}
                y={y}
                fill={COLORS[index % COLORS.length]}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={13}
                style={{ fontWeight: 'bold' }}
              >
                {data[index].name}
              </text>
            );
          }}
        >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}

        
      </Pie>
    </PieChart>
  );
};




const LeadDistributionBlock = ({ name, values, colors, labels }) => (
  <div className="distribution-entry">
    <div className="person-name" style={{width:'20%'}}>{name}</div>
    <div className="distribution-chart">
      <div className="category-bar" style={{width:'100%'}}>
        {values && colors && labels && values.map((value, valueIndex) => (
          <div
            key={valueIndex}
            className="category-bar-item"
            style={{
              width: `${value}%`,
              backgroundColor: colors[valueIndex],
            }}
          >
            {value>0&&<span className="category-label" >{labels[valueIndex]}{value}%</span>}
          </div>
        ))}
      </div>
    </div>
  </div>
);



const CampaignStats = () => {

  const { id } = useParams();

  const [leadStatsData, setLeadStatsData] = useState([
    { name: 'Open', value: 0 },
    { name: 'In Progress', value: 0 },
    { name: 'Closed', value: 0 },
  ])
  const [inProgressData, setInProgressData] = useState([
    { name: 'Not Connected', value: 0 },
    { name: 'Follow-up', value: 0 },
  ])
  const [closedLeadsData, setClosedLeadsData] = useState([
    { name: 'Converted', value: 0 },
    { name: 'Lost', value: 0 },
    { name: 'Closed', value: 0 },
  ])
  const [leadDistribution,setLeadDistribution] = useState([])

  useEffect(() => {
    getCampaignStatistics(id)
      .then((res) => {
        // const stats = [];
        console.log('hello',res, res.statusCounts)
        setLeadStatsData([
          {name:'Open', value:res.statusCounts['Pending']},
          {name:'In Progress', value:res.statusCounts['Follow-up']+res.statusCounts['Not-Connected']},
          {name:'Closed', value:res.statusCounts['Lost']+res.statusCounts['Converted']}
        ])
        setInProgressData([
          { name: 'Follow-up', value: res.statusCounts['Follow-up'] },
          { name: 'Not Connected', value: res.statusCounts['Not-Connected'] },
        ])
        setClosedLeadsData([
          { name: 'Lost', value: res.statusCounts['Lost'] },
          { name: 'Converted', value: res.statusCounts['Converted'] },
        ])
        // res.assignedStatusCounts=Object.values(res.assignedStatusCounts)
        console.log(res.assignedStatusCounts);
        // setLeadDistribution(Object.keys(res.assignedStatusCounts).map((person, index)=>{
        //   console.log(person)
        //   return {
        //     name: person,
        //     values: [
        //       res.assignedCounts[person]['Pending'],
        //       res.assignedCounts[person]['Follow-up'],
        //       res.assignedCounts[person]['Not-Connected'],
        //       res.assignedCounts[person]['Lost'],
        //       res.assignedCounts[person]['Converted'],
        //     ],
        //     colors: ['#FF6384', '#36A2EB', '#FFCE00','#ABCDEF','#FEDCBA'],
        //     labels: ['Pending', 'Follow-up','Not-Connected','Lost','Converted'],
        //     markings: [50, 80],
        //   }
        // }))
        const arrayOfObjects = Object.keys(res.assignedStatusCounts).map((person, index) => {
          const personStatusCounts = res.assignedStatusCounts[person];
          const totalSum = Object.values(personStatusCounts).reduce((acc, value) => acc + value, 0);
          return {
            name: person,
            values: [
              parseFloat(((personStatusCounts['Pending']/totalSum)*100).toFixed(2)) || 0,
              parseFloat(((personStatusCounts['Follow-up']/totalSum)*100).toFixed(2)) || 0,
              parseFloat(((personStatusCounts['Not-Connected']/totalSum)*100).toFixed(2)) || 0,
              parseFloat(((personStatusCounts['Lost']/totalSum)*100).toFixed(2)) || 0,
              parseFloat(((personStatusCounts['Converted']/totalSum)*100).toFixed(2)) || 0
            ],
            colors: ['#FF6384', '#36A2EB', '#FFCE00', '#ABCDEF', '#FEDCBA'],
            labels: ['Pending', 'Follow-up', 'Not-Connected', 'Lost', 'Converted'],
            markings: [50, 80],
          };
        });
        
        // Now arrayOfObjects contains the mapped array
        // console.log(arrayOfObjects);
        setLeadDistribution(arrayOfObjects)
        // console.log(leadDistribution);
      })
      .catch((err) => {
        console.log("Got Error")
        console.log(err);
      });
  },[])

  const leadDistributionData = [
    {
      name: 'Person 1',
      values: [40, 30, 10,10,10], // Open: 40%, Follow-up: 30%, Not Connected: 20%
      colors: ['#FF6384', '#36A2EB', '#FFCE00', '#ABCDEF', '#FEDCBA'],
      labels: ['Pending', 'Follow-up', 'Not-Connected', 'Lost', 'Converted'], // Labels for each category
      markings: [50, 80],
    },

    {
      name: 'Person 2',
      values: [10, 50, 40], // Open: 10%, Follow-up: 50%, Not Connected: 40%
      colors: ['#FF6384', '#36A2EB', '#FFCE00'],
      labels: ["Open", "Follow-up", "Not Connected"], // Labels for each category
      markings: [50, 80],
    },
    // Add more distribution data objects as needed
  ];

  return (
    <div className="campaign-stats-container">

    {/* header */}
    <div className="header-camp">
        <div className="back-icon">
          <Link to="/admin/campaigns">
          <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <div className="campaign-name"> Campaign Name {id}</div>
        <Link to={`/admin/campaigns/edit/${id}`} className="edit-button">Edit Campaign</Link>
        {/* <Link to={`/admin/campaigns/edit/${id}`} className="edit-button">Edit Campaign</Link> */}
      </div>


      <div className="stats-block lead-stats">
        <h2 style={{ fontSize: '16px' }}>LEADS STATISTICS</h2>
        <div className="stats-row">
          {leadStatsData.map((entry) => (
            <div key={entry.name} className="stats-label">
              {entry.name}
            </div>
          ))}
        </div>
        <div className="stats-row">
          {leadStatsData.map((entry) => (
            <div key={entry.name} className="stats-value">
              {entry.value}
            </div>
          ))}
        </div>
        <div className="chart-column">
          <DonutChart data={leadStatsData} />
        </div>
      </div>

      {/* In-Progress Leads Block */}
      <div className="stats-block in-progress">
      <h2 style={{ fontSize: '16px' }}>IN-PROGRESS LEADS</h2>
        <div className="stats-row">
          {inProgressData.map((entry) => (
            <div key={entry.name} className="stats-label">
                {entry.name}
            </div>
          ))}
          </div>
          <div className="stats-row">
          {inProgressData.map((entry) => (
            <div key={entry.name} className="stats-value">
            {entry.value}
            </div>
          ))}
        </div>
        
        <div className="chart-column">
          <DonutChart data={inProgressData} />
        </div>
      </div>



      {/* Closed Leads Block */}
      <div className="stats-block closed-leads">
      <h2 style={{ fontSize: '16px' }}>CLOSED LEADS</h2>
        <div className="stats-row">
          {closedLeadsData.map((entry) => (
            <div key={entry.name} className="stats-label">
                {entry.name}
            </div>
          ))}
          </div>
          <div className="stats-row">
          {closedLeadsData.map((entry) => (
            <div key={entry.name} className="stats-value">
            {entry.value}
            </div>
          ))}
        </div>
        <div className="chart-column">
          <DonutChart data={closedLeadsData} />
        </div>
      </div>





      {/* Lead Distribution Stats Block */}
      <div className="stats-block-horizontal">
        <h4>LEADS DISTRIBUTION</h4>
      {leadDistribution.map(({ name, values, colors,labels }, index) => (
        <LeadDistributionBlock
          key={index}
          name={name}
          values={values}
          colors={colors}
          labels={labels}
        />
      ))}
    </div>




      
    </div>
  );
};

export default function() {
  return (
    <AdminLayout>
      <CampaignStats />
    </AdminLayout>
  );
}
