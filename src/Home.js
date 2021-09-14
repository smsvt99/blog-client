import React, {
    useEffect
  } from "react";

import Post from './Post';
import ServiceCaller from './ServiceCaller';

export default function Home(props) {
    const { posts, setPosts } = props.appState;
  
  
    useEffect(() => {
      (async function getData(){
            const _posts = await new ServiceCaller("GET", "/posts").call();
            setPosts(_posts)
        })();
    }, [setPosts])
  
    return posts ? posts.map(post => <Post post={post} stub={false} key={post._id}/>) 
                 : "loading....";
  }
