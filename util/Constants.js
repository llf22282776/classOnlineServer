 const ifAllowWithOutCookie = function (path) {
    //通过检测就行
    for(let a in allpathReg){
        console.log(path);
        if( allpathReg[a].test(path) === true)return true;//通过
    }

    return false;

}
const allpathReg = [
    new RegExp("users/*"),
    new RegExp("static/*")

]
module.exports =[
    ifAllowWithOutCookie,allpathReg
]