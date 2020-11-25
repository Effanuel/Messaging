import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {Typography, Card, CardHeader, CardContent, Avatar, IconButton} from '@material-ui/core';

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
  cardContent: {padding: 25},
}));

interface MessageCardProps {
  text?: string;
  username: string;
  id?: string;
  createdAt: string;
  isLiked?: boolean;
  likes?: number;
  onLikePost: (messageId: string) => void;
  onUnlikePost: (messageId: string) => void;
}

export const MessageCard = React.memo((props: MessageCardProps) => {
  const {username, createdAt, text, onLikePost, onUnlikePost, id, isLiked, likes} = props;
  const classes = useStyles();

  const onLike = React.useCallback(() => {
    if (id) {
      onLikePost(id);
    }
  }, [id, onLikePost]);

  const onUnlike = React.useCallback(() => {
    if (id) {
      onUnlikePost(id);
    }
  }, [id, onUnlikePost]);

  const renderAction = React.useMemo(
    () => (
      <>
        <span style={{color: 'grey'}}>{likes ?? 0}</span>
        <IconButton
          onClick={isLiked ? onUnlike : onLike}
          color={isLiked ? 'primary' : undefined}
          aria-label="like-post"
        >
          <FavoriteIcon />
        </IconButton>
      </>
    ),
    [onLike, onUnlike, isLiked, likes],
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
        <Typography className={classes.white} variant="body2" color="textSecondary" component="p">
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
});
