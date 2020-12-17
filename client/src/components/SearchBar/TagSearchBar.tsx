import {TextField} from '@material-ui/core';
import React from 'react';
import {useHistory} from 'react-router-dom';

function TagSearchBar() {
  const history = useHistory();
  const [value, setValue] = React.useState('');

  const onInputChange = React.useCallback(({target: {value}}) => {
    setValue(value ?? '');
  }, []);

  const searchByTag = React.useCallback(
    (event: any) => {
      const trimmedValue = value.replace(/\s+/g, '');
      if (event.key === 'Enter' && trimmedValue !== '') {
        event.preventDefault();
        const filter = value.trim().replace(/\s+|\//g, ',');
        history.push(`/searchByTag/${filter}`);
        setValue('');
      }
    },
    [history, value],
  );

  return (
    <div>
      <TextField
        style={{width: '100%'}}
        label="Search messages by tag..."
        onKeyPress={searchByTag}
        value={value}
        onChange={onInputChange}
        InputLabelProps={{style: {color: 'white', paddingLeft: 10}}}
        InputProps={{style: {color: 'white', borderRadius: '5px', border: '1px solid #056c60', paddingLeft: 10}}}
      />
    </div>
  );
}

export {TagSearchBar};
