import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Layout, Menu} from 'antd';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { injected } from 'app/metamask'
import {
  WalletOutlined,
  PieChartOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';


const { Sider } = Layout;
const { useBreakpoint } = Grid;

export const MenuItemWithIcon = styled(Menu.Item)`
	.anticon{
		vertical-align: 0.05em;
	}

`

export const ConditionalSider = styled(props =>{ 
	const {makeFixed, ...originalProps} = props
	return <Sider {...originalProps}/>
})`
  ${({ makeFixed }) => makeFixed && `
    z-index: 100;
    position: fixed;
    min-height: 100vh;
  `}

`

function ToConnectHeader({location}) {
	const context = useWeb3React<Web3Provider>()
  	const { account, activate, deactivate } = context
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
			<Menu.Divider style={{margin: "24px 0", backgroundColor: "rgba(0, 0, 0, 0.06)"}}/>
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