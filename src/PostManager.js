import {useState, useEffect} from 'react';
import PostEdit from './PostEdit'; 
import Post from './Post';
import ServiceCaller from './ServiceCaller';
import A from './A';

function PostManager(){
    const [postToEdit, setPostToEdit] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        (async function getPosts(){
            const _posts = await new ServiceCaller("GET", "/posts")
                .setQueryParams(["stub", 1])
                .call();
            setPosts(_posts);
        })();
    },[])

    function stopEditing(){
        setPostToEdit(null);
    }

    if(postToEdit){
        return <div>
                    <div className= "right space">
                        <A onClick={stopEditing}>Back to list</A>
                    </div>
                    <PostEdit _id={postToEdit}/>
                </div>
    } else {
        return <div>
            {posts.map(post => <Stub key={post._id} post = {post} setPostToEdit={setPostToEdit} setPosts={setPosts}/>)}
        </div> 

    }
}

function Stub(props){
    const {post, setPostToEdit, setPosts} = props;

    function edit(){
        setPostToEdit(post._id);
    }

    async function remove(){
        const answer = window.confirm(`Are you sure you want to delete '${post.title}'?`);
        if(answer === true){
            const res = await new ServiceCaller("DELETE", "/posts")
                .setQueryParams(["_id", post._id])
                .call();

            if(res.success){
                const _posts = await new ServiceCaller("GET", "/posts")
                    .setQueryParams(["stub", 1])
                    .call();
                setPosts(_posts);
            } else {
                alert("Unable to delete")
            }
        }

    }

    return <div className="flex- stub">
        <div className="left">
            <A onClick={edit}>Edit</A>
            <A additionalClasses="red" onClick={remove}>Delete</A>
        </div>
        <div className="right">
            <Post stub="true" post={post} key={post._id}/>
        </div>

    </div>

}

export default PostManager;