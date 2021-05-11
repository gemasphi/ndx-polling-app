import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import {Result} from 'features/polls/types'


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


export interface formatedResult{
    title: string;
    value: number;
    color: string;
}

interface Props {
  results: Array<Result>;
  options: Array<string>;
  colors: Array<Array<number>>;
  arrayToRGB: Function;
}

const ResultPieChart = ({results, options, colors, arrayToRGB} : Props) => {
  const [selected, setSelected] = useState<number | undefined>(0);
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const [formatedResults, setFormatedResults] = useState<Array<formatedResult>>([]);

  useEffect(() => {
    const filteredResults = results.filter(result => Math.round(result.weights*100) !== 0)
    const pickedColors = pickRandom(filteredResults.length, colors[0], colors[1]).map(c => arrayToRGB(c))

    const formatedResults = filteredResults.map((result, i) => ({
          title: options[result.option],
          value: result.weights,
          color: pickedColors[i]
      })
    )

    setFormatedResults(formatedResults)
  }, [results, arrayToRGB, colors, options])


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