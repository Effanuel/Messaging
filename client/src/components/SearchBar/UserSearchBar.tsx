import React from 'react';
import {useHistory, useParams, useLocation} from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {CircularProgress, makeStyles, TextField} from '@material-ui/core';
import {useReduxSelector} from 'redux/helpers/selectorHelper';

const useStyles = makeStyles((theme) => ({
  clearIndicator: {color: 'white'},
}));

interface Option {
  id: string;
  name: string;
}

export const UserSearchBar = React.memo(() => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const [value, setValue] = React.useState('');

  const {firestoreUsers, firestoreLoading, loggedInUserId} = useReduxSelector(
    'firestoreUsers',
    'firestoreLoading',
    'loggedInUserId',
  );

  React.useEffect(() => {
    setValue('');
  }, [params]);

  const onInputChange = React.useCallback((event: any, value: string) => {
    setValue(value ?? '');
  }, []);

  const getOptionSelected = React.useCallback((option: Option, value: Option) => option.id === value.id, []);

  const getOptionLabel = React.useCallback((option: Option) => option?.name, []);

  const options: Option[] = React.useMemo(() => {
    return !!firestoreUsers && Object.keys(firestoreUsers).length
      ? Object.keys(firestoreUsers)
          ?.map((userId) => ({
            id: userId,
            name: firestoreUsers[userId]?.username,
          }))
          .filter((user) => user.id !== loggedInUserId)
      : [];
  }, [firestoreUsers, loggedInUserId]);

  const renderInput = React.useCallback(
    (params) => (
      <TextField
        {...params}
        label="Search for users..."
        value={value}
        InputLabelProps={{style: {color: 'white', paddingLeft: 10}}}
        InputProps={{
          ...params.InputProps,
          style: {color: 'white', borderRadius: '5px', border: '1px solid #056c60', paddingLeft: 10},
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
        setValue('');
        if (currentProfileId !== id) {
          history.push(`/user/${name}/${id}`);
        }
      };
      return (
        <div style={{width: '100%'}} onClick={redirectToProfile}>
          {name}
        </div>
      );
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
      classes={{clearIndicator: classes.clearIndicator}}
    />
  );
});
