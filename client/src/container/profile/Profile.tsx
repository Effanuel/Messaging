import _ from 'lodash';
import React from 'react';
import {useFirestoreConnect} from 'react-redux-firebase';
import {CardList} from 'components';
import {RouteComponentProps} from 'react-router-dom';
import {useReduxSelector} from 'redux/helpers/selectorHelper';

type Props = RouteComponentProps<{id: string}>;

function Profile({match}: Props) {
  const {firestoreMessages} = useReduxSelector('firestoreMessages');

  useFirestoreConnect({
    collection: 'messages',
    where: ['userId', '==', match.params.id ?? ''],
    orderBy: ['createdAt', 'desc'],
  });

  return (
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      {firestoreMessages?.length ? (
        <CardList firestoreMessages={firestoreMessages} />
      ) : (
        <div style={{color: 'white'}}>This user doesn`t have any messages posted.</div>
      )}
    </div>
  );
}

export default Profile;
