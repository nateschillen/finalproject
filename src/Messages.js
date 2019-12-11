import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { PhotoCard } from "./Friends";
import { db } from "./firebase";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default function Messages(props) {
  const [data, setData] = useState({});
  const [save_data, setSaveData] = useState();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("items")
      .doc(props.match.params.itemid)
      .collection("comments")
      .onSnapshot(z => {
        const com = [];
        z.forEach(s => {
          const data = s.data();
          data.id = s.id;
          com.push(data);
          console.log(com);
        });
        setComments(com);
      });
    return unsubscribe;
  }, [props]);

  useEffect(() => {
    const unsubscribe = db
      .collection("items")
      .doc(props.match.params.itemid)
      .onSnapshot(s => {
        const data = s.data();
        data.id = s.id;
        setData(data);
      });
    return unsubscribe;
  }, [props]);

  const handleAddFunction = () => {
    db.collection("items")
      .doc(props.match.params.itemid)
      .collection("comments")
      .add({
        comment: save_data
      })
      .then(() => {
        setSaveData("");
      });
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <PhotoCard photo={data} />

      <TextField
        style={{ marginTop: 40 }}
        id="filled-multiline-static"
        label="Leave Comments Here!"
        multiline
        rows="3"
        placeholder="comment"
        variant="filled"
        value={save_data}
        onChange={e => {
          setSaveData(e.target.value);
        }}
      />
      <Button
        style={{ width: 200 }}
        variant="contained"
        onClick={handleAddFunction}
      >
        Save
      </Button>
      <Paper style={{ width: 200, marginTop: 20, marginBottom: 20 }}>
        Comments
        <Typography>
          {comments.map(c => {
            return (
              <Paper>
                <Typography variant="h5" component="h3">
                  {c.comment}{" "}
                </Typography>
              </Paper>
            );
          })}
        </Typography>
      </Paper>
    </div>
  );
}
