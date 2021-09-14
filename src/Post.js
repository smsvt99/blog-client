import {useEffect, useState} from "react";
import ServiceCaller from './ServiceCaller';
import { timeStamp } from "./util";
import A from './A';



export default function Post(props){

    const { post, stub } = props;
    const { user } = post;

    const edited = post.createdAt !== post.updatedAt;

    return<div className="post">
            {stub ? <h2>{post.title}</h2> : <h1>{post.title}</h1> }
            <p>By {user.name}</p>
            <p className="detail">Published {timeStamp(post.createdAt)}</p>
            { edited ? <p className="detail">Edited {timeStamp(post.updatedAt)}</p> : null}
            { !stub ? <div>
                    <Tags tags ={post.tags}/>
                    <hr/>
                    <p>{post.body}</p>
                    <hr/>
                    <Comments postId = {post._id}/> 
                </div>
                : null
            }
        </div>
}

function Comments(props){

    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    useEffect(()=> {
        (async function getComments(){
            if(showComments){
                const _comments = await new ServiceCaller("GET", "/comments")
                    .setQueryParams(["post_id", props.postId])
                    .call();
                setComments(_comments)
            }  
        })();

    }, [showComments])

    function loadComments(e){
        setShowComments(true);
    }

    function hideComments(e){
        setShowComments(false);
    }

    if(showComments){
        return <div>
        {comments.map(comment => <Comment comment={comment} />)}
        <A onClick={hideComments}>Hide Comments</A>
    </div>
    } else {
        return <A onClick={loadComments}>Load Comments</A>
    }
}

function Comment(props){
    const {comment} = props;
    const { user } = comment;

    const edited = comment.createdAt !== comment.updatedAt;

    return <div className = "comment">
        <div className = "flex-row align-base">
            <p>{user.name}</p>
            <p className="detail">{timeStamp(comment.createdAt)}</p>
        </div>
        { edited ? <p className="detail">Edited {timeStamp(comment.updatedAt)}</p> : null }
        <hr/>
        <p>{comment.body}</p>
    </div>
}


function Tags(props){
    const { tags } = props;
    return <div clasName = "flex-row">
        {tags.map(tag => <Tag tag={tag} key={tag._id}/>)}
    </div>
}

function Tag(props){
    const { tag } = props;
    return <p className="tag">{tag.name}</p>
}