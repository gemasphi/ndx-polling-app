import React, {useState, useEffect} from 'react';
import { Switch, Route, BrowserRouter, Link, withRouter } from 'react-router-dom';
import { Grid, message, Popconfirm, Layout, Menu, Typography, Col, Row, Button, Divider} from 'antd';
import { InjectedConnector } from '@web3-react/injected-connector'
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useSelector, useDispatch } from 'react-redux';
import { usePollsSlice } from 'features/polls';
import { useEagerConnect, useInactiveListener, injected } from 'app/metamask'
import {
  WalletOutlined,
  PieChartOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';


const { Header, Footer, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

export const MenuItemWithIcon = styled(Menu.Item)`
	.anticon{
		vertical-align: 0.05em;
	}

`

export const ConditionalSider = styled(props => <Sider {...props}/>)`
  ${({ makeFixed }) => makeFixed && `
    z-index: 100;
    position: fixed;
    min-height: 100vh;
  `}

`

function ToConnectHeader({location}) {
	const dispatch = useDispatch();
	const { actions } = usePollsSlice();
	const context = useWeb3React<Web3Provider>()
  	const { connector, library, chainId, account, activate, deactivate, active, error } = context
  	const { t } = useTranslation();

	const routes = [
		{
			pathname: "/poll-create",
			text: t(...messages.newPoll()),
			icon: <PieChartOutlined />
		},
		{
			pathname: "/poll-list",
			text: t(...messages.pollList()),
			icon: <BarsOutlined />
		}
	]

	const screens = useBreakpoint();

	return (
		<ConditionalSider
	      breakpoint="lg"
	      collapsible
		  collapsedWidth={screens.xs ? '0' : '80px'}
		  makeFixed={screens.xs}
	    >
	      <Menu theme="dark" mode="inline"	selectedKeys={[location.pathname]}>
	    	{
			!(account) ?
				<MenuItemWithIcon onClick={() => activate(injected)} style={{  margin: '20px 0' }} icon={<WalletOutlined />}>
		  			{t(...messages.connectWallet())} 				
				</MenuItemWithIcon>

				:
				<MenuItemWithIcon  
					icon={<WalletOutlined />} 
					onClick={() => deactivate()}
					style={{margin: '20px 0', textOverflow: 'ellipsis',overflow: 'hidden', whiteSpace: 'nowrap' }}
				>
			  		{account}
				</MenuItemWithIcon>
			}	
			<Divider/>
			{
		  		routes.map((route) => (
		    		<MenuItemWithIcon key={route.pathname}  icon={route.icon}>
						<Link to={process.env.PUBLIC_URL + route.pathname}>
				        	{route.text} 
		      			</Link>
		    		</MenuItemWithIcon>
		  		))
		  	}
			
	      </Menu>
	    </ConditionalSider>
	);
}

const ConnectedHeader = withRouter(props => <ToConnectHeader {...props}/>)

export default ConnectedHeader