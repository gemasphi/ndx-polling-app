import React, {useState, useEffect} from 'react';
import Box from "3box";
import { useSelector, useDispatch } from 'react-redux';
import { usePollsSlice } from 'features/polls';
import {
   selectWallet,
   selectConnectingDB,
 } from 'features/polls/selectors';

const BoxContext = React.createContext({
    box: null, 
    space: null, 
})

export function BoxDBProvider({children}){
  const [box, setBox] = useState<any>();
  const [space, setSpace] = useState<any>();
  const dispatch = useDispatch();
  const { actions } = usePollsSlice();
  const wallet = useSelector(selectWallet);
  const connectingDB = useSelector(selectConnectingDB);
  

   useEffect(()  => {
    async function loadBox() {
      dispatch(actions.setConnectingDB(true))
      const { ethereum } = window as any
      const accounts = await ethereum.enable();
      
      const box = await Box.create(ethereum)
      await box.auth(['ndx-polling'], {address: accounts[0]})
      const space = await box.openSpace('ndx-polling')
      await space.syncDone

      setBox(box)
      setSpace(space)
    }
    
    if (wallet !== undefined && !connectingDB){
      loadBox();
    }
  }, [wallet])

  useEffect(()  => {
    dispatch(actions.setConnectingDB(false))
    
    // Run this and check the console for filling up env.ts
    let createThread1 = false; 
    let createThread2 = false; 
    let deleteDB = false; 

    if(createThread1 && space != null){
      genesisPollThread(space)
    }

    if(createThread2 && space != null){
      genesisStartCondThread(space)
    }

    if (deleteDB && space != null){
      deleteThreadPosts(space)
    }

  }, [space])

  return <BoxContext.Provider value={{box, space}}> {children} </BoxContext.Provider>  
}

export function useBoxDB(){
  const boxDB = React.useContext(BoxContext);

  if (boxDB === undefined) {
    throw new Error('3box context undefined')
  }

  return boxDB
}

async function genesisPollThread(space) {
  const pollsThread = await space.joinThread('pollsStartCondition')
  console.log('Genesis Thread @ ' + pollsThread.address)
}

async function genesisStartCondThread(space) {
  const startCondThread = await space.joinThread('pollsStartCondition')
  console.log('Genesis Thread for startCondThread @ ' + startCondThread.address)
}

// The only one who can actually delete all posts is the thread moderator which by default is the one who created it.
async function deleteThreadPosts(space) {
  const pollsThread = await space.joinThread('polls')
  const existingPosts = await pollsThread.getPosts()
  for(const p of existingPosts){
    await pollsThread.deletePost(p['postId'])
  }
} 
