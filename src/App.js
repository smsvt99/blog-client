import React, {
  useState,
} from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import TopNav from './TopNav';
import Home from './Home';
import Admin from './Admin';
import SignUp from './SignUp';


export default function App() {
  const [me, setMe] = useState({isLoggedIn: false})
  // const [me, setMe] = useState({isLoggedIn: true, role: "ADMIN"})
  
  const [posts, setPosts] = useState(null);
  // const [tags, setTags] = useState([]);
  // const [users, setUsers] = useState([]);
  // const [comments, setComments] = useState([]);

  const appState = {
    me: me,
    // setMe: setMe,
    posts: posts,
    setPosts: setPosts,
    // tags: tags,
    // setTags: setTags,
    // users: users,
    // setUsers: setUsers,
    // comments: comments,
    // setComments: setComments
  }

  return (
    <div className="app">
      <Router>
      <TopNav me={me} setMe={setMe}/>
        <Switch>

          <Route path="/admin/:option?" render = {() => {
            return me.isLoggedIn && me.role === 'ADMIN'
              ? < Admin />
              : <Redirect to = "/"/>
          }}>
          </Route>

          <Route path="/sign-up">
            <SignUp/>
          </Route>
          
          <Route path="/">
            <Home
              appState = {appState}
            />
          </Route>

          <Route>
            <Redirect to="/"/>
          </Route>

        </Switch>
      </Router>
    </div>
  );
}