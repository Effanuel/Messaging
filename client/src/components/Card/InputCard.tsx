import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, TextField, Card, CardHeader, CardContent, Avatar} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 450,
    minWidth: 450,
    marginBottom: 15,
    backgroundColor: theme.palette.secondary.main,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  white: {color: 'rgba(255, 255, 255, 0.6)'},
  avatar: {backgroundColor: theme.palette.primary.main},
  input: {border: 'none', display: 'flex', color: 'rgba(255, 255, 255, 0.6)'},
  cardContent: {padding: 25},
  postButton: {display: 'flex', justifyContent: 'flex-end'},
  disabledButton: {backgroundColor: 'grey'},
}));

interface MessageCardProps {
  username: string;
  onActionClick: (e: any) => void;
  onTextChange: (e: InputChange) => void;
  value: string;
}

export const InputCard = React.memo(({username, onActionClick, onTextChange, value}: MessageCardProps) => {
  const classes = useStyles();

  const inputLimitReacted = (value?.length ?? 0) > 150;

  const renderAction = React.useMemo(
    () => (
      <Button
        variant="outlined"
        color="primary"
        onClick={onActionClick}
        disabled={!value || inputLimitReacted}
        classes={{disabled: classes.disabledButton}}
      >
        Post
      </Button>
    ),
    [onActionClick, value, classes.disabledButton, inputLimitReacted],
  );

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {username?.[0] ?? 'T'}
          </Avatar>
        }
        action={renderAction}
        title={username}
        titleTypographyProps={{className: classes.white}}
        subheaderTypographyProps={{className: classes.white}}
      />
      <CardContent className={classes.cardContent}>
        <TextField
          id="outlined-multiline-flexible"
          multiline
          maxRows={3}
          placeholder={'Enter a message'}
          className={classes.input}
          inputProps={{className: classes.input}}
          onChange={onTextChange}
          value={value}
          error={inputLimitReacted}
          label={inputLimitReacted && 'Input exceeds the limit of 150 characters.'}
        />
      </CardContent>
    </Card>
  );
});
