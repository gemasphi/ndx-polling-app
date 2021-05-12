import React, { useState, useEffect, ComponentProps } from 'react';
import { Typography, Form, Input, Button, Select, Checkbox, Col, Progress, Row, Divider } from 'antd';
import { PieChart } from 'react-minimal-pie-chart';

const { Title, Paragraph, Text, Link } = Typography;



const interpolate = (u, c1, c2) => (
  c1.map((a, i) => Math.floor((1-u) * a + u * c2[i]))
)

const pickRandom = (numberColors, c1, c2) => {
  const colors : any = []
  for (let i = 0; i < numberColors; i++){
    colors.push(interpolate((i+1)/numberColors, c1, c2))
  }

  return colors;
}


export interface Result{
    title: string;
    value: number;
    color: string;
}


const ResultPieChart = ({results, options, colors, arrayToRGB}) => {
  const [selected, setSelected] = useState<number | undefined>(0);
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const [formatedResults, setFormatedResults] = useState<Array<Result>>([]);

  useEffect(() => {
    const filteredResults = results.filter(result => Math.round(result.weights*100) != 0)
    const pickedColors = pickRandom(filteredResults.length, colors[0], colors[1]).map(c => arrayToRGB(c))

    const formatedResults = filteredResults.map((result, i) => ({
          title: options[result.option],
          value: result.weights,
          color: pickedColors[i]
      })
    )

    setFormatedResults(formatedResults)
  }, [results])


  const hover = formatedResults.map((result, i) => hovered === i ? {...result, color: 'grey'} : result)
  const lineWidth = 60;

  return (
    <PieChart
      style={{
        fontFamily:
          '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
        fontSize: '8px',
      }}
      data={hover}
      radius={PieChart.defaultProps.radius - 6}
      lineWidth={lineWidth}
      segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
      segmentsShift={(index) => (index === selected ? 6 : 1)}
      animate
      label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
      labelPosition={100 - lineWidth / 2}
      labelStyle={{
        fill: '#fff',
        opacity: 0.75,
        pointerEvents: 'none',
      }}
      onClick={(_, index) => {
        setSelected(index === selected ? undefined : index);
      }}
      onMouseOver={(_, index) => {
        setHovered(index);
      }}
      onMouseOut={() => {
        setHovered(undefined);
      }}
    />
  );
}


export default ResultPieChart;