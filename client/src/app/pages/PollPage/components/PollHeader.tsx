import * as React from 'react';
import { Result } from 'features/polls/types';
import { Typography, Form, Input, Button, Select, Checkbox, Col, Progress, Row, Divider } from 'antd';
import styled from 'styled-components/macro';
import moment from "moment";

const { Title, Paragraph, Text, Link } = Typography;
 

interface Props {
  title: string;
  description: string;
  noMargin?: boolean;
  text: string;
  startDate: string;
  endDate: string;
  blockNumber: string;
}


const StyledDivider = styled(props => <Divider {...props}/>)`
	${props => props.noMargin && `
		margin-bottom: 0 !important;
		margin-top: 1.5em;
	`}
`

const PollHeader = ({title, description, noMargin, text, startDate, endDate, blockNumber} : Props) => (
	<>
		<Title level={4} style={{ margin: '0.5em 0 0.5em 0' }}>
			{title}
		</Title>
		<Paragraph  style={{ fontSize: 13 }}>
			{description}
		</Paragraph>
			<Row>
				<Col xs={{offset:1}} sm={{offset: 0}}>
					<Row>
						<Text strong style={{ fontSize: 12 }}>Start Date </Text> 
					</Row>
					<Row>
						<Text style={{ fontSize: 11 }}>
							{
								(startDate == null) ? "Based on Block Number" : (moment(startDate)
									.local()
									.format('DD/MM/YYYY HH:mm')
									)
							} 
						</Text>  
					</Row>
				</Col>
				<Col offset={1}>
					<Row>
						<Text strong style={{ fontSize: 12 }}>End Date </Text> 
					</Row>
					<Row>
						<Text style={{ fontSize: 11 }}>
							{
								moment(endDate)
									.local()
									.format('DD/MM/YYYY HH:mm')
							} 
						</Text>  
					</Row>
				</Col>
				<Col xs={{offset:1}}>
					<Row>
						<Text strong style={{ fontSize: 12 }}>Block Number </Text> 
					</Row>
					<Row>
						<Text style={{ fontSize: 11 }}>{blockNumber} </Text>  
					</Row>
				</Col>
			</Row>
		<StyledDivider orientation="left" noMargin> {text} </StyledDivider>
	</>
)


export default PollHeader;