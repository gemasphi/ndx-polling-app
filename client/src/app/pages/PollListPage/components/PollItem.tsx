import * as React from 'react';
import {Typography, List, Avatar, Button, Skeleton } from 'antd';
import { Link } from 'react-router-dom';

const { Paragraph, Text } = Typography;

const PollItem = ({poll, onPollClick}) => {
  const [ellipsis, setEllipsis] = React.useState(true);

  return (
   <List.Item
    //actions={[ <a onClick={() => onPollClick(poll)}> Open</a>]}
  >
    <Skeleton avatar title={false} loading={false} active>
      <List.Item.Meta
        /*avatar={
          <Avatar src="data:image/png;base64,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" />
		      
        }*/
        title={ <a onClick={() => onPollClick(poll)}>  {poll.title}  </a>}
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