import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {red} from '@material-ui/core/colors';
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
  avatar: {backgroundColor: red[500]},
  input: {border: 'none', display: 'flex', color: 'rgba(255, 255, 255, 0.6)'},
  cardContent: {padding: 25},
  postButton: {display: 'flex', justifyContent: 'flex-end'},
}));

interface MessageCardProps {
  text?: string;
  username: string;
  createdAt: string;
  type: 'input' | 'card';
  onActionClick?: (e: any) => void;
  onTextChange?: (e: any) => void;
  value?: string;
}

export default function MessageCard(props: MessageCardProps) {
  const {username, createdAt, type, text, onActionClick, onTextChange, value} = props;
  const classes = useStyles();

  const renderAction = React.useMemo(() => {
    return type === 'input' ? (
      <Button variant="outlined" color="primary" onClick={onActionClick}>
        Post
      </Button>
    ) : null;
  }, [type, onActionClick]);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {username?.[0]}
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
          />
        ) : (
          <Typography className={classes.white} variant="body2" color="textSecondary" component="p">
            {text}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
