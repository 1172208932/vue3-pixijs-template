export function throttle(fn:Function,delay=100){
    //首先设定一个变量，在没有执行我们的定时器为null
    let timer:NodeJS.Timeout|null = null;
    return function (){
        //当我们发现这个定时器存在时，则表示定时器已经在运行中，需要返回
        if(timer) return;
        fn.apply(fn,arguments);
        timer =setTimeout(()=>{
            timer = null;
        },delay)
    }
}
