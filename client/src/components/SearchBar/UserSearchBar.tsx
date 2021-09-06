import React from 'react';
import {useHistory, useParams, useLocation} from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {CircularProgress, makeStyles, TextField} from '@material-ui/core';
import {useDebouncedEffect} from 'redux/helpers/hooks';
import {useDispatch, useSelector} from 'react-redux';
import {getUsers} from 'redux/modules/user/userModule';
import {AppState} from 'redux/models/state';

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
  const dispatch = useDispatch();

  const [searchFilter, setSearchFilter] = React.useState('');

  const users = useSelector((state: AppState) => state.user.users);
  const loading = useSelector((state: AppState) => state.user.loading);
  const userId = useSelector((state: AppState) => state.auth.id);

  React.useEffect(() => {
    setSearchFilter('');
  }, [params]);

  useDebouncedEffect(() => void dispatch(getUsers({searchFilter})), 300, [dispatch, searchFilter]);

  const onInputChange = React.useCallback((event: any, value: string) => setSearchFilter(value ?? ''), []);

  const getOptionSelected = React.useCallback((option: Option, value: Option) => option.id === value.id, []);

  const getOptionLabel = React.useCallback((option: Option) => option?.name, []);

  const options: Option[] = React.useMemo(
    () =>
      !!users?.length
        ? users
            .map((user) => ({id: user.id, name: user.username})) //
            .filter((user) => user.id !== userId)
        : [],
    [users, userId],
  );

  const renderInput = React.useCallback(
    (params) => (
      <TextField
        {...params}
        label="Search for users..."
        value={searchFilter}
        InputLabelProps={{style: {color: 'white', paddingLeft: 10}}}
        InputProps={{
          ...params.InputProps,
          style: {color: 'white', borderRadius: '5px', border: '1px solid #056c60', paddingLeft: 10},
          endAdornment: (
            <>
              {loading ? <CircularProgress color="inherit" size={10} /> : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    ),
    [loading, searchFilter],
  );

  const renderOption = React.useCallback(
    ({name, id}: Option) => {
      const redirectToProfile = () => {
        const currentProfileId = location.pathname.split('/')?.[2];
        setSearchFilter('');
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
      loading={loading}
      renderInput={renderInput}
      inputValue={searchFilter}
      classes={{clearIndicator: classes.clearIndicator}}
    />
  );
});
