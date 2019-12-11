import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, Route } from "react-router-dom";
import { auth, db, snapshotToArray } from "./firebase";
import { ListItem } from "@material-ui/core";
import Home from "./Home";
import Friends from "./Friends";
import Messages from "./Messages";

export function App(props) {
  const [drawer_open, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dialog_open, setDialogOpen] = useState(false);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("albums")
        .onSnapshot(snapshot => {
          const updated_albums = snapshotToArray(snapshot);
          setAlbums(updated_albums);
        });
    }
  }, [user]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Route
            exact
            path="/app/Home"
            render={routeProps => {
              return (
                <Typography
                  variant="h6"
                  color="inherit"
                  style={{ flexGrow: 1, marginLeft: "30px" }}
                >
                  Home
                </Typography>
              );
            }}
          />
          <Route
            exact
            path="/app/Friends"
            render={routeProps => {
              return (
                <Typography
                  variant="h6"
                  color="inherit"
                  style={{ flexGrow: 1, marginLeft: "30px" }}
                >
                  Friends
                </Typography>
              );
            }}
          />
          <Route
            exact
            path="/app/Messages"
            render={routeProps => {
              return (
                <Typography
                  variant="h6"
                  color="inherit"
                  style={{ flexGrow: 1, marginLeft: "30px" }}
                >
                  Messages
                </Typography>
              );
            }}
          />
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            H! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawer_open}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <ListItem
          button
          to={"/app/Home"}
          component={Link}
          onClick={() => {
            setDrawerOpen(false);
          }}
        >
          Home
        </ListItem>
        <ListItem
          button
          to={"/app/Friends"}
          component={Link}
          onClick={() => {
            setDrawerOpen(false);
          }}
        >
          Friends
        </ListItem>
      </Drawer>
      <Route
        exact
        path="/app/Home"
        render={routeProps => {
          return <Home user={user} {...routeProps} />;
        }}
      />
      <Route
        exact
        path="/app/Friends"
        render={routeProps => {
          return <Friends user={user} {...routeProps} />;
        }}
      />
      <Route
        exact
        path="/app/item/:itemid"
        render={routeProps => {
          return <Messages user={user} {...routeProps} />;
        }}
      />
    </div>
  );
}
