import _ from 'lodash';
import React from 'react';
import {useFirestoreConnect} from 'react-redux-firebase';
import {CardList} from 'components/CardList/CardList';
import {RouteComponentProps} from 'react-router-dom';
import {useReduxSelector} from 'redux/helpers/selectorHelper';

interface Props extends RouteComponentProps<{id: string}> {
  a: string;
}

function Profile({match}: Props) {
  const {firestoreMessages} = useReduxSelector('firestoreMessages');

  useFirestoreConnect({
    collection: 'messages',
    where: ['userId', '==', match.params.id ?? ''],
    orderBy: ['createdAt', 'desc'],
  });

  return <CardList firestoreMessages={firestoreMessages} />;
}

export default Profile;
