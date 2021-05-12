import { InjectedConnector } from '@web3-react/injected-connector'
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePollsSlice } from 'features/polls';

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })
export function useEagerConnect() {
  const { activate, active, account} = useWeb3React()
  const dispatch = useDispatch();
  const { actions } = usePollsSlice();
  const [tried, setTried] = useState(false)
  
  useEffect(() => {
    dispatch(actions.setConnectingWallet(true))
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
          dispatch(actions.setConnectingWallet(false))
        })
        //dispatch(actions.setConnectingWallet(false))
      } else {
        setTried(true)
        dispatch(actions.setConnectingWallet(false))
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      dispatch(actions.setWallet(account))
      setTried(true)
      dispatch(actions.setConnectingWallet(false))
    }

  
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate, account } = useWeb3React()
  const dispatch = useDispatch();
  const { actions } = usePollsSlice();

  useEffect(() => {
    if (active == false){
      dispatch(actions.setWallet(undefined))
    }
  }, [active])

  useEffect(() => {
    dispatch(actions.setWallet(account))
  }, [account])

  useEffect((): any => {
    const { ethereum } = window as any
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event")
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Hansdssdling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          dispatch(actions.setConnectingWallet(true))
          activate(injected).then(() => {
            dispatch(actions.setWallet(accounts[0]))
            dispatch(actions.setConnectingWallet(false))
            })
        } else {
          dispatch(actions.setWallet(undefined))
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(injected)
      }

      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect)
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }
  }, [active, error, suppress, activate, account])
}
