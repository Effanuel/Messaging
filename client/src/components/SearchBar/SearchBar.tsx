import React from 'react';
import {useHistory, useParams, useLocation} from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {CircularProgress, TextField} from '@material-ui/core';
import {useFirestoreConnect} from 'react-redux-firebase';
import {useReduxSelector} from 'redux/helpers/selectorHelper';

interface Option {
  id: string;
  name: string;
}

export const SearchBar = React.memo(() => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const [value, setValue] = React.useState('');

  const {firestoreUsers, firestoreLoading} = useReduxSelector('firestoreUsers', 'firestoreLoading');

  React.useEffect(() => {
    setValue('');
  }, [params]);

  useFirestoreConnect({
    collection: 'users',
    where: [
      ['username', '>=', value],
      ['username', '<', value + 'z'],
    ],
    limit: 5,
  });

  const onInputChange = React.useCallback((event: any, value: string) => {
    setValue(value ?? '');
  }, []);

  const getOptionSelected = React.useCallback((option: Option, value: Option) => option.id === value.id, []);

  const getOptionLabel = React.useCallback((option: Option) => option?.name, []);

  const options: Option[] = React.useMemo(() => {
    return !!firestoreUsers && Object.keys(firestoreUsers).length
      ? Object.keys(firestoreUsers)?.map((userId) => ({
          id: userId,
          name: firestoreUsers[userId]?.username,
        }))
      : [];
  }, [firestoreUsers]);

  const renderInput = React.useCallback(
    (params) => (
      <TextField
        {...params}
        label="Search for users..."
        value={value}
        InputLabelProps={{style: {color: 'white'}}}
        InputProps={{
          ...params.InputProps, //'#00796b' '#02b89b'
          style: {color: 'white', borderRadius: '5px', border: '1px solid #056c60'},
          endAdornment: (
            <>
              {firestoreLoading ? <CircularProgress color="inherit" size={10} /> : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    ),
    [firestoreLoading, value],
  );

  const renderOption = React.useCallback(
    ({name, id}: Option) => {
      const redirectToProfile = () => {
        const currentProfileId = location.pathname.split('/')?.[2];
        if (currentProfileId !== id) {
          history.push(`/user/${name}/${id}`);
        }
        setValue('');
      };
      return <div onClick={redirectToProfile}>{name}</div>;
    },
    [history, location],
  );

  return (
    <Autocomplete
      id="autocomplete"
      noOptionsText="No users found."
      onInputChange={onInputChange}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      options={options}
      loading={firestoreLoading}
      renderInput={renderInput}
      inputValue={value}
    />
  );
});
