import _ from 'lodash';
import React from 'react';
import {CardListContainer, Header} from 'components';
import {RouteComponentProps} from 'react-router-dom';
import {getMessages} from 'redux/modules/message/messageModule';

type Props = RouteComponentProps<{id: string; name: string}>;

function Profile({match}: Props) {
  return (
    <>
      <Header name="PROFILE" label={match.params.name} userId={match.params.id ?? ''} />
      <CardListContainer
        loadMessagesAction={getMessages}
        userId={match.params.id ?? ''}
        emptyCta="This user doesn`t have any messages posted."
      />
    </>
  );
}

export default Profile;
