document.getElementById('next').onclick = function(){
    let lists = document.getElementsByClassName('slider_item');
    document.getElementById('slider_img').appendChild(lists[0])
    // console.log(lists)
}

document.getElementById('prev').onclick = function(){
    let lists = document.getElementsByClassName('slider_item');
    document.getElementById('slider_img').prepend(lists[lists.length -1])
    // console.log(lists)
}