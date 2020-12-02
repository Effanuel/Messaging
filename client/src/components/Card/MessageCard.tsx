import React from 'react';
import {useHistory} from 'react-router-dom';
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
  avatar: {backgroundColor: theme.palette.primary.main, '&&&&:hover': {cursor: 'pointer'}},
  cardContent: {padding: 25},
  tag: {color: theme.palette.primary.main, '&:hover': {cursor: 'pointer'}},
}));

interface MessageCardProps {
  text?: string;
  username: string;
  id?: string;
  createdAt: string;
  isLiked?: boolean;
  likes?: number;
  userId: string;
  onLikePost: (messageId: string, userId: string) => void;
  onUnlikePost: (messageId: string, userId: string) => void;
}

export const MessageCard = React.memo((props: MessageCardProps) => {
  const {username, createdAt, text, onLikePost, onUnlikePost, id, isLiked, likes, userId} = props;
  const history = useHistory();
  const classes = useStyles();

  const onLike = React.useCallback(() => {
    if (id) onLikePost(id, userId);
  }, [id, onLikePost, userId]);

  const onUnlike = React.useCallback(() => {
    if (id) onUnlikePost(id, userId);
  }, [id, onUnlikePost, userId]);

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

  const searchByTag = React.useCallback(
    (tagName: string) => {
      history.push(`/searchByTag/${tagName.replace(/#/g, '')}`);
    },
    [history],
  );

  const goToUserProfile = React.useCallback(() => {
    history.push(`/user/${username}/${id}`);
  }, [history, username, id]);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar} onClick={goToUserProfile}>
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
          {(text ?? '').split(' ').map((word, index) => {
            return !word.match(/#/g) ? (
              `${word} `
            ) : (
              <span key={index} className={classes.tag} onClick={() => searchByTag(word)}>
                {`${word} `}
              </span>
            );
          })}
        </Typography>
      </CardContent>
    </Card>
  );
});
