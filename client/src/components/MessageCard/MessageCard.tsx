import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, TextField, Typography, Card, CardHeader, CardContent, Avatar} from '@material-ui/core';

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
  text?: string;
  username: string;
  createdAt: string;
  type: 'input' | 'card';
  onActionClick?: (e: any) => void;
  onTextChange?: (e: InputChange) => void;
  value?: string;
}

export default React.memo((props: MessageCardProps) => {
  const {username, createdAt, type, text, onActionClick, onTextChange, value} = props;
  const classes = useStyles();

  const inputLimitReacted = React.useMemo(() => (value?.length ?? 0) > 150, [value]);

  const renderAction = React.useMemo(
    () =>
      type === 'input' && (
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
    [type, onActionClick, value, classes.disabledButton, inputLimitReacted],
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
        subheader={createdAt}
        titleTypographyProps={{className: classes.white}}
        subheaderTypographyProps={{className: classes.white}}
      />
      <CardContent className={classes.cardContent}>
        {type === 'input' ? (
          <TextField
            id="outlined-multiline-flexible"
            multiline
            rowsMax={3}
            placeholder={'Enter a message'}
            className={classes.input}
            inputProps={{className: classes.input}}
            onChange={onTextChange}
            value={value}
            error={inputLimitReacted}
            label={inputLimitReacted && 'Input exceeds the limit of 150 characters.'}
          />
        ) : (
          <Typography className={classes.white} variant="body2" color="textSecondary" component="p">
            {text}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});
