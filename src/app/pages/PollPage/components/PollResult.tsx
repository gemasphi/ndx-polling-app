import * as React from 'react';
import { Typography, Col, Progress, Row } from 'antd';

const { Text } = Typography;

interface Props {
  optionText: string;
  weights: number;
  numVotes: number;
  colors: Array<Array<number>>;
  arrayToRGB: Function;
}


const PollResult = ({optionText, weights, numVotes, colors, arrayToRGB} : Props) => (
	<Row>
		<Col span={24}>
			<Row>
				<Col flex="auto">
					<Text strong>
						{optionText}
					</Text>
				</Col>
  				<Col flex="none" style={{ fontSize: 12 }}>
    				{numVotes} NDX
  				</Col>
			</Row>
		</Col>
		<Col span={24}>
			<Progress 
				strokeColor={{
		        '0%': arrayToRGB(colors[0]),
		        '100%': arrayToRGB(colors[1]),
 				 }}
  				percent={Math.round(100*weights)} 
  			/>
		</Col>
	</Row>
)


export default PollResult;