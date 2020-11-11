import _ from 'lodash';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import {useFirestoreConnect} from 'react-redux-firebase';
import {useHistory} from 'react-router-dom';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import './SearchBar.css';

interface Suggestion {
  id: string;
  name: string;
}

const getSuggestionValue = ({name}: Suggestion) => name;

const initialState = {value: '', suggestions: []};

function SearchBar() {
  const history = useHistory();

  const [state, setState] = React.useState(initialState);

  const {firestoreUsers} = useReduxSelector('firestoreUsers');

  const getSuggestions = React.useCallback(
    (value: string) => {
      const inputLength = value.trim().toLowerCase().length;

      return inputLength !== 0 && Object.keys(firestoreUsers)?.length
        ? Object.keys(firestoreUsers)?.map((userId: string) => ({
            id: userId,
            name: firestoreUsers[userId]?.username,
          }))
        : [];
    },
    [firestoreUsers],
  );

  const renderSuggestion = React.useCallback(
    ({id, name}: Suggestion) => {
      const onClick = () => {
        history.push(`/user/${id}`);
      };

      return <div onClick={onClick}>{name}</div>;
    },
    [history],
  );

  // eslint-disable-next-line
  const debouncedSearchTerm = React.useMemo(
    _.throttle(() => state.value, 250),
    [state.value],
  );

  useFirestoreConnect({
    collection: 'users',
    where: [
      ['username', '>=', debouncedSearchTerm],
      ['username', '<', debouncedSearchTerm + 'z'],
    ],
    limit: 5,
  });

  const onChange = React.useCallback((event: any, {newValue}: any) => {
    setState((prevState) => ({...prevState, value: newValue}));
  }, []);

  const onSuggestionsFetchRequested = React.useCallback(
    ({value}: {value: string}) => {
      setState((prevState) => ({...prevState, suggestions: getSuggestions(value) as any}));
    },
    [getSuggestions],
  );

  const onSuggestionsClearRequested = React.useCallback(() => {
    setState(initialState);
  }, []);

  const inputProps = React.useMemo(() => ({placeholder: 'Search users...', value: state.value, onChange}), [
    onChange,
    state.value,
  ]);

  return (
    <Autosuggest
      suggestions={state.suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
}

export {SearchBar};
