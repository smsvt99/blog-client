import { useState } from 'react';
import ServiceCaller from './ServiceCaller';
import { useHistory, withRouter, Link, useLocation, Redirect } from 'react-router-dom';
import A from './A';

function TopNav(props){
    const {me, setMe} = props;
    const [showForm, setShowForm] = useState(false);
    const location = useLocation();
    const onAdmin = location.pathname.includes('admin')
    
    async function logout(){
        const _me = await new ServiceCaller("GET", "/logout").call();
        setMe(_me);
    }

    async function toggleFormVisibility(e){
        //before opening form, ask server if session exists and inform UI
        if(!showForm){
            const _me = await new ServiceCaller("GET", "/me").call();
            if(me.isLogged){
                setMe(_me); //i.e., and don't open form
            } else {
                setShowForm(!showForm);
            }
        } else {
            setShowForm(!showForm);
        }
    }

    const menuOptions = [];
    if(me.isLoggedIn){
        menuOptions.push(me.name)
       !onAdmin && me.role === "ADMIN" && menuOptions.push(<Link to="/admin/new_post"><A>Dashboard</A></Link>)
        onAdmin && menuOptions.push(<Link to="/"><A>Main Site</A></Link>)
        menuOptions.push(<A onClick={logout}>Logout</A>)
    } else {
        menuOptions.push(<A onClick={toggleFormVisibility}>Login</A>)
    }

    const menu = menuOptions.map((item, i) => {
        const separator = i === 0 ? "" : " | "
        return <span key={`menu_${i}`}>{separator}{item}</span>;
    })

    return <div id="top-nav">
        <div>{menu}</div>
        { showForm ? <LoginForm me={me} setMe={setMe} toggle={toggleFormVisibility}/> : null}
    </div>

}

export default withRouter(TopNav)

function LoginForm(props){

    const {me, setMe, toggle} = props;

    const [username, setUsername] = useState(""); //it's an email address
    const [password, setPassword] = useState("");
    const [showFailure, setShowFailure] = useState(false);

    const history = useHistory();

    function onPasswordChange(e){
        setPassword(e.target.value);
    }

    function onUsernameChange(e){
        setUsername(e.target.value)
    }

    async function login(){
        const _me = await new ServiceCaller("POST", "/login")
            .setBody({
                username: username,
                password: password
            })
            .call();
        
        if(_me.isLoggedIn ){
            toggle();
            setMe(_me);
            history.push('/admin/new_post');
        } else {
            setShowFailure(true)
        }
    }

    return <div id="login">
        <div className="right">
            <A onClick={toggle}>✖</A>
        </div>
        <h2 className="center space">Login</h2>
        {showFailure && <p className="red center">Invalid credentials</p>}
        
        <div className="form-group">
            <label >Email:</label>
            <input value={username} onChange={onUsernameChange}/>
        </div>

        <div className="form-group">
            <label>Password:</label>
            <input  type="password" value={password} onChange={onPasswordChange}/>
        </div>

        <div className="form-group">
            <button className="button" onClick={login}>Submit</button>
        </div>
        <p className="detail right">
            <A>Sign Up</A>
        </p>
    </div>


}