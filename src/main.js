const $siteList = $('.siteList')
const $lastLi= $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject =JSON.parse(x)
const hashMap =xObject || [
    {logo:'A', url :'https://www.acfun.cn'},
    {logo:'B',  url :'https://www.bilibili.com'}
]
const urlDemo =(url) =>{
    return url.replace('https://', '')
    .replace( 'http://', '')
    .replace( 'www.', '')
    .replace(/\/.*/,'')  //删除 / 开头的内容
}
//创建渲染
hashMap.forEach(node=>{
    const $li = $(`<li>
     <a href="${node.url}">
            <div class="site">
            <div class="logo">${node.logo[0]}</div>
            <div class="link">${node.url}</div>
            </div>
        </a>
    </li>`).insertBefore($lastLi)
})
const render = ()=>{
    //渲染哈希之前需把之前的给清空了
    $siteList.find('li:not(.last)').remove() 
    hashMap.forEach((node,index)=>{
        // console.log(index)    
        const $li = $(`<li>
                <div class="site">
                <div class="logo">${node.logo[0]}</div>
                <div class="link">${urlDemo(node.url)}</div>
                <div class="close">
                    <svg class="icon">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
                </div>
        </li>`).insertBefore($lastLi)
        
        $li.on('click',()=>{
            window.open(node.url)
        })
        $li.on('click','.close',(e)=>{
            // console.log('这里')
            e.stopPropagation()
            hashMap.splice(index, 1)
            render()
        })
    })
}
render()

$('.addButton')
.on('click',()=>{
    let url = window.prompt('请问你要添加的网址是啥？')
    if (url.indexOf('http') !== 0 ){
        url = 'http://'+ url
    }
    //当你点击的时候我不在创造li了，我需要push一个到哈希map里
    hashMap.push({
        logo:urlDemo(url)[0].toUpperCase(),
        url:url
    })
    //做完之后，需要吧上面的forEach重新执行一遍，但是你会发现，会重叠！！！
    //所以需要哈希里面单独渲染，新增的这个站点
    // $siteList.find('li:not(.last)').remove() //不要最后一个
    // hasMap.forEach(node=>{
    //     const $li = $(`<li>
    //         <a href="${node.url}">
    //             <div class="site">
    //             <div class="logo">${node.logo[0]}</div>
    //             <div class="link">${node.url}</div>
    //             </div>
    //         </a>
    //     </li>`).insertBefore($lastLi)
    // })
    render()
})

window.onbeforeunload = ()=>{
//console.log('页面要关闭了')
const string =JSON.stringify(hashMap)
//console.log(typeof string)
//变成字符串之后就可以存到 window.localStorage 里面
localStorage.setItem('x',string)
//意思就是在本地的存储里面设置一个x,里面存着的就是string

}
// 监听键盘按下事件
$(document).on('keypress', (e) => {
    const {key} = e
    for (let i = 0; i < hashMap.length; i++) {
      if (hashMap[i].logo.toLowerCase() === key) {
        window.open(hashMap[i].url)
        }   
    }
})