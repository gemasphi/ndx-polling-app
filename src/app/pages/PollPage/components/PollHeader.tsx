import * as React from 'react';
import { Typography, Col, Row, Divider } from 'antd';
import styled from 'styled-components/macro';
import moment from "moment";
import { useTranslation } from 'react-i18next';
import { messages } from 'app/messages';

const { Title, Paragraph, Text } = Typography;
 

interface Props {
  title: string;
  description: string;
  noMargin?: boolean;
  text: string;
  startDate: string;
  endDate: string;
  blockNumber: string;
}


const StyledDivider = styled(props => {
	const {noMargin, ...orginalProps } = props

	return <Divider {...orginalProps}/>
})`
	${({ noMargin }) => noMargin && `
		margin-bottom: 0 !important;
		margin-top: 1.5em;
	`}
`

const PollHeader = ({title, description, noMargin, text, startDate, endDate, blockNumber} : Props) => {
	const { t } = useTranslation();

	return (
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
						<Text strong style={{ fontSize: 12 }}>{t(...messages.startDate())}</Text> 
					</Row>
					<Row>
						<Text style={{ fontSize: 11 }}>
							{
								(startDate == null) ? t(...messages.pollStarts()) : (moment(startDate)
									.local()
									.format('DD/MM/YYYY HH:mm')
									)
							} 
						</Text>  
					</Row>
				</Col>
				<Col offset={1}>
					<Row>
						<Text strong style={{ fontSize: 12 }}>{t(...messages.endDate())}</Text> 
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
						<Text strong style={{ fontSize: 12 }}>{t(...messages.blockNumber())}</Text> 
					</Row>
					<Row>
						<Text style={{ fontSize: 11 }}>
							{
								(blockNumber == null) ? t(...messages.pollStarts()) : blockNumber  
							}
						</Text>  
					</Row>
				</Col>
			</Row>
		<StyledDivider orientation="left" noMargin> {text} </StyledDivider>
	</>
	);
}


export default PollHeader;