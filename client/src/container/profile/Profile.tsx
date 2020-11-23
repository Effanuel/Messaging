import _ from 'lodash';
import React from 'react';
import {CardListContainer, Header} from 'components';
import {RouteComponentProps} from 'react-router-dom';

type Props = RouteComponentProps<{id: string; name: string}>;

function Profile({match}: Props) {
  return (
    <>
      <Header name="PROFILE" label={match.params.name} followerId={match.params.id ?? ''} />
      <CardListContainer userId={match.params.id ?? ''} emptyCta="This user doesn`t have any messages posted." />
    </>
  );
}

export default Profile;
