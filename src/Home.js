import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { db, storage, snapshotToArray } from "./firebase";
import uuid from "node-uuid";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Home(props) {
  const [dialog_open, setDialogOpen] = useState();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("items")
      .where("uid", "==", props.user.uid)
      .onSnapshot(snapshot => {
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
      <Button
        color="secondary"
        variant="contained"
        onClick={() => {
          setDialogOpen(true);
        }}
        style={{ marginTop: 10, height: 50 }}
      >
        Add Item
      </Button>
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
  return (
    <Card style={{ maxWidth: 345, marginRight: 10, marginTop: 10 }}>
      <CardActionArea>
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
  );
}

export function AddPhoto(props) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState("");

  const handleSavePhoto = () => {
    // const photo_id = uuid();
    setSaving(true);
    storage
      .ref("photos/" + uuid())
      .put(file)
      .then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          db.collection("items")
            .add({
              title: title,
              image: downloadURL,
              description: description,
              uid: props.user.uid
            })
            .then(() => {
              setTitle("");
              setDescription("");
              setFile(null);
              setSaving(false);
              props.onClose();
            });
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleFile = e => {
    const file = e.target.files[0];
    setFile(file);
    console.log(file);
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add an Item</DialogTitle>
      <DialogContent>
        <TextField
          label="Item Title"
          fullWidth
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
        />
        <TextField
          label="Item Descrption"
          fullWidth
          value={description}
          onChange={e => {
            setDescription(e.target.value);
          }}
        />
        <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          {file && (
            <Typography style={{ marginRight: 20 }}>{file.name}</Typography>
          )}
          <Button component="label" variant="contained">
            Choose a File
            <input
              type="file"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={props.onClose}>
          Cancel
        </Button>
        <div style={{ position: "relative" }}>
          <Button color="primary" variant="contained" onClick={handleSavePhoto}>
            Save
          </Button>
          {saving && (
            <CircularProgress
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12
              }}
              color="secondary"
              size={24}
            />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}
