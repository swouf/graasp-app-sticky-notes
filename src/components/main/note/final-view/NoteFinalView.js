import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FinalViewHeader from './FinalViewHeader';
import FinalViewDescription from './FinalViewDescription';
import FinalViewFooter from './FinalViewFooter';
import {
  patchAppInstanceResource,
  updateNotePosition,
} from '../../../../actions';

const useStyles = makeStyles(() => ({
  noteContainer: {
    width: '15%',
    position: 'absolute',
    padding: '1%',
    boxShadow: '5px 5px 7px rgba(33,33,33,.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'move',
  },
}));

const NoteFinalView = ({ note, id, userId, newPageX, newPageY }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // destructure note properties
  const {
    windowDimensions,
    position,
    color,
    title,
    description,
    minimized,
    rotation,
  } = note;
  const { innerHeight, innerWidth } = windowDimensions;
  const { pageX, pageY } = position;

  const [showActions, setShowActions] = useState(false);
  // grabDeltaX/Y captures the distance between the point we grabbed a div (note) and its top left
  // (this happens in onDragStart below)
  // when we update the final position of the note (finalPageX/Y), we adjust for this distance
  // (see the note above onDragStart below for further details)
  const [grabDeltaX, setGrabDeltaX] = useState(0);
  const [grabDeltaY, setGrabDeltaY] = useState(0);

  // default drag behavior is: (1) you grab div (the sticky note) in e.g. bottom right and begin dragging it,
  // (2) the point where you drop it becomes the *top left* of the div.
  // this is counterintuitive and visually unappealing
  // instead, we would expect the place where we drop the div to be the bottom right of the div (where we grabbed it)
  // hence, when drag starts, we calculate the distance between current top left of div ('origin') and the point we grabbed it
  // when we update the position in onDragEnd, we adjust for this distance to generate the expected effect
  const onDragStart = (event) => {
    const noteGrabbedX = event.pageX;
    const noteGrabbedY = event.pageY;
    const distanceBetweenGrabAndOriginX = pageX - noteGrabbedX;
    const distanceBetweenGrabAndOriginY = pageY - noteGrabbedY;
    setGrabDeltaX(distanceBetweenGrabAndOriginX);
    setGrabDeltaY(distanceBetweenGrabAndOriginY);
  };

  const onDragEnd = () => {
    const finalPageX = newPageX + grabDeltaX;
    const finalPageY = newPageY + grabDeltaY;
    const updatedNote = {
      data: {
        color,
        title,
        description,
        rotation,
        minimized,
        windowDimensions: { innerHeight, innerWidth },
        position: {
          pageX: finalPageX,
          pageY: finalPageY,
        },
      },
      _id: id,
    };
    dispatch(patchAppInstanceResource({ id, data: updatedNote.data }));
    dispatch(updateNotePosition(updatedNote));
  };

  return (
    <div
      className={classes.noteContainer}
      onClick={(event) => event.stopPropagation()}
      onMouseOver={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        top: `${(pageY / innerHeight) * 100}%`,
        left: `${(pageX / innerWidth) * 100}%`,
        background: color,
        transform: `rotate(${rotation}deg)`,
        height: `${minimized ? '10%' : '20%'}`,
      }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable
    >
      <FinalViewHeader
        title={title}
        description={description}
        color={color}
        showActions={showActions}
        id={id}
      />
      {!minimized && <FinalViewDescription description={description} />}
      <FinalViewFooter id={id} userId={userId} />
    </div>
  );
};

NoteFinalView.propTypes = {
  note: PropTypes.shape({
    windowDimensions: PropTypes.shape({
      innerHeight: PropTypes.number.isRequired,
      innerWidth: PropTypes.number.isRequired,
    }),
    position: PropTypes.shape({
      pageX: PropTypes.number.isRequired,
      pageY: PropTypes.number.isRequired,
    }),
    color: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    rotation: PropTypes.number.isRequired,
    minimized: PropTypes.bool.isRequired,
  }).isRequired,
  id: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  userId: PropTypes.string,
  newPageX: PropTypes.number,
  newPageY: PropTypes.number,
};

NoteFinalView.defaultProps = {
  userId: null,
  newPageX: null,
  newPageY: null,
};

export default NoteFinalView;
