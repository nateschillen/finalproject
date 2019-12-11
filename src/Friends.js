import React, { useState, useEffect } from "react";
import { Link, Route } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { AddPhoto } from "./Home";
import { db, storage, snapshotToArray } from "./firebase";

export default function Friends(props) {
  const [dialog_open, setDialogOpen] = useState();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("items").onSnapshot(snapshot => {
      const updated_items = snapshotToArray(snapshot);
      setPhotos(updated_items);
    });
    return unsubscribe;
  }, [props]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        paddingLeft: 10,
        paddingTop: 10
      }}
    >
      {photos.map(p => {
        return <PhotoCard photo={p} />;
      })}
      <AddPhoto
        open={dialog_open}
        onClose={() => {
          setDialogOpen(false);
        }}
        user={props.user}
        photo_id={props.match.params.photo_id}
      />
    </div>
  );
}

export function PhotoCard(props) {
  const [drawer_open, setDrawerOpen] = useState();

  return (
    <div>
      <Card style={{ maxWidth: 345, marginRight: 10, marginTop: 10 }}>
        <CardActionArea
          button
          to={"/app/item/" + props.photo.id}
          component={Link}
          onClick={() => {
            setDrawerOpen(false);
          }}
        >
          <CardMedia height="250" component="img" image={props.photo.image} />
          <CardContent>
            <Typography
              style={{ fontWeight: "bold" }}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {props.photo.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {props.photo.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
