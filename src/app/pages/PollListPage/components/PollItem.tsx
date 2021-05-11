import * as React from 'react';
import {Typography, List, Skeleton } from 'antd';
import {Poll} from 'features/polls/types'
const { Paragraph } = Typography;

interface Props {
  poll: Poll;
  onPollClick: Function;
}


const PollItem = ({poll, onPollClick} : Props) => {
  return (
   <List.Item
  >
    <Skeleton avatar title={false} loading={false} active>
      <List.Item.Meta
        title={ 
          // eslint-disable-next-line         
          <a 
            onClick={() => onPollClick(poll)}
          >  
            {poll.title}  
          </a>}
        description={ 
          <Paragraph style={ {color:"rgba(0, 0, 0, 0.45)"}} ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
            {poll.description}
          </Paragraph>
        }
      />
    </Skeleton>
  </List.Item>
)
}

export default PollItem