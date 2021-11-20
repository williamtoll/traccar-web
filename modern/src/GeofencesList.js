import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { devicesActions } from "./store";
import EditCollectionView from "./EditCollectionView";

const useStyles = makeStyles(() => ({
  list: {
    maxHeight: "100%",
    overflow: "auto",
  },
  icon: {
    width: "25px",
    height: "25px",
    filter: "brightness(0) invert(1)",
  },
}));

const GeofenceView = ({ onMenuClick }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const items = useSelector((state) => Object.values(state.geofences.items));

  return (
    <List className={classes.list}>
      {items.map((item, index, list) => (
        <Fragment key={item.id}>
          <ListItem
            button
            key={item.id}
            onClick={() => dispatch(devicesActions.select(item))}
          >
            <ListItemText primary={item.name} />
            <ListItemText primary={item.attributes.polygonArea} />
            <ListItemSecondaryAction>
              <IconButton
                onClick={(event) => onMenuClick(event.currentTarget, item.id)}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {index < list.length - 1 ? <Divider /> : null}
        </Fragment>
      ))}
    </List>
  );
};

const GeofencesList = () => (
  <EditCollectionView
    content={GeofenceView}
    editPath="/geofence"
    endpoint="geofences"
    disableAdd
  />
);

export default GeofencesList;
