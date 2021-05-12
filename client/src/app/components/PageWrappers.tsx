import * as React from 'react';
import {Grid, Layout, Menu, Typography, Col, Divider} from 'antd';
import styled from 'styled-components/macro';

const { Title } = Typography;
const { Content } = Layout;

const StyledContent = styled(props => <Content {...props}/>)`
${({ xs }) => xs ? `padding: 25px;` : `padding: 50px;`}`

export const BackgroundWrapper = styled.div`
  padding: 24px !important;
  background: #fff !important;
  border-radius: 7px !important;
`;


const { useBreakpoint } = Grid;

export const ResponsiveContent = (props) => {
  const screens = useBreakpoint();
  
  return <StyledContent {...props} {...screens}/>
} 

export const ResponsiveCol = (props) => {
 
  return <Col xs={24} sm={24} md={24} lg={16}> {props.children} </Col>
} 

export const DefaultPageWrapper = (props) => (
	<ResponsiveContent className="site-layout">
        <Title level={2}> {props.title} </Title>
           <ResponsiveCol>
              <BackgroundWrapper className="site-layout-background">
              	{props.children}
              </BackgroundWrapper>
           </ResponsiveCol>
	</ResponsiveContent>
);


