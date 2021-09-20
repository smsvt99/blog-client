import {useEffect, useState} from "react";
import ServiceCaller from './ServiceCaller';
import { timeStamp } from "./util";
import A from './A';



export default function Post(props){

    const { post, stub, me } = props;
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
                    <Comments me={me} postId = {post._id}/> 
                </div>
                : null
            }
        </div>
}

function Comments(props){ 

    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    useEffect(()=> {
        if(showComments){
            getComments();
        }
    }, [showComments])

    async function getComments(){
        const _comments = await new ServiceCaller("GET", "/comments")
            .setQueryParams(["post_id", props.postId])
            .call();
        setComments(_comments)
    }

    function loadComments(e){
        setShowComments(true);
    }

    function hideComments(e){
        setShowComments(false);
    }

    if(showComments){
        return <div>
        {props.me.isLoggedIn ? <NewCommentInput postId={props.postId} getComments={getComments}/> : <p className="detail">Log in to leave a comment</p>}
        {comments.length ? <div> {comments.map(comment => <Comment comment={comment} me={props.me}/>)}</div> : <p className="detail">No comments yet</p>}
        <div className="right">
            <A onClick={hideComments}>Hide Comments</A>
        </div>
    </div>
    } else {
        return <div className="right">
            <A onClick={loadComments}>Load Comments</A>
        </div>
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
        <p>{comment.body}</p>
    </div>
}

function NewCommentInput(props){
    const [newComment, setNewComment] = useState("");
    const [showFailure, setShowFailure] = useState(false);

    function onNewCommentChange(e){
        setNewComment(e.target.value);
    }

    async function submit(){
        const res = await new ServiceCaller("POST", "/comments")
            .setBody({
                body: newComment,
                postId: props.postId
            })
            .call();
        if(res.success){
            setNewComment("");
            setShowFailure(false)
            props.getComments();
        } else {
            setShowFailure(true);
        }
    }

    return <div className="form-group">
        <label>New Comment</label>
        {showFailure && <p className="red center">Unable to save comment</p>}
        <textarea rows="5" value={newComment} onChange={onNewCommentChange}/>
        <div className="right">
            <button onClick={submit}>Submit</button>
        </div>
    </div>
}


function Tags(props){
    const { tags } = props;
    return <div className = "flex-row">
        {tags.map(tag => <Tag tag={tag} key={tag._id}/>)}
    </div>
}

function Tag(props){
    const { tag } = props;
    return <p className="tag">{tag.name}</p>
}