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
    new RegExp("static/*"),
    

]
const regUtil={
    desReg:/(\.*\[\!)|(\!\])/ ,//用于判断内容的正在
    srcReg:/(image\(.*\))|(video\(.*\))/ //用于抽取字符的

}

const spliteDesOfChapter = function(des){
    let originList = des.split(regUtil.desReg);//xxx image() xxxx这样的形式
    let desList = originList.map((item)=>{
        let newItem = {
            type:"txt",
            content:"",
        };
        if(regUtil.srcReg.test(item)){
            newItem.type = item.substr(0,5)==="image"?"image":"video"
            newItem.content = item.substring(6,item.lastIndexOf(")"))
        }else if(item === "!]" || item ==="[!" || item === null || item ==="" || item ===undefined){
            return undefined;

        }else {
            newItem = {
                type:"txt",
                content:item,
            };

        }
        return newItem;
    }).filter((item)=>{
        return item !=null;

    })
    return desList;


}
module.exports =[
    ifAllowWithOutCookie,allpathReg
    ,spliteDesOfChapter
]