import {CardListContainer, Header} from 'components';
import React from 'react';
import {RouteComponentProps} from 'react-router-dom';

function TagSearch({match}: RouteComponentProps<{tag: string}>) {
  const {tag} = match.params;
  return (
    <>
      <Header name="Messages found by tag" label={`#${tag}`}></Header>
      <CardListContainer tagName={tag} query="messagesByTag" userId={'*'} emptyCta="No messages found by this tag." />
    </>
  );
}

export default TagSearch;
