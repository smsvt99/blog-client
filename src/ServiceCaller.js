export default class ServiceCaller{
    endPoint;
    queryParams = [];
    options = {
        credentials: 'include',
    }

    constructor(method, endPoint){
        this.options.method = method;
        this.endPoint = endPoint;
        return this;
    }

    setQueryParams = ([key, value]) => {
        this.queryParams.push([key, value])
        return this;
    }

    setBody = (obj) => {
        this.options.body = JSON.stringify(obj);
        return this;
    }

    setAdditionalOptions = (obj) => {
        //do I need this?
    }

    call = async () =>{
        if(["POST", "PATCH"].includes(this.options.method)){
            this.options.headers = {
                'Content-Type': 'application/json'
              }
        }
        this.applyQueryParams();
        const response = await fetch(this.endPoint, this.options);
        return await response.json();
    }

    //private
    applyQueryParams = () => {
        this.queryParams.forEach(([key, value], i) => {
            const separator = i === 0 ? "?" : "&";
            this.endPoint += separator + key + "=" + value;
        })
    }
}
