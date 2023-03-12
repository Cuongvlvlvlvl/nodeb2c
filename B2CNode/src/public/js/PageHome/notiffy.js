// dùng để xóa dấu chấm khi có thông báo đến
    document.getElementsByClassName('center js_show_hide')[0].onclick = function(){
        document.getElementsByClassName('js_seen')[0].classList.remove('seen');
        document.getElementsByClassName('box_info_user')[0].classList.remove('active_box_info_user');
        document.getElementsByClassName('js_fun_show_hide')[0].classList.toggle('js_show_notify');
        document.getElementsByClassName('notification_box')[0].onclick = function(e){
            e.stopPropagation();
        }
        // xóa cái active thông báo đi 
        var li = document.getElementsByClassName('item_notify_header');
        var length_li = li.length;
        for(var i = 0; i < length_li; i++){        
            li[i].onclick = function(){
                if(this.classList.contains('item_notify_header_viewed')){
                    this.classList.remove('item_notify_header_viewed');            
                }
            }
        }
        // đánh dấu là đã đọc tất cả các thông báo
        document.getElementsByClassName('list_notify_header')[0].scrollTop = - document.getElementsByClassName('list_notify_header')[0].scrollHeight;
        document.getElementsByClassName('notification_header')[0].classList.toggle('notification_header_active_js');
        // document.getElementsByClassName('see_all_notify')[0].onclick = function(){
        //     var li = document.getElementsByClassName('item_notify_header');
        //     var length_li = li.length;
        //     for(var i = 0; i < length_li; i++){                    
        //         if(li[i].classList.contains('item_notify_header_viewed')){
        //             li[i].classList.remove('item_notify_header_viewed');            
        //         }
        //     }
        // }
        document.getElementsByClassName('box_search')[0].classList.remove('show_box_search')
        document.getElementsByClassName('test')[0].classList.add('open_overlay');
    }

    // activeOverlay();
    // xử lý đóng mở user 
    document.getElementsByClassName('user_header')[0].onclick = function(){
        document.getElementsByClassName('box_info_user')[0].classList.toggle('active_box_info_user');
        document.getElementsByClassName('notification_header')[0].classList.remove('notification_header_active_js');
        document.getElementsByClassName('js_fun_show_hide')[0].classList.remove('js_show_notify');
        // document.getElementsByClassName('overlay')[0].classList.add('block_overlay');
        // activeOverlay();
        // document.getElementById('overlay').classList.add('open_overlay');
        // console.log(document.getElementById('overlay'))
        document.getElementsByClassName('box_search')[0].classList.remove('show_box_search')
        document.getElementsByClassName('test')[0].classList.add('open_overlay');
    }

    // xử lý khi đóng các box lên khi click ra ngoài box 
    document.getElementsByClassName('test')[0].onclick = function(e){
            document.getElementsByClassName('test')[0].classList.remove('open_overlay')
            document.getElementsByClassName('js_fun_show_hide')[0].classList.remove('js_show_notify');
            document.getElementsByClassName('box_info_user')[0].classList.remove('active_box_info_user');
            document.getElementsByClassName('notification_header')[0].classList.remove('notification_header_active_js');
            document.getElementsByClassName('box_search')[0].classList.remove('show_box_search')
}

// mở box trên mobile
document.getElementsByClassName('user_header_mobile')[0].onclick = function(){
    document.getElementsByClassName('box_notify_mobile')[0].classList.add('show_box_notify_mobile')
    var box_notify_mobile = document.getElementsByClassName('box_notify_mobile')[0];
    // đóng box trên mobile
    document.getElementsByClassName('icon_close')[0].onclick = function(e){
        e.stopPropagation();
        box_notify_mobile.classList.remove('show_box_notify_mobile')
    }
    document.getElementsByClassName('js_fun_show_hide')[0].classList.remove('js_show_notify');
    document.getElementsByClassName('box_info_user')[0].classList.remove('active_box_info_user');
    document.getElementsByClassName('notification_header')[0].classList.remove('notification_header_active_js');
}

document.getElementsByClassName('search_header_input')[0].onclick = function(){
    document.getElementsByClassName('box_search')[0].classList.add('show_box_search')
    document.getElementsByClassName('test')[0].classList.add('open_overlay');
    document.getElementsByClassName('js_fun_show_hide')[0].classList.remove('js_show_notify');
    document.getElementsByClassName('box_info_user')[0].classList.remove('active_box_info_user');
    document.getElementsByClassName('notification_header')[0].classList.remove('notification_header_active_js');
}