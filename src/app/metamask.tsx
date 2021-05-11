import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core'
import {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
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
    if (active === false){
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
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
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
