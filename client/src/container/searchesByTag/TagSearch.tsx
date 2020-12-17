import {CardListContainer, Header} from 'components';
import React from 'react';
import {RouteComponentProps} from 'react-router-dom';

function TagSearch({match}: RouteComponentProps<{tag: string}>) {
  const {tag} = match.params;

  const uniqueTags = [...new Set(tag.split(','))];
  const searchBy = uniqueTags.map((tagName) => `#${tagName}`).join(' ');
  return (
    <>
      <Header name="Messages found by tags" label={searchBy}></Header>
      <CardListContainer
        tagNames={uniqueTags}
        query="messagesByTag"
        userId={'*'}
        emptyCta="No messages found by this tag."
      />
    </>
  );
}

export default TagSearch;
