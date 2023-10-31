
import Chart from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { parse, evaluate } from 'mathjs';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartAnnotation from 'chartjs-plugin-annotation';




const Index = () => {
  const [equation, setEquation] = useState('x');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [ax,setAx]=useState([]);

  const plugins = [ChartAnnotation];
  
  const createVerticalLineAnnotations = (xValues) => {
    return xValues.map((x) => ({
      type: 'line',
      mode: 'vertical',
      scaleID: 'x-axis-0',
      value: x,
      borderColor: 'red', // Color of the vertical line
      borderWidth: 1,
    }));
  };


  const calculateData = () => {
    const newLabels = [];
    const newData = [];
    const newax=[];

    try {
      const parsedEquation = parse(equation);
      const compiledEquation = parsedEquation.compile();
      for (let x = xMin; x <= xMax; x += 0.1) {
        newLabels.push(x.toFixed(1));
        const yValue = compiledEquation.evaluate({ x });
        newData.push(yValue);
        newax.push(x);
      }
      setLabels(newLabels);
      setData(newData);
      setAx(newax);
    } catch (error) {
      console.error('Error evaluating equation:', error);
      setLabels([]);
      setData([]);
      setAx([]);
    }
  };

  useEffect(() => {
    calculateData();
    for(var i=0;i<ax.length;i++){
        console.log(ax[i]);
    }
  }, [equation, xMin, xMax]);
  const xValuesToAnnotate = [0, 2, 4];

  const chartData = {
    labels,
    datasets: [
      {
        label:'',
        data,
        fill: false,
        borderColor: 'rgb(0,0,255)',
        borderWidth: 1,
        tension: 1,
        pointRadius:1,
      },{
        label: '',
      data: labels.map(() => 0),
      fill: false,
      borderColor: 'red',
      borderWidth: 1,
      borderDash: [5, 5],
      pointRadius:0,
      },
      {
        label: 'y=0',
        ax,
        fill: false,
        borderColor: 'blue',
        borderWidth: 1,
        borderDash: [5, 5],
       },
    ],
  };
  
  const chartOptions = {
    plugins: {
      annotation: {
        drawTime: 'beforeDatasetsDraw', // Draw annotations before datasets
        annotations: {
          verticalLines: xValuesToAnnotate.map((x) => ({
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: x,
            borderColor: 'red', // Color of the vertical line
            borderWidth: 1,
          })),
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'x-axis',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 1,
          beginAtZero: true,
        },
      },
      y: {
        title: {
          display: true,
          text: 'y-axis',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          stepSize: 1,
          beginAtZero: true,
        },
      },
    },
  };

  const handleEquationChange = (e) => {
    setEquation(e.target.value);
  };

  const handleXMinChange = (e) => {
    setXMin(parseFloat(e.target.value));
  };

  const handleXMaxChange = (e) => {
    setXMax(parseFloat(e.target.value));
  };

  return (
    <div>
      <h1>Math Visualization</h1>
      <div>
        <label>Equation (in terms of x): </label>
        <input type="text" value={equation} onChange={handleEquationChange} />
      </div>
      <div>
        <label>Range in x: </label>
        <input type="number" value={xMin} onChange={handleXMinChange} />
        <span> to </span>
        <input type="number" value={xMax} onChange={handleXMaxChange} />
      </div>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <Line data={chartData}  options={chartOptions} plugins={plugins}/>
      </div>
    </div>
  );
};

export default Index;



















