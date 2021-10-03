import { useState } from 'react';
import ServiceCaller from './ServiceCaller';

export default function SignUp(props){

    const [name, setName] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState("");
    const [notify, setNotify] = useState(false);
    const [validationSuccess, setValidationSuccess] = useState(false);
    const [validationNotes, setValidationNotes] = useState([]);

    function onNameChange(e){
        setName(e.target.value)
    }
    function onPassword1Change(e){
        setPassword1(e.target.value)
    }
    function onPassword2Change(e){
        setPassword2(e.target.value)
    }
    function onEmailChange(e){
        setEmail(e.target.value)
    }
    function onNotifyChange(){
        setNotify(!notify);
    }

    //Mongoose will do real validation
    function preValidate(){
        if(
            name.length      === 0 ||
            password1.length === 0 ||
            password2.length === 0 ||
            email.length     === 0
        ){
            setValidationNotes("All fields are required");
            return false;
        }
        if (password1 !== password2){
            setValidationNotes("Passwords must match");
            return false;
        }
        return true;
    }

    async function submit(){
        if(!preValidate()) return;
        const res = await new ServiceCaller("POST", "/users")
            .setBody({
                email: email,
                password: password1,
                name: name,
                notify: notify
            })
            .call();
            if(res.success){
                //something
                setValidationSuccess(true);
                setValidationNotes(["Success! You can now log in with the credentials you provided."])
            } else {
                // const notes = res.error.errors.map((key, value) => value.message);
                setValidationSuccess(false);
                setValidationNotes(res.error.message)
            }
    }

    return <div id="sign-up">
        <h1>Sign Up</h1>
        <div>
            <div className="form-group">
                <label>Display Name</label>
                <input type="text" value={name} onChange={onNameChange} readOnly={validationSuccess}/>
            </div>

            <div className="form-group">
                <label>Email</label>
                <input type="text" value={email} onChange={onEmailChange} readOnly={validationSuccess}/>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" value={password1} onChange={onPassword1Change} readOnly={validationSuccess}/>
            </div>

            <div className="form-group">
                <label>Password (confirm)</label>
                <input type="password" value={password2} onChange={onPassword2Change} readOnly={validationSuccess}/>
            </div>

            <div className="form-group">
                <label>Notify?</label>
                <p className="detail">
                    <input type="checkbox" value={notify} onChange={onNotifyChange} readOnly={validationSuccess}/>
                    Email me when new posts are published
                </p>
            </div>
            <div className = {validationSuccess ? "center green" : "center red"}>{validationNotes}</div>
            <div className="form-group">
                <button onClick={submit} className="button" disabled={validationSuccess}>Sign Up</button>
            </div>
        </div>
    </div>
}
