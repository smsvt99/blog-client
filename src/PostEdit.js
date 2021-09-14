import { useState, useEffect } from 'react';
import A from './A';
import ServiceCaller from './ServiceCaller';
import {useHistory} from 'react-router-dom';

export default function PostEdit(props){
    const {_id} = props; //pass null for new post, 

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [published, setPublished] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [didInitialLoad, setDidInitialLoad] = useState(false);
    const [showTagsPicker, setShowTagsPicker] = useState(false);


    const heading = props._id ? "Editing" : "New Post";
    const tagsButton = showTagsPicker ? "" : " Add/ Pick";

    const history = useHistory();


    useEffect(() => {
        if(!didInitialLoad){
            (async function doInitialLoad(){

                const _allTags = await new ServiceCaller("GET", "/tags").call();

                if(_id){
                    const post = await new ServiceCaller("GET", "/posts")
                        .setQueryParams(["_id", _id])
                        .call();
                    setTitle(post.title);
                    setBody(post.body);
                    setTags(post.tags)
                    setPublished(post.published)
                }
                setAllTags(_allTags)
                setDidInitialLoad(true);
                
            })();
        }
    },[])

    function onTitleChange(e){
        setTitle(e.target.value)
    }

    function onBodyChange(e){
        setBody(e.target.value);
    }

    function onPublishedChange(){
        setPublished(!published)
    }

    function toggleTags(){
        setShowTagsPicker(!showTagsPicker);
    }

    async function save(){
        const reqBody = {
            title:title,
            body: body,
            tags: tags,
            published: published
        }

        //editing
        if(_id){ 
            const res = await new ServiceCaller("PATCH", "/posts")
                .setQueryParams(["_id", _id])
                .setBody(reqBody)
                .call();
            if(res.success){
                history.push("/");
            } else {
                alert("Unable to save")
            }
        //new post
        } else { 
            const res = await new ServiceCaller("POST", "/posts")
                .setBody(reqBody)
                .call();
            if(res.success){
                history.push("/");
            } else {
                alert("Unable to save")
            }
        }
    }

    return didInitialLoad ? <div id="post-edit">
        <div className="window-topper"></div>
        <div className="window-body">
        <h2 className="center">{heading}</h2>
        <div>
            <div className="form-group">
                <label>Title</label>
                <input onChange = {onTitleChange} value = {title} type="text"/>
            </div>

            <div className="form-group">
                <div className="flex-row">
                    <label className="pad-right">Tags</label>
                    <A onClick={toggleTags}>{tagsButton}</A>
                </div>
                {showTagsPicker && <div id="tag-select">
                    <div className="right">
                        <A onClick={toggleTags}>✖</A>
                    </div>
                    <NewTag setAllTags = {setAllTags}/>
                    {allTags.map(tag => <TagPicker key={tag._id} tag={tag} tags={tags} setTags={setTags} allTags={allTags}/>)}
                </div>}
            </div>

            <div className="form-group">
                <label>Body</label>
                <textarea rows="25" onChange={onBodyChange} value={body}/>
            </div>

            <div className="form-group">
                <label>
                    Published
                    <input checked={published} onChange={onPublishedChange} className="space-right" type="checkbox"/>
                </label>
            </div>

            <div className="form-group">
                <button onClick={save} className="button">Save</button>
            </div>
        </div>
    </div>


    </div> : <div style={{width: "500px"}}>Loading....</div>

}

function TagPicker(props){
    const {tag, tags, setTags, allTags} = props;

    const isChecked = tags.map(_tag=> _tag._id).includes(tag._id);

    function handleChange(){
        //remove
        if(isChecked){ 
            const _tags = tags.filter(_tag => _tag._id !== tag._id)
            setTags(_tags);
        //add
        } else { 
            const tagsCopy = JSON.parse(JSON.stringify(tags));
            tagsCopy.push(tag);
            setTags(tagsCopy);
        }
    }

    return <div>
        <div className="flex-row tag-option" onClick={handleChange}>
            <input onChange={handleChange} checked={isChecked} type="checkbox"/> 
            <label>{tag.name}</label>
        </div>
    </div>
    
}

function NewTag(props){

    const [name, setName] = useState("");

    function onNameChange(e){
        setName(e.target.value)
    }

    async function save(){
        const res = await new ServiceCaller("POST", "/tags")
            .setBody({name: name})
            .call();
        if(res.success){
            const _allTags = await new ServiceCaller("GET", "/tags").call();
            props.setAllTags(_allTags)
        } else {
            alert("Unable to save tag")
        }
    }

    return <div>
        <p>Add New Tag</p>
        <input onChange={onNameChange} value={name} type="text"/>
        <button onClick={save}>Enter</button>
        <hr/>
    </div>
}