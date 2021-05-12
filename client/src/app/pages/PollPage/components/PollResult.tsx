import * as React from 'react';
import { Result } from 'features/polls/types';
import { Typography, Form, Input, Button, Select, Checkbox, Col, Progress, Row, Divider } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;


const PollResult = ({optionText, weights, numVotes, colors, arrayToRGB}) => (
	<Row>
		<Col span={24}>
			<Row>
				<Col flex="auto">
					<Text strong>
						{optionText}
					</Text>
				</Col>
  				<Col flex="none" style={{ fontSize: 12 }}>
    				{numVotes} Votes
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