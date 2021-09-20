export function timeStamp(ts){
    return ts.split('T')[0];
}

export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;