//like <a>, but sensitive to symantics
export default function A(props){
   
    let { additionalClasses, onClick, children } = props;
    if(!additionalClasses){
        additionalClasses = "";
    }
    return <button className={`A ${additionalClasses}`} onClick={onClick}>{children}</button>
}